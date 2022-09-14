// Copyright 2019-2022, University of Colorado Boulder

/**
 * A ten frame node that can be dragged around and hold play objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TProperty from '../../../../axon/js/TProperty.js';
import PaperNumber from '../../../../counting-common/js/common/model/PaperNumber.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ReturnButton from '../../../../scenery-phet/js/buttons/ReturnButton.js';
import { DragListener, Node, PressListenerEvent } from '../../../../scenery/js/imports.js';
import TenFrameNode from '../../common/view/TenFrameNode.js';
import numberPlay from '../../numberPlay.js';
import TenFrame from '../model/TenFrame.js';

type SelfOptions = {
  dropListener: () => void;
  removeCountingObjectListener: ( countingObject: PaperNumber ) => void;
};
type DraggableTenFrameNodeOptions = SelfOptions;

class DraggableTenFrameNode extends Node {
  public readonly tenFrame: TenFrame;
  public readonly dragListener: DragListener;

  public constructor( tenFrame: TenFrame, selectedTenFrameProperty: TProperty<TenFrame | null>,
                      options: DraggableTenFrameNodeOptions ) {
    super();

    this.tenFrame = tenFrame;

    const tenFrameNode = TenFrameNode.getTenFramePath( {
      sideLength: TenFrame.SQUARE_SIDE_LENGTH
    } );
    this.addChild( tenFrameNode );

    const returnButton = new ReturnButton( () => {
      tenFrame.removeCountingObject();
    }, {
      visible: false
    } );
    returnButton.x = tenFrameNode.left - returnButton.width - 5;
    this.addChild( returnButton );

    this.dragListener = new DragListener( {
      targetNode: this,
      positionProperty: tenFrame.positionProperty,
      start: () => {
        selectedTenFrameProperty.value = tenFrame;
        // this.moveToFront(); TODO: uncomment
        // TODO: move all paper numbers to front too
      },
      drag: () => {
        tenFrame.countingObjects.forEach( countingObject => {
          countingObject.setDestination( this.getCountingObjectSpot( countingObject ), false );
        } );
      },
      end: () => {
        options.dropListener();
      }
    } );

    this.cursor = 'pointer';
    this.addInputListener( DragListener.createForwardingListener( ( event: PressListenerEvent ) => {
      this.dragListener.press( event, this );
    } ) );

    tenFrame.positionProperty.link( position => {
      this.translation = position;
    } );

    tenFrame.scaleProperty.link( scale => {
      this.setScaleMagnitude( scale );
    } );

    tenFrame.countingObjects.addItemAddedListener( countingObject => {
      // TODO: make paper number inputEnabled = false, or something that passes drags through to the ten frame
      countingObject.setDestination( this.getCountingObjectSpot( countingObject ), true );
    } );

    tenFrame.countingObjects.addItemRemovedListener( countingObject => {
      options.removeCountingObjectListener( countingObject );
    } );

    // show the return button if we this is the selected ten frame and if there's at least one counting object contained
    // in the ten frame
    Multilink.lazyMultilink( [ selectedTenFrameProperty, tenFrame.countingObjects.lengthProperty ],
      ( selectedTenFrame, numberOfCountingObjects ) => {
        returnButton.visible = selectedTenFrame === tenFrame && numberOfCountingObjects > 0;
      } );
  }

  /**
   * Calculates the position of the given paper number in the ten frame based on its index in the ar
   */
  private getCountingObjectSpot( countingObject: PaperNumber ): Vector2 {
    const countingObjectSpotLocalPosition = this.tenFrame.spotCenters[ this.tenFrame.countingObjects.indexOf( countingObject ) ];
    const countingObjectSpotCenter = this.tenFrame.positionProperty.value.plus( countingObjectSpotLocalPosition );

    const countingObjectOffset = countingObject.localBounds.center;
    return countingObjectSpotCenter.minus( countingObjectOffset );
  }
}

numberPlay.register( 'DraggableTenFrameNode', DraggableTenFrameNode );
export default DraggableTenFrameNode;