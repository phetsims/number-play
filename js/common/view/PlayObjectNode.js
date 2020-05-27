// Copyright 2019-2020, University of Colorado Boulder

/**
 * Node that represents a playObject in the view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import appleImage from '../../../images/apple_png.js';
import ballImage from '../../../images/ball_png.js';
import dogImage from '../../../images/dog_png.js';
import turtleImage from '../../../images/turtle_png.js';
import numberPlay from '../../numberPlay.js';
import PlayObjectType from '../model/PlayObjectType.js';

// convenience map that links playObject types to their corresponding images
const mapPlayObjectTypeToImage = {};
mapPlayObjectTypeToImage[ PlayObjectType.DOG ] = dogImage;
mapPlayObjectTypeToImage[ PlayObjectType.APPLE ] = appleImage;
mapPlayObjectTypeToImage[ PlayObjectType.TURTLE ] = turtleImage;
mapPlayObjectTypeToImage[ PlayObjectType.BALL ] = ballImage;

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
      positionProperty: playObject.positionProperty,
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
   * @private
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

numberPlay.register( 'PlayObjectNode', PlayObjectNode );
export default PlayObjectNode;