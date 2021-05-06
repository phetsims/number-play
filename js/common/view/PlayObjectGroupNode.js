// Copyright 2021, University of Colorado Boulder

/**
 * Node that represents a playObjectGroup in the view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import numberPlay from '../../numberPlay.js';
import cornerPeelImage from '../../../images/corner-peel_png.js';

class PlayObjectGroupNode extends Node {

  /**
   * @param {PlayObjectGroup} playObjectGroup
   * @param {Bounds2} playAreaModelBounds
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( playObjectGroup, playAreaModelBounds, modelViewTransform ) {
    super();

    // @private
    this.playObjectGroup = playObjectGroup;

    // update the offset when the model position changes
    playObjectGroup.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // update the offset when the model position changes
    playObjectGroup.widthProperty.link( width => {
      this.removeAllChildren();
      this.addChild( this.createPlayObjectImageNode() );
    } );

    // add a DragListener to handle user dragging
    this.addInputListener( new DragListener( {
      positionProperty: playObjectGroup.positionProperty,
      transform: modelViewTransform,
      dragBoundsProperty: new Property( playAreaModelBounds ),
      start: event => {
        playObjectGroup.userControlledProperty.set( true );
        this.moveToFront();
      },
      end: () => {
        playObjectGroup.userControlledProperty.set( false );
      }
    } ) );
  }

  /**
   * Creates the background for a PlayObjectGroupNode.
   *
   * @returns {Node}
   * @private
   */
  createPlayObjectImageNode() {
    const backgroundNode = new Rectangle( 0, -this.playObjectGroup.spotSize.height,
      this.playObjectGroup.widthProperty.value, this.playObjectGroup.height, {
      cursor: 'pointer',
      fill: '#e8f6ff',
      cornerRadius: 10
    } );

    // create and add the corner peel
    const cornerPeelImageNode = new Image( cornerPeelImage, {
      maxHeight: 18,
      top: backgroundNode.top,
      right: backgroundNode.right
    } );
    backgroundNode.addChild( cornerPeelImageNode );

    // create and add the grippy lines
    const yMargin = 7; // empirically determined
    const lineLength = 45; // empirically determined
    const lineSeparation = 4; // empirically determined
    const grippyLines = new Path( new Shape()
      .moveTo( 0, 0 ).lineTo( lineLength, 0 ).moveTo( 0, lineSeparation ).lineTo( lineLength, lineSeparation ).close(), {
      stroke: 'rgb( 204, 204, 204 )',
      lineWidth: 2,
      centerX: backgroundNode.centerX,
      bottom: backgroundNode.bottom - yMargin
    } );
    backgroundNode.addChild( grippyLines );

    return backgroundNode;
  }
}

numberPlay.register( 'PlayObjectGroupNode', PlayObjectGroupNode );
export default PlayObjectGroupNode;