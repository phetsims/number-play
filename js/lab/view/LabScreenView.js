// Copyright 2019-2020, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberPiece from '../../../../fractions-common/js/building/model/NumberPiece.js';
import NumberPieceNode from '../../../../fractions-common/js/building/view/NumberPieceNode.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import ObjectsPlayAreaNode from '../../common/view/ObjectsPlayAreaNode.js';
import OnesPlayAreaNode from '../../common/view/OnesPlayAreaNode.js';
import TenFrameNode from '../../common/view/TenFrameNode.js';
import numberPlay from '../../numberPlay.js';
import TenFrame from '../model/TenFrame.js';
import DraggableTenFrameNode from './DraggableTenFrameNode.js';
import LabNumberCarousel from './LabNumberCarousel.js';

class LabScreenView extends ScreenView {

  /**
   * @param {LabModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( {
      tandem: tandem
    } );

    // @private
    this.model = model;

    const playAreaViewBounds = new Bounds2(
      this.layoutBounds.left,
      this.layoutBounds.top + NumberPlayConstants.SCREEN_VIEW_Y_PADDING,
      this.layoutBounds.right,
      this.layoutBounds.bottom - NumberPlayConstants.SCREEN_VIEW_Y_PADDING
    );
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      playAreaViewBounds.centerBottom,
      1
    );

    // @private {NumberPieceNode[]}
    this.numberPieceNodes = [];

    const animationDuration = 0.4; // in seconds

    // @private {Node}
    this.numberPanel = new LabNumberCarousel( model.numberStacks, animationDuration, ( event, stack ) => {
      const modelPoint = this.modelViewTransform.viewToModelPosition( this.globalToLocalPoint( event.pointer.point ) );
      const numberPiece = new NumberPiece( stack.number );
      numberPiece.positionProperty.value = modelPoint;
      model.dragNumberPieceFromStack( numberPiece );
      const numberPieceNode = this.getNumberPieceNode( numberPiece );
      numberPieceNode.dragListener.press( event, numberPieceNode );
    } );
    this.numberPanel.centerX = this.layoutBounds.centerX;
    this.numberPanel.top = playAreaViewBounds.top;
    this.numberPanel.updateModelPositions( this.modelViewTransform );

    model.activeNumberPieces.addItemAddedListener( this.addNumberPiece.bind( this ) );
    model.activeNumberPieces.addItemRemovedListener( this.removeNumberPiece.bind( this ) );

    // @private {Node} - Node for all pieces to share
    this.pieceLayer = new Node();

    // create and add the OnesPlayAreaNode
    const onesPlayAreaNode = new OnesPlayAreaNode(
      model.onesPlayArea,
      playAreaViewBounds,
      this.modelViewTransform, {
        paperNumberLayerNode: this.pieceLayer
      }
    );
    this.addChild( onesPlayAreaNode );

    // the one's play area covers other nodes, so add the numberPanel after
    this.addChild( this.numberPanel );

    // create and add the left ObjectsPlayAreaNode
    const playAreaModelBounds = this.modelViewTransform.viewToModelBounds( playAreaViewBounds ).dilatedX( -20 ).dilatedY( -19 );
    const leftObjectsPlayAreaNode = new ObjectsPlayAreaNode(
      model.leftObjectsPlayArea,
      playAreaModelBounds,
      this.modelViewTransform, {
        playObjectsLayer: this.pieceLayer
      }
    );
    this.addChild( leftObjectsPlayAreaNode );

    // create and add the right ObjectsPlayAreaNode
    const rightObjectsPlayAreaNode = new ObjectsPlayAreaNode(
      model.rightObjectsPlayArea,
      playAreaModelBounds,
      this.modelViewTransform, {
        playObjectsLayer: this.pieceLayer
      }
    );
    this.addChild( rightObjectsPlayAreaNode );

    const tenFrameCreatorIconNode = this.getTenFrameCreatorIconNode();

    // position empirically determined
    tenFrameCreatorIconNode.centerX = this.modelViewTransform.modelToViewX( model.onesPlayArea.bucket.position.x ) - 180;
    tenFrameCreatorIconNode.bottom = playAreaViewBounds.bottom - NumberPlayConstants.SCREEN_VIEW_X_PADDING;
    this.addChild( tenFrameCreatorIconNode );

    // @private {draggableTenFrameNode[]}
    this.tenFrameNodes = [];

    model.activeTenFrames.addItemAddedListener( this.addTenFrame.bind( this ) );
    model.activeTenFrames.addItemRemovedListener( this.removeTenFrame.bind( this ) );

    // add the piece layer
    this.addChild( this.pieceLayer );

    // create and add the ResetAllButton
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
      },
      right: this.layoutBounds.maxX - NumberPlayConstants.SCREEN_VIEW_X_PADDING,
      bottom: this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_Y_PADDING,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Returns the corresponding NumberPieceNode for a given NumberPiece.
   *
   * @param {NumberPiece} numberPiece
   * @returns {NumberPieceNode}
   * @private
   */
  getNumberPieceNode( numberPiece ) {
    return _.find( this.numberPieceNodes, numberPieceNode => numberPieceNode.numberPiece === numberPiece );
  }

