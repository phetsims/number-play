// Copyright 2019-2022, University of Colorado Boulder

/**
 * A ten frame node that can be dragged around and hold play objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { DragListener, Node, PressListenerEvent } from '../../../../scenery/js/imports.js';
import TenFrameNode from '../../common/view/TenFrameNode.js';
import numberPlay from '../../numberPlay.js';
import TenFrame from '../model/TenFrame.js';

class DraggableTenFrameNode extends Node {
  public readonly tenFrame: TenFrame;
  public readonly dragListener: DragListener;

  public constructor( tenFrame: TenFrame, dropListener: () => void ) {
    super();

    this.tenFrame = tenFrame;

    const tenFrameNode = TenFrameNode.getTenFramePath( {
      sideLength: tenFrame.squareSideLength
    } );
    this.addChild( tenFrameNode );

    this.dragListener = new DragListener( {
      targetNode: this,
      positionProperty: tenFrame.positionProperty,
      end: () => {
        dropListener();
      }
    } );

    this.cursor = 'pointer';
    // TODO: add a 'dragging' bar and make only that have a forwarding listener
    this.addInputListener( DragListener.createForwardingListener( ( event: PressListenerEvent ) => {
      this.dragListener.press( event, this );
      this.moveToFront();
    } ) );

    tenFrame.positionProperty.link( position => {
      this.translation = position;
    } );
  }
}

numberPlay.register( 'DraggableTenFrameNode', DraggableTenFrameNode );
export default DraggableTenFrameNode;