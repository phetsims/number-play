// Copyright 2019-2022, University of Colorado Boulder

/**
 * A ten frame node that can be dragged around and hold play objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import PaperNumber from '../../../../counting-common/js/common/model/PaperNumber.js';
import Vector2 from '../../../../dot/js/Vector2.js';
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
      sideLength: TenFrame.SQUARE_SIDE_LENGTH
    } );
    this.addChild( tenFrameNode );

    this.dragListener = new DragListener( {
      targetNode: this,
      positionProperty: tenFrame.positionProperty,
      start: () => {
        // this.moveToFront(); TODO: uncomment
        // TODO: move all paper numbers to front too
      },
      drag: () => {
        tenFrame.paperNumbers.forEach( paperNumber => {
          paperNumber.setDestination( this.getPaperNumberSpot( paperNumber ), false );
        } );
      },
      end: () => {
        dropListener();
      }
    } );

    this.cursor = 'pointer';
    this.addInputListener( DragListener.createForwardingListener( ( event: PressListenerEvent ) => {
      this.dragListener.press( event, this );
    } ) );

    tenFrame.positionProperty.link( position => {
      this.translation = position;
    } );

    tenFrame.paperNumbers.addItemAddedListener( paperNumber => {
      // TODO: make paper number inputEnabled = false, or something that passes drags through to the ten frame
      paperNumber.setDestination( this.getPaperNumberSpot( paperNumber ), true );
    } );
  }

  /**
   * Calculates the position of the given paper number in the ten frame based on its index in the ar
   */
  private getPaperNumberSpot( paperNumber: PaperNumber ): Vector2 {
    const paperNumberSpotLocalPosition = this.tenFrame.spotCenters[ this.tenFrame.paperNumbers.indexOf( paperNumber ) ];
    const paperNumberSpotCenter = this.tenFrame.positionProperty.value.plus( paperNumberSpotLocalPosition );

    const paperNumberOffset = paperNumber.localBounds.center;
    return paperNumberSpotCenter.minus( paperNumberOffset );
  }
}

numberPlay.register( 'DraggableTenFrameNode', DraggableTenFrameNode );
export default DraggableTenFrameNode;