// Copyright 2019, University of Colorado Boulder

/**
 * Node that represents a playObject in the view.
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
  const PlayObjectType = require( 'NUMBER_PLAY/common/model/PlayObjectType' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  // images
  const dogImage = require( 'image!NUMBER_PLAY/dog.png' );
  const appleImage = require( 'image!NUMBER_PLAY/apple.png' );
  const turtleImage = require( 'image!NUMBER_PLAY/turtle.png' );
  const circleImage = require( 'image!NUMBER_PLAY/circle.png' );

  // convenience map that links playObject types to their corresponding images
  const mapPlayObjectTypeToImage = {};
  mapPlayObjectTypeToImage[ PlayObjectType.DOG ] = dogImage;
  mapPlayObjectTypeToImage[ PlayObjectType.APPLE ] = appleImage;
  mapPlayObjectTypeToImage[ PlayObjectType.TURTLE ] = turtleImage;
  mapPlayObjectTypeToImage[ PlayObjectType.CIRCLE ] = circleImage;

  class PlayObjectNode extends Node {

    /**
     * @param {PlayObject} playObject
     * @param {Bounds2} playAreaBounds
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( playObject, playAreaModelBounds, modelViewTransform ) {
      super();

      // @private
      this.playObject = playObject;

      // update the image node when the playObjectType changes
      playObject.playObjectTypeProperty.link( playObjectType => {
        this.removeAllChildren();
        this.addChild( this.createPlayObjectImageNode( playObjectType ) );
      } );

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

    /**
     * Creates the image for a PlayObjectNode.
     *
     * @param {PlayObjectType} PlayObjectType
     * @returns {Image}
     */
    createPlayObjectImageNode( playObjectType ) {
      const playObjectImageNode = new Image( mapPlayObjectTypeToImage[ playObjectType ], {
        maxWidth: this.playObject.size.width,
        maxHeight: this.playObject.size.height,
        cursor: 'pointer'
      } );
      playObjectImageNode.center = Vector2.ZERO;
      return playObjectImageNode;
    }
  }


  return numberPlay.register( 'PlayObjectNode', PlayObjectNode );
} );