  /**
   * Called when a new NumberPiece is added to the model (we'll create the view).
   *
   * @param {NumberPiece} numberPiece
   * @private
   */
  addNumberPiece( numberPiece ) {
    const numberPieceNode = new NumberPieceNode( numberPiece, {
      positioned: true,
      modelViewTransform: this.modelViewTransform,
      dropListener: wasTouch => {
        this.model.numberPieceDropped( numberPiece, wasTouch ? 50 : 20 );
      }
    } );

    numberPieceNode.cursor = 'pointer';
    numberPieceNode.inputListeners = [ DragListener.createForwardingListener( event => {
      numberPieceNode.dragListener.press( event, numberPieceNode );
      numberPieceNode.moveToFront();
    } ) ];

    this.numberPieceNodes.push( numberPieceNode );
    this.pieceLayer.addChild( numberPieceNode );
  }

  /**
   * Called when a NumberPiece is removed from the model (we'll remove the view).
   *
   * @param {NumberPiece} numberPiece
   * @private
   */
  removeNumberPiece( numberPiece ) {
    const numberPieceNode = this.getNumberPieceNode( numberPiece );

    _.pull( this.numberPieceNodes, numberPieceNode );
    this.pieceLayer.removeChild( numberPieceNode );
    numberPieceNode.dispose();
  }

  /**
   * Creates a TenFrame node that DraggableTenFrameNodes can be created from when clicked
   *
   * @returns {Node}
   * @private
   */
  getTenFrameCreatorIconNode() {
    // TODO: add a plus sign as part of the icon
    const tenFrameIconNode = TenFrameNode.getTenFramePath();
    tenFrameIconNode.cursor = 'pointer';
    tenFrameIconNode.inputListeners = [ DragListener.createForwardingListener( event => {
      const modelPoint = this.modelViewTransform.viewToModelPosition( this.globalToLocalPoint( event.pointer.point ) );
      const tenFrame = new TenFrame( 70, modelPoint );
      this.model.dragTenFrameFromIcon( tenFrame );
      const tenFrameNode = this.getTenFrameNode( tenFrame );
      tenFrameNode.dragListener.press( event, tenFrameNode );
    } ) ];
    return tenFrameIconNode;
  }

  /**
   * Called when a new Ten Frame is added to the model.
   *
   * @param {TenFrame} tenFrame
   * @private
   */
  addTenFrame( tenFrame ) {
    const tenFrameNode = new DraggableTenFrameNode( tenFrame, this.modelViewTransform, () => {
      // TODO: implement method below
      // this.model.tenFrameDropped( tenFrame );
    } );

    this.tenFrameNodes.push( tenFrameNode );
    this.pieceLayer.addChild( tenFrameNode );
  }

  /**
   * Called when a TenFrame is removed from the model.
   *
   * @param {TenFrame} tenFrame
   * @private
   */
  removeTenFrame( tenFrame ) {
    const tenFrameNode = this.getTenFrameNode( tenFrame );

    _.pull( this.tenFrameNodes, tenFrameNode );
    this.pieceLayer.removeChild( tenFrameNode );
    tenFrameNode.dispose();
  }

  /**
   * Returns the corresponding DraggableTenFrameNode for a given TenFrame.
   *
   * @param {TenFrame} tenFrame
   * @returns {DraggableTenFrameNode}
   * @private
   */
  getTenFrameNode( tenFrame ) {
    return _.find( this.tenFrameNodes, tenFrameNode => tenFrameNode.tenFrame === tenFrame );
  }
}

numberPlay.register( 'LabScreenView', LabScreenView );
export default LabScreenView;
