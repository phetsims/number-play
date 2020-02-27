// Copyright 2019-2020, University of Colorado Boulder

/**
 *  A ten frame node that can be dragged around and hold play objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import TenFrameNode from '../../common/view/TenFrameNode.js';
import numberPlay from '../../numberPlay.js';

class DraggableTenFrameNode extends Node {

  /**
   * @param {number} sideLength - see doc below
   * @param {Vector2} initialPosition
   */
  constructor( tenFrame, modelViewTransform, dropListener ) {
    super();

    // @public {TenFrame}
    this.tenFrame = tenFrame;

    const tenFrameNode = TenFrameNode.getTenFramePath( {
      sideLength: tenFrame.squareSideLength
    } );
    tenFrameNode.center = new Vector2( 0, -tenFrameNode.height / 2 );
    this.addChild( tenFrameNode );

    // @public {DragListener}
    this.dragListener = new DragListener( {
      targetNode: this,
      transform: modelViewTransform,
      positionProperty: tenFrame.positionProperty,
      end: () => {
        dropListener();
      }
    } );

    this.cursor = 'pointer';
    // TODO: add a 'dragging' bar and make only that have a forwarding listener
    this.inputListeners = [ DragListener.createForwardingListener( event => {
      this.dragListener.press( event, this );
      this.moveToFront();
    } ) ];

    tenFrame.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );
  }
}

numberPlay.register( 'DraggableTenFrameNode', DraggableTenFrameNode );
export default DraggableTenFrameNode;