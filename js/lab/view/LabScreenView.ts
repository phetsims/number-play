// Copyright 2019-2022, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import PlayObjectType from '../../../../counting-common/js/common/model/PlayObjectType.js';
import NumberPiece from '../../../../fractions-common/js/building/model/NumberPiece.js';
import NumberPieceNode from '../../../../fractions-common/js/building/view/NumberPieceNode.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { DragListener, Node, Rectangle, SceneryEvent } from '../../../../scenery/js/imports.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import OnesPlayAreaNode from '../../common/view/OnesPlayAreaNode.js';
import TenFrameNode from '../../common/view/TenFrameNode.js';
import numberPlay from '../../numberPlay.js';
import TenFrame from '../model/TenFrame.js';
import DraggableTenFrameNode from './DraggableTenFrameNode.js';
import LabNumberCarousel from './LabNumberCarousel.js';
import LabModel from '../model/LabModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberStack from '../../../../fractions-common/js/building/model/NumberStack.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';

class LabScreenView extends ScreenView {
  private readonly model: LabModel;
  private readonly pieceLayer: Node;
  private readonly numberPieceNodes: NumberPieceNode[];
  private readonly numberPanel: LabNumberCarousel;
  private readonly tenFrameNodes: DraggableTenFrameNode[];

