// Copyright 2022, University of Colorado Boulder

/**
 * Panel that contains a stack of  paper ones or objects, which can be clicked or dragged to create draggable
 * paper ones or objects. It also contains spinner buttons that can send a paper one or object out of the panel, or
 * request them to be brought back into the panel.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { DragListener, PressListenerEvent, Rectangle } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import TenFrameNode from '../../common/view/TenFrameNode.js';
import TenFrame from '../model/TenFrame.js';
import LabModel from '../model/LabModel.js';
import LabScreenView from './LabScreenView.js';
import NumberPlayCreatorPanel from '../../common/view/NumberPlayCreatorPanel.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';

class TenFrameCreatorPanel extends NumberPlayCreatorPanel {

  public constructor( model: LabModel, screenView: LabScreenView ) {

    // create the ten frame icon and the plus icon
    const tenFrameIconNode = TenFrameNode.getTenFramePath( {
      sideLength: 20,
      lineWidth: 0.8
    } );

    const creatorNodeBackground = new Rectangle( 0, 0,
      tenFrameIconNode.width,
      // TODO: Factor out with OnesCreatorPanel
      CountingCommonConstants.SINGLE_COUNTING_OBJECT_BOUNDS.height * NumberPlayConstants.GROUPED_STORED_COUNTING_OBJECT_SCALE + 5
    );
    tenFrameIconNode.center = creatorNodeBackground.center;
    creatorNodeBackground.addChild( tenFrameIconNode );

    tenFrameIconNode.cursor = 'pointer';
    tenFrameIconNode.inputListeners = [ DragListener.createForwardingListener( ( event: PressListenerEvent ) => {
      const tenFrame = new TenFrame( Vector2.ZERO );
      tenFrame.positionProperty.value = screenView.globalToLocalPoint( event.pointer.point ).minus( tenFrame.localBounds.centerBottom );
      model.dragTenFrameFromIcon( tenFrame );
      const tenFrameNode = screenView.getTenFrameNode( tenFrame );
      tenFrameNode.dragListener.press( event, tenFrameNode );
    } ) ];

    super( creatorNodeBackground, {
      xMargin: 10
    } );
  }
}

numberPlay.register( 'TenFrameCreatorPanel', TenFrameCreatorPanel );
export default TenFrameCreatorPanel;
