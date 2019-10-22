// Copyright 2019, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  // images
  const dogImage = require( 'image!NUMBER_PLAY/dog.png' );

  class PlayObjectNode extends Node {

    /**
     * @param {PlayObject} playObject
     * @param {Bounds2} playAreaBounds
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( playObject, playAreaModelBounds, modelViewTransform ) {
      super();

      const dogImageNode = new Image( dogImage, {
        maxWidth: playObject.size.width,
        maxHeight: playObject.size.height,
        cursor: 'pointer'
      } );
      dogImageNode.center = Vector2.ZERO;
      this.addChild( dogImageNode );

      // update the offset when the model position changes
      playObject.positionProperty.link( position => {
        this.translation = modelViewTransform.modelToViewPosition( position );
      } );

      // update the scale factor when it changes
      playObject.scaleProperty.lazyLink( scale => {
        this.setScaleMagnitude( scale );
      } );

      // add a DragListener to handle user dragging
      this.addInputListener( new DragListener( {
        locationProperty: playObject.positionProperty,
        transform: modelViewTransform,
        dragBoundsProperty: new Property( playAreaModelBounds ),
        start: event => {
          playObject.userControlledProperty.set( true );
          this.moveToFront();
        },
        end: () => {
          playObject.userControlledProperty.set( false );
        }
      } ) );
    }
  }

  return numberPlay.register( 'PlayObjectNode', PlayObjectNode );
} );