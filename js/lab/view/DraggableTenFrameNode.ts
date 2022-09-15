// Copyright 2019-2022, University of Colorado Boulder

/**
 * A ten frame node that can be dragged around and hold play objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TProperty from '../../../../axon/js/TProperty.js';
import PaperNumber from '../../../../counting-common/js/common/model/PaperNumber.js';
import PaperNumberNode from '../../../../counting-common/js/common/view/PaperNumberNode.js';
import ReturnButton from '../../../../scenery-phet/js/buttons/ReturnButton.js';
import { DragListener, Node, PressListenerEvent } from '../../../../scenery/js/imports.js';
import TenFrameNode from '../../common/view/TenFrameNode.js';
import numberPlay from '../../numberPlay.js';
import TenFrame from '../model/TenFrame.js';

type SelfOptions = {
  dropListener: () => void;
  removeCountingObjectListener: ( countingObject: PaperNumber ) => void;
  getCountingObjectNode: ( countingObject: PaperNumber ) => PaperNumberNode;
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
        this.moveToFront();
        tenFrame.countingObjects.forEach( countingObject => {
          const countingObjectNode = options.getCountingObjectNode( countingObject );
          countingObjectNode.moveToFront();
        } );
      },
      drag: () => {
        tenFrame.countingObjects.forEach( countingObject => {
          countingObject.setDestination( tenFrame.getCountingObjectSpot( countingObject ), false );
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
      const countingObjectNode = options.getCountingObjectNode( countingObject );

      // make the countingObjectNode pickable:false instead of inputEnabled:false because we still want to be able to
      // drag this tenFrameNode that the countingObjectNode is on top of
      countingObjectNode.pickable = false;

      // animate the countingObject to the next available space in the ten frame
      countingObject.setDestination( tenFrame.getCountingObjectSpot( countingObject ), true );
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
}

numberPlay.register( 'DraggableTenFrameNode', DraggableTenFrameNode );
export default DraggableTenFrameNode;