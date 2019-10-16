// Copyright 2019, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Animation = require( 'TWIXT/Animation' );
  const Image = require( 'SCENERY/nodes/Image' );
  const DragListener = require( 'SCENERY_PHET/listeners/DragListener' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  // images
  const dogImage = require( 'image!NUMBER_PLAY/dog.png' );

  // constants
  const SCALE_ANIMATION_DURATION = 0.3; // in seconds, empirically determined

  class PlayObjectNode extends Node {

    /**
     * @param {PlayObject} playObject
     * @param {Bounds2} playAreaBounds
     * @param {ModelViewTransform2} modelViewTransform
     * @param {number} objectScaleFactor
     */
    constructor( playObject, playAreaModelBounds, modelViewTransform, scaleFactorInPlayArea ) {
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

      // update the scale factor
      if ( scaleFactorInPlayArea !== 1 ) {
        playObject.scaledUpProperty.lazyLink( scaleUp => {
          if ( scaleUp && this.width < playObject.size.width * scaleFactorInPlayArea ) {
            const scaleUpAnimation = new Animation( {
              setValue: value => { this.setScaleMagnitude( value ); },
              from: 1,
              to: scaleFactorInPlayArea,
              duration: SCALE_ANIMATION_DURATION
            } );
            scaleUpAnimation.start();
          }
          else if ( !scaleUp && this.width > playObject.size.width ) {
            const scaleDownAnimation = new Animation( {
              setValue: value => { this.setScaleMagnitude( value ); },
              from: scaleFactorInPlayArea,
              to: 1,
              duration: SCALE_ANIMATION_DURATION
            } );
            scaleDownAnimation.start();
          }
        } );
      }

      // add a DragListener to handle user dragging
      this.addInputListener( new DragListener( {
        locationProperty: playObject.positionProperty,
        modelViewTransform: modelViewTransform,
        dragBoundsProperty: new Property( playAreaModelBounds ),
        startDrag: event => {
          playObject.userControlledProperty.set( true );
          this.moveToFront();
        },
        endDrag: () => {
          playObject.userControlledProperty.set( false );
        }
      } ) );
    }
  }

  return numberPlay.register( 'PlayObjectNode', PlayObjectNode );
} );