  constructor( model: LabModel, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    // @private
    this.model = model;

    // NNode for all pieces to share
    this.pieceLayer = new Node();
    const backgroundDragTargetNode = new Rectangle( this.layoutBounds ); // see OnesPlayAreaNode for doc

    // @private {NumberPieceNode[]}
    this.numberPieceNodes = [];
    const animationDuration = 0.4; // in seconds

    // create the number panel
    this.numberPanel = new LabNumberCarousel(
      model.numberStacks,
      animationDuration,
      ( event: SceneryEvent, stack: NumberStack ) => {
        const modelPoint = this.globalToLocalPoint( event.pointer.point! );
        const numberPiece = new NumberPiece( stack.number );
        numberPiece.positionProperty.value = modelPoint;
        model.dragNumberPieceFromStack( numberPiece );
        const numberPieceNode = this.getNumberPieceNode( numberPiece );
        numberPieceNode && numberPieceNode.dragListener.press( event, numberPieceNode );
      } );
    this.numberPanel.centerX = this.layoutBounds.centerX;
    this.numberPanel.top = NumberPlayConstants.SCREEN_VIEW_PADDING_Y;
    this.addChild( this.numberPanel );
    this.numberPanel.updateModelPositions( new ModelViewTransform2() );

    model.activeNumberPieces.addItemAddedListener( this.addNumberPiece.bind( this ) );
    model.activeNumberPieces.addItemRemovedListener( this.removeNumberPiece.bind( this ) );

    // create and add the OnesPlayAreaNode
    const onesPlayAreaNode = new OnesPlayAreaNode(
      model.onesPlayArea,
      this.layoutBounds.copy(), {
        paperNumberLayerNode: this.pieceLayer,
        backgroundDragTargetNode: backgroundDragTargetNode,
        creatorPanelCenterBottom: new Vector2( this.layoutBounds.centerX - 120,
          this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y )
      }
    );
    this.addChild( onesPlayAreaNode );

    // create and add the left ObjectsPlayAreaNode
    const leftObjectsPlayAreaNode = new OnesPlayAreaNode(
      model.leftObjectsPlayArea,
      this.layoutBounds.copy(), {
        paperNumberLayerNode: this.pieceLayer,
        playObjectTypeProperty: new EnumerationProperty( PlayObjectType.DOG ),
        groupingLinkingTypeProperty: new EnumerationProperty( GroupingLinkingType.UNGROUPED ),
        backgroundDragTargetNode: backgroundDragTargetNode,
        creatorPanelCenterBottom: new Vector2( this.layoutBounds.centerX,
          this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y )
      }
    );
    this.addChild( leftObjectsPlayAreaNode );

    // create and add the right ObjectsPlayAreaNode
    const rightObjectsPlayAreaNode = new OnesPlayAreaNode(
      model.rightObjectsPlayArea,
      this.layoutBounds.copy(), {
        paperNumberLayerNode: this.pieceLayer,
        playObjectTypeProperty: new EnumerationProperty( PlayObjectType.BALL ),
        groupingLinkingTypeProperty: new EnumerationProperty( GroupingLinkingType.UNGROUPED ),
        backgroundDragTargetNode: backgroundDragTargetNode,
        creatorPanelCenterBottom: new Vector2( this.layoutBounds.centerX + 120,
          this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y )
      }
    );
    this.addChild( rightObjectsPlayAreaNode );

    const tenFrameCreatorIconNode = this.getTenFrameCreatorIconNode();

    // position empirically determined
    tenFrameCreatorIconNode.left = NumberPlayConstants.SCREEN_VIEW_PADDING_X;
    tenFrameCreatorIconNode.bottom = this.layoutBounds.copy().bottom - NumberPlayConstants.SCREEN_VIEW_PADDING_X;
    this.addChild( tenFrameCreatorIconNode );

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
      right: this.layoutBounds.maxX - NumberPlayConstants.SCREEN_VIEW_PADDING_X,
      bottom: this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Returns the corresponding NumberPieceNode for a given NumberPiece.
   */
  private getNumberPieceNode( numberPiece: NumberPiece ): NumberPieceNode {
    // @ts-ignore
    return _.find<NumberPieceNode>( this.numberPieceNodes, numberPieceNode => numberPieceNode.numberPiece === numberPiece );
  }

  /**
   * Called when a new NumberPiece is added to the model (we'll create the view).
   */
  private addNumberPiece( numberPiece: NumberPiece ): void {
    const numberPieceNode = new NumberPieceNode( numberPiece, {
      positioned: true,
      modelViewTransform: new ModelViewTransform2(),
      dropListener: ( wasTouch: boolean ) => {
        this.model.numberPieceDropped( numberPiece, wasTouch ? 50 : 20 );
      }
    } );

    numberPieceNode.cursor = 'pointer';
    numberPieceNode.inputListeners = [ DragListener.createForwardingListener( ( event: SceneryEvent ) => {
      numberPieceNode.dragListener.press( event, numberPieceNode );
      numberPieceNode.moveToFront();
    } ) ];

    this.numberPieceNodes.push( numberPieceNode );
    this.pieceLayer.addChild( numberPieceNode );
  }

  /**
   * Called when a NumberPiece is removed from the model (we'll remove the view).
   */
  private removeNumberPiece( numberPiece: NumberPiece ): void {
    const numberPieceNode = this.getNumberPieceNode( numberPiece );

    _.pull( this.numberPieceNodes, numberPieceNode );
    this.pieceLayer.removeChild( numberPieceNode );
    numberPieceNode.dispose();
  }

  /**
   * Creates a TenFrame node that DraggableTenFrameNodes can be created from when clicked
   */
  private getTenFrameCreatorIconNode(): Node {
    // TODO: add a plus sign as part of the icon
    const tenFrameIconNode = TenFrameNode.getTenFramePath();
    tenFrameIconNode.cursor = 'pointer';
    tenFrameIconNode.inputListeners = [ DragListener.createForwardingListener( ( event: SceneryEvent ) => {
      const modelPosition = this.globalToLocalPoint( event.pointer.point! );
      const tenFrame = new TenFrame( 70, modelPosition );
      this.model.dragTenFrameFromIcon( tenFrame );
      const tenFrameNode = this.getTenFrameNode( tenFrame );
      tenFrameNode.dragListener.press( event, tenFrameNode );
    } ) ];
    return tenFrameIconNode;
  }

  /**
   * Called when a new Ten Frame is added to the model.
   */
  private addTenFrame( tenFrame: TenFrame ): void {
    const tenFrameNode = new DraggableTenFrameNode( tenFrame, () => {
      // TODO: implement method below
      // this.model.tenFrameDropped( tenFrame );
    } );

    this.tenFrameNodes.push( tenFrameNode );
    this.pieceLayer.addChild( tenFrameNode );
  }

  /**
   * Called when a TenFrame is removed from the model.
   */
  private removeTenFrame( tenFrame: TenFrame ): void {
    const tenFrameNode = this.getTenFrameNode( tenFrame );

    _.pull( this.tenFrameNodes, tenFrameNode );
    this.pieceLayer.removeChild( tenFrameNode );
    tenFrameNode.dispose();
  }

  /**
   * Returns the corresponding DraggableTenFrameNode for a given TenFrame.
   */
  private getTenFrameNode( tenFrame: TenFrame ): DraggableTenFrameNode {
    // @ts-ignore
    return _.find( this.tenFrameNodes, tenFrameNode => tenFrameNode.tenFrame === tenFrame );
  }
}

numberPlay.register( 'LabScreenView', LabScreenView );
export default LabScreenView;
