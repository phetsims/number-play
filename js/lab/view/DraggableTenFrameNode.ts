// Copyright 2019-2021, University of Colorado Boulder

/**
 * A ten frame node that can be dragged around and hold play objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { DragListener, SceneryEvent } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import TenFrameNode from '../../common/view/TenFrameNode.js';
import numberPlay from '../../numberPlay.js';
import TenFrame from '../model/TenFrame.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

class DraggableTenFrameNode extends Node {
  private readonly tenFrame: TenFrame;
  public readonly dragListener: DragListener;

  constructor( tenFrame: TenFrame, modelViewTransform: ModelViewTransform2, dropListener: () => void ) {
    super();

    this.tenFrame = tenFrame;

    const tenFrameNode = TenFrameNode.getTenFramePath( {
      sideLength: tenFrame.squareSideLength
    } );
    tenFrameNode.center = new Vector2( 0, -tenFrameNode.height / 2 );
    this.addChild( tenFrameNode );

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
    this.inputListeners = [ DragListener.createForwardingListener( ( event: SceneryEvent ) => {
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