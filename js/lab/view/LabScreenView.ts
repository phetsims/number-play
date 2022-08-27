// Copyright 2019-2022, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberPiece from '../../../../fractions-common/js/building/model/NumberPiece.js';
import NumberPieceNode from '../../../../fractions-common/js/building/view/NumberPieceNode.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { DragListener, Node, PressListenerEvent, Rectangle } from '../../../../scenery/js/imports.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import OnesPlayAreaNode from '../../common/view/OnesPlayAreaNode.js';
import numberPlay from '../../numberPlay.js';
import TenFrame from '../model/TenFrame.js';
import DraggableTenFrameNode from './DraggableTenFrameNode.js';
import LabNumberCarousel from './LabNumberCarousel.js';
import LabModel from '../model/LabModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberStack from '../../../../fractions-common/js/building/model/NumberStack.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import InequalitySymbolsCreatorPanel from './InequalitySymbolsCreatorPanel.js';
import TenFrameCreatorPanel from './TenFrameCreatorPanel.js';

class LabScreenView extends ScreenView {
  private readonly model: LabModel;

  // node for all pieces to share
  public readonly pieceLayer: Node;
  private readonly numberPieceNodes: NumberPieceNode[];
  private readonly numberPanel: LabNumberCarousel;
  private readonly tenFrameNodes: DraggableTenFrameNode[];
  public readonly inequalitySymbolsCreatorPanel: InequalitySymbolsCreatorPanel;

  public constructor( model: LabModel, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    this.model = model;
    this.pieceLayer = new Node();
    const backgroundDragTargetNode = new Rectangle( this.layoutBounds ); // see OnesPlayAreaNode for doc

    this.numberPieceNodes = [];
    const animationDuration = 0.4; // in seconds

    // create the number panel
    this.numberPanel = new LabNumberCarousel(
      model.numberStacks,
      animationDuration,
      ( event: PressListenerEvent, stack: NumberStack ) => {
        const modelPoint = this.globalToLocalPoint( event.pointer.point );
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

    model.numberPieces.addItemAddedListener( this.addNumberPiece.bind( this ) );
    model.numberPieces.addItemRemovedListener( this.removeNumberPiece.bind( this ) );

    const tenFrameCreatorPanel = new TenFrameCreatorPanel( model, this );
    tenFrameCreatorPanel.left = 20;
    tenFrameCreatorPanel.bottom = this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y;
    this.addChild( tenFrameCreatorPanel );

    // create and add the OnesPlayAreaNode
    const paperNumberPlayAreaNode = new OnesPlayAreaNode(
      model.paperNumberPlayArea,
      new EnumerationProperty( CountingObjectType.PAPER_NUMBER ),
      this.layoutBounds.copy(), {
        paperNumberLayerNode: this.pieceLayer,
        backgroundDragTargetNode: backgroundDragTargetNode,
        creatorPanelCenterBottom: new Vector2( this.layoutBounds.centerX - 303, // TODO: calculate creator node positions
          this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y )
      }
    );
    this.addChild( paperNumberPlayAreaNode );

    // create and add the left ObjectsPlayAreaNode
    const dogPlayAreaNode = new OnesPlayAreaNode(
      model.dogPlayArea,
      new EnumerationProperty( CountingObjectType.DOG ),
      this.layoutBounds.copy(), {
        paperNumberLayerNode: this.pieceLayer,
        backgroundDragTargetNode: backgroundDragTargetNode,
        creatorPanelCenterBottom: new Vector2( this.layoutBounds.centerX - 183,
          this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y )
      }
    );
    this.addChild( dogPlayAreaNode );

    // create and add the right ObjectsPlayAreaNode
    const applePlayAreaNode = new OnesPlayAreaNode(
      model.applePlayArea,
      new EnumerationProperty( CountingObjectType.APPLE ),
      this.layoutBounds.copy(), {
        paperNumberLayerNode: this.pieceLayer,
        backgroundDragTargetNode: backgroundDragTargetNode,
        creatorPanelCenterBottom: new Vector2( this.layoutBounds.centerX - 63,
          this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y )
      }
    );
    this.addChild( applePlayAreaNode );

    // create and add the right ObjectsPlayAreaNode
    const butterflyPlayAreaNode = new OnesPlayAreaNode(
      model.butterflyPlayArea,
      new EnumerationProperty( CountingObjectType.BUTTERFLY ),
      this.layoutBounds.copy(), {
        paperNumberLayerNode: this.pieceLayer,
        backgroundDragTargetNode: backgroundDragTargetNode,
        creatorPanelCenterBottom: new Vector2( this.layoutBounds.centerX + 57,
          this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y )
      }
    );
    this.addChild( butterflyPlayAreaNode );

    // create and add the right ObjectsPlayAreaNode
    const ballPlayAreaNode = new OnesPlayAreaNode(
      model.ballPlayArea,
      new EnumerationProperty( CountingObjectType.BALL ),
      this.layoutBounds.copy(), {
        paperNumberLayerNode: this.pieceLayer,
        backgroundDragTargetNode: backgroundDragTargetNode,
        creatorPanelCenterBottom: new Vector2( this.layoutBounds.centerX + 177,
          this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y )
      }
    );
    this.addChild( ballPlayAreaNode );

    this.inequalitySymbolsCreatorPanel = new InequalitySymbolsCreatorPanel( model, this );

    // position empirically determined
    this.inequalitySymbolsCreatorPanel.left = ballPlayAreaNode.right + 15;
    this.inequalitySymbolsCreatorPanel.centerY = ballPlayAreaNode.centerY;
    this.addChild( this.inequalitySymbolsCreatorPanel );

    this.tenFrameNodes = [];

    model.tenFrames.addItemAddedListener( this.addTenFrame.bind( this ) );
    model.tenFrames.addItemRemovedListener( this.removeTenFrame.bind( this ) );

    // add the piece layer
    this.addChild( this.pieceLayer );

    // create and add the ResetAllButton
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.inequalitySymbolsCreatorPanel.reset();
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
    const numberPieceNode = _.find( this.numberPieceNodes, numberPieceNode => numberPieceNode.numberPiece === numberPiece );
    assert && assert( numberPieceNode, 'matching numberPieceNode not found!' );
    return numberPieceNode!;
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
    numberPieceNode.inputListeners = [ DragListener.createForwardingListener( ( event: PressListenerEvent ) => {
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
  public getTenFrameNode( tenFrame: TenFrame ): DraggableTenFrameNode {
    const tenFrameNode = _.find( this.tenFrameNodes, tenFrameNode => tenFrameNode.tenFrame === tenFrame );
    assert && assert( tenFrameNode, 'matching tenFrameNode not found!' );
    return tenFrameNode!;
  }
}

numberPlay.register( 'LabScreenView', LabScreenView );
export default LabScreenView;
