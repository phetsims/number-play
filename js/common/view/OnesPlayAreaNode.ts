// Copyright 2019-2022, University of Colorado Boulder

/**
 * Play area node for the OnesAccordionBox. This file was copied from counting-common/common/view/CountingCommonView.js and
 * make-a-ten/explore/view/MakeATenExploreScreenView.js and then modified by @chrisklus to be used in number-play.
 *
 * @author Sharfudeen Ashraf
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import PaperNumber from '../../../../counting-common/js/common/model/PaperNumber.js';
import PaperNumberNode from '../../../../counting-common/js/common/view/PaperNumberNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node, PressListenerEvent, Rectangle } from '../../../../scenery/js/imports.js';
import ClosestDragListener from '../../../../sun/js/ClosestDragListener.js';
import numberPlay from '../../numberPlay.js';
import OnesPlayArea from '../model/OnesPlayArea.js';
import OnesCreatorPanel from './OnesCreatorPanel.js';
import { PaperNumberNodeMap } from '../../../../counting-common/js/common/view/CountingCommonView.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import DraggableTenFrameNode from '../../lab/view/DraggableTenFrameNode.js';

type SelfOptions = {
  paperNumberLayerNode?: null | Node;
  backgroundDragTargetNode?: null | Node;
  viewHasIndependentModel?: boolean; // whether this view is hooked up to its own model or a shared model
  includeOnesCreatorPanel?: boolean;
  creatorPanelX?: null | number;
  returnZoneProperty?: null | TReadOnlyProperty<Bounds2>;
};
type OnesPlayAreaNodeOptions = SelfOptions;

// constants
const COUNTING_OBJECT_HANDLE_OFFSET_Y = -9.5;  // empirically determined to be an appropriate length for just 10s and 1s

class OnesPlayAreaNode extends Node {
  private readonly numberSplitListener: ( paperNumberNode: PaperNumberNode ) => void;
  private readonly numberInteractionListener: ( paperNumberNode: PaperNumberNode ) => void;
  private readonly numberAnimationFinishedListener: ( paperNumber: PaperNumber ) => void;
  private readonly numberDragFinishedListener: ( paperNumberNode: PaperNumberNode ) => void;
  public readonly playArea: OnesPlayArea;
  private readonly tryToCombineNumbersCallback: ( draggedPaperNumber: PaperNumber ) => void;
  private readonly addAndDragNumberCallback: ( event: PressListenerEvent, paperNumber: PaperNumber ) => void;
  private readonly paperNumberNodeMap: PaperNumberNodeMap;

  // the bounds of the play area where counting objects can be dragged
  public readonly playAreaBoundsProperty: TReadOnlyProperty<Bounds2>;
  public readonly countingObjectTypeProperty: TReadOnlyProperty<CountingObjectType>;
  private readonly viewHasIndependentModel: boolean;
  private readonly closestDragListener: ClosestDragListener;
  private readonly paperNumberLayerNode: Node | null;
  private readonly onesCreatorPanel: OnesCreatorPanel;
  private readonly includeOnesCreatorPanel: boolean;
  private readonly getPaperNumberOrigin: () => Vector2 = () => Vector2.ZERO;
  private readonly returnZoneProperty: TReadOnlyProperty<Bounds2> | null;

  public constructor( playArea: OnesPlayArea,
                      countingObjectTypeProperty: TReadOnlyProperty<CountingObjectType>,
                      playAreaBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions?: OnesPlayAreaNodeOptions ) {
    super();

    const options = optionize<OnesPlayAreaNodeOptions, SelfOptions>()( {
      paperNumberLayerNode: null,
      backgroundDragTargetNode: null,
      viewHasIndependentModel: true,
      includeOnesCreatorPanel: true,
      creatorPanelX: null,
      returnZoneProperty: null
    }, providedOptions );

    // TODO-TS: Get rid of this binding pattern. Update function signatures in the attributes.

    // Called with function( paperNumberNode ) on number splits
    this.numberSplitListener = this.onNumberSplit.bind( this );

    // Called with function( paperNumberNode ) when a number begins to be interacted with.
    this.numberInteractionListener = OnesPlayAreaNode.onNumberInteractionStarted.bind( this );

    // Called with function( paperNumber ) when a number finishes animation
    this.numberAnimationFinishedListener = this.onNumberAnimationFinished.bind( this );

    // Called with function( paperNumber ) when a number finishes being dragged
    this.numberDragFinishedListener = ( paperNumberNode: PaperNumberNode ) => {
      this.onNumberDragFinished( paperNumberNode.paperNumber );
    };

    this.playArea = playArea;

    this.tryToCombineNumbersCallback = this.tryToCombineNumbers.bind( this );
    this.addAndDragNumberCallback = this.addAndDragNumber.bind( this );

    // PaperNumber.id => {PaperNumberNode} - lookup map for efficiency
    this.paperNumberNodeMap = {};

    this.playAreaBoundsProperty = playAreaBoundsProperty;
    this.countingObjectTypeProperty = countingObjectTypeProperty;

    // see options.viewHasIndependentModel for doc
    this.viewHasIndependentModel = options.viewHasIndependentModel;

    // Handle touches nearby to the numbers, and interpret those as the proper drag.
    this.closestDragListener = new ClosestDragListener( 30, 0 );
    let backgroundDragTargetNode = null;
    if ( options.backgroundDragTargetNode ) {
      backgroundDragTargetNode = options.backgroundDragTargetNode;
    }
    else {
      backgroundDragTargetNode = new Rectangle( playAreaBoundsProperty.value );
      this.addChild( backgroundDragTargetNode );
    }
    backgroundDragTargetNode.addInputListener( this.closestDragListener );

    const paperNumberAddedListener = this.onPaperNumberAdded.bind( this );
    const paperNumberRemovedListener = this.onPaperNumberRemoved.bind( this );

    // Add nodes for every already-existing paper number
    playArea.paperNumbers.forEach( paperNumberAddedListener );

    // Add and remove nodes to match the playArea
    playArea.paperNumbers.addItemAddedListener( paperNumberAddedListener );
    playArea.paperNumbers.addItemRemovedListener( paperNumberRemovedListener );

    // Persistent, no need to unlink
    this.playAreaBoundsProperty.lazyLink( () => {
      this.constrainAllPositions();
    } );

    // create the OnesCreatorPanel
    this.onesCreatorPanel = new OnesCreatorPanel( playArea, this );
    if ( options.creatorPanelX ) {
      this.onesCreatorPanel.centerX = options.creatorPanelX;
    }
    else {
      this.onesCreatorPanel.left = playAreaBoundsProperty.value.minX + CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;
    }

    // set the y position of the onesCreatorPanel. NOTE: It is assumed below during initialization that the
    // onesCreatorPanel is positioned along the bottom of the playArea bounds
    const updateOnesCreatorPanelPosition = () => {
      this.onesCreatorPanel.bottom = playAreaBoundsProperty.value.bottom -
                                     CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;
    };
    playAreaBoundsProperty.link( updateOnesCreatorPanelPosition );
    this.transformEmitter.addListener( updateOnesCreatorPanelPosition );

    if ( options.includeOnesCreatorPanel ) {
      this.addChild( this.onesCreatorPanel );
      this.getPaperNumberOrigin = () => this.onesCreatorPanel.countingCreatorNode.getOriginPosition();
    }

    // initialize the model with positioning information
    if ( this.viewHasIndependentModel ) {
      const onesCreatorNodeHeight = options.includeOnesCreatorPanel ? this.onesCreatorPanel.height : 0;
      this.playArea.initialize( this.getPaperNumberOrigin, onesCreatorNodeHeight, playAreaBoundsProperty );
    }

    // Where all of the paper numbers are. Created if not provided.
    this.paperNumberLayerNode = null;
    if ( options.paperNumberLayerNode ) {
      this.paperNumberLayerNode = options.paperNumberLayerNode;
    }
    else {
      this.paperNumberLayerNode = new Node();

      // add the paperNumberLayerNode after the creator panel
      this.addChild( this.paperNumberLayerNode );
    }

    this.includeOnesCreatorPanel = options.includeOnesCreatorPanel;
    this.returnZoneProperty = options.returnZoneProperty;
  }

  /**
   * Add a paper number to the playArea and immediately start dragging it with the provided event.
   *
   * @param event - The Scenery event that triggered this.
   * @param paperNumber - The paper number to add and then drag
   */
  public addAndDragNumber( event: PressListenerEvent, paperNumber: PaperNumber ): void {

    // Add it and lookup the related node.
    this.playArea.addPaperNumber( paperNumber );
    this.playArea.calculateTotal();

    const paperNumberNode = this.getPaperNumberNode( paperNumber );
    paperNumberNode.startSyntheticDrag( event );
  }

  /**
   * Creates and adds a PaperNumberNode.
   */
  public onPaperNumberAdded( paperNumber: PaperNumber ): void {

    const paperNumberNode = new PaperNumberNode(
      paperNumber,
      this.playAreaBoundsProperty,
      this.addAndDragNumberCallback,
      this.tryToCombineNumbersCallback, {
        countingObjectTypeProperty: this.countingObjectTypeProperty,
        baseNumberNodeOptions: {
          handleOffsetY: COUNTING_OBJECT_HANDLE_OFFSET_Y
        }
      } );

    this.paperNumberNodeMap[ paperNumberNode.paperNumber.id ] = paperNumberNode;
    this.paperNumberLayerNode!.addChild( paperNumberNode );
    paperNumberNode.attachListeners();

    this.closestDragListener.addDraggableItem( paperNumberNode );

    // add listeners
    paperNumberNode.splitEmitter.addListener( this.numberSplitListener );
    paperNumberNode.interactionStartedEmitter.addListener( this.numberInteractionListener );
    paperNumber.endAnimationEmitter.addListener( this.numberAnimationFinishedListener );
    paperNumberNode.endDragEmitter.addListener( this.numberDragFinishedListener );
  }

  /**
   * Handles removing the relevant PaperNumberNode
   */
  public onPaperNumberRemoved( paperNumber: PaperNumber ): void {
    const paperNumberNode = this.getPaperNumberNode( paperNumber );

    // Remove listeners
    paperNumberNode.endDragEmitter.removeListener( this.numberDragFinishedListener );
    paperNumber.endAnimationEmitter.removeListener( this.numberAnimationFinishedListener );
    paperNumberNode.interactionStartedEmitter.removeListener( this.numberInteractionListener );
    paperNumberNode.splitEmitter.removeListener( this.numberSplitListener );

    delete this.paperNumberNodeMap[ paperNumberNode.paperNumber.id ];
    this.closestDragListener.removeDraggableItem( paperNumberNode );
    paperNumberNode.dispose();
  }

  /**
   * Given a PaperNumber, get the current view (PaperNumberNode) of it.
   */
  public getPaperNumberNode( paperNumber: PaperNumber ): PaperNumberNode {
    const result = this.paperNumberNodeMap[ paperNumber.id ];
    assert && assert( result, 'Did not find matching Node' );
    return result;
  }

  /**
   * When the user drops a paper number they were dragging, see if it can combine with any other nearby paper numbers.
   */
  public tryToCombineNumbers( draggedPaperNumber: PaperNumber ): void {
    // TODO: This seems like a weird sidestep to try tenframes first and maybe be moved
    if ( this.tryToAddToTenFrame( draggedPaperNumber ) ) {
      return;
    }

    const draggedNode = this.getPaperNumberNode( draggedPaperNumber );

    const allPaperNumberNodes = _.filter( this.paperNumberLayerNode!.children,
      child => child instanceof PaperNumberNode ) as PaperNumberNode[];

    // remove any paperNumbers that aren't included in the sum - these are already on their way back to the bucket and
    // should not be tried to combined with. return if no paperNumbers are left or if the draggedPaperNumber is not
    // included in the sum
    _.remove( allPaperNumberNodes, paperNumberNode => {
      return !paperNumberNode.paperNumber.includeInSumProperty.value;
    } );
    if ( allPaperNumberNodes.length === 0 || !draggedPaperNumber.includeInSumProperty.value ) {
      return;
    }

    const droppedNodes = draggedNode.findAttachableNodes( allPaperNumberNodes );

    // Check them in reverse order (the one on the top should get more priority)
    droppedNodes.reverse();

    for ( let i = 0; i < droppedNodes.length; i++ ) {
      const droppedNode = droppedNodes[ i ];
      const droppedPaperNumber = droppedNode.paperNumber;

      // if grouping is turned off, repel away
      if ( !this.playArea.groupingEnabledProperty.value || !droppedPaperNumber.groupingEnabledProperty.value ) {
        if ( draggedPaperNumber.positionProperty.value.distance( droppedPaperNumber.positionProperty.value ) < 7 ) { // TODO: https://github.com/phetsims/number-play/issues/19 match this with the card object spacing
          this.playArea.repelAway( this.playAreaBoundsProperty.value, draggedPaperNumber, droppedPaperNumber, () => {
            return {
              left: -10,
              right: 10
            };
          } );
        }
      }
      else {

        // allow any two numbers to be combined
        this.playArea.collapseNumberModels( this.playAreaBoundsProperty.value, draggedPaperNumber, droppedPaperNumber );
        return; // No need to re-layer or try combining with others
      }
    }
  }

  private tryToAddToTenFrame( droppedPaperNumber: PaperNumber ): boolean {
    if ( !this.playArea.tenFrames ) {
      return false;
    }

    const droppedNode = this.getPaperNumberNode( droppedPaperNumber );
    const allDraggableTenFrameNodes = _.filter( this.paperNumberLayerNode!.children,
      child => child instanceof DraggableTenFrameNode ) as DraggableTenFrameNode[];

    const droppedNodeCountingType = droppedNode.countingObjectTypeProperty.value;

    if ( !allDraggableTenFrameNodes.length ) {
      return false;
    }

    const attachableDroppedTenFrameNodes = this.findAttachableTenFrameNodes( droppedNode, allDraggableTenFrameNodes );

    // TODO: Docs and cleanup
    if ( attachableDroppedTenFrameNodes.length ) {
      attachableDroppedTenFrameNodes.forEach( droppedTenFrameNode => {
        if ( !this.isPaperNumberContainedByTenFrame( droppedPaperNumber ) ) {

          const droppedTenFrame = droppedTenFrameNode.tenFrame;
          let matchingCountingObjectType = false;

          if ( droppedTenFrame.countingObjects.lengthProperty.value ) {
            matchingCountingObjectType = this.playArea.paperNumbers.includes( droppedTenFrame.countingObjects[ 0 ] );
          }

          if ( matchingCountingObjectType ||
               ( !droppedTenFrame.countingObjects.lengthProperty.value && droppedNodeCountingType !== CountingObjectType.PAPER_NUMBER )
          ) {
            droppedTenFrame.tryToAddCountingObject( droppedPaperNumber );
          }
          else {
            droppedTenFrame.pushAwayCountingObject( droppedPaperNumber, this.playAreaBoundsProperty.value );
          }
        }
      } );
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * TODO
   */
  private isPaperNumberContainedByTenFrame( paperNumber: PaperNumber ): boolean {
    let isContained = false;
    this.playArea.tenFrames?.forEach( tenFrame => {
      if ( tenFrame.containsCountingObject( paperNumber ) ) {
        isContained = true;
      }
    } );

    return isContained;
  }

  /**
   * TODO
   */
  private findAttachableTenFrameNodes( paperNumberNode: PaperNumberNode,
                                       allDraggableTenFrameNodes: DraggableTenFrameNode[] ): DraggableTenFrameNode[] {
    const tenFrameNodeCandidates = allDraggableTenFrameNodes.slice();

    // find all other paper number nodes that are overlapping the dropped node
    const unorderedAttachableTenFrameNodes = tenFrameNodeCandidates.filter( tenFrameNode => {
      return tenFrameNode.localToParentBounds( tenFrameNode.localBounds )
        .containsPoint( paperNumberNode.localToParentPoint( paperNumberNode.localBounds.center ) );
    } );

    return _.sortBy( unorderedAttachableTenFrameNodes, attachableTenFrameNode => {
      return attachableTenFrameNode.parent!.indexOfChild( attachableTenFrameNode );
    } );
  }

  /**
   * Make sure all paper numbers are within the availableViewBounds
   */
  private constrainAllPositions(): void {
    this.playArea.paperNumbers.forEach( ( paperNumber: PaperNumber ) => {
      paperNumber.setConstrainedDestination( this.playAreaBoundsProperty.value, paperNumber.positionProperty.value );
    } );
  }

  /**
   * Whether the paper number is predominantly over the explore panel (should be collected).
   */
  private isNumberInReturnZone( paperNumber: PaperNumber ): boolean {
    const parentBounds = this.getPaperNumberNode( paperNumber ).bounds;

    // And the bounds of our panel
    const panelBounds = this.returnZoneProperty ? this.returnZoneProperty.value : this.onesCreatorPanel.bounds;

    return panelBounds.intersectsBounds( parentBounds );
  }

  /**
   * Called when a paper number node is split.
   */
  private onNumberSplit( paperNumberNode: PaperNumberNode ): void {
    // this.playArea.splitCue.triggerFade();
  }

  /**
   * Called when a paper number node starts being interacted with.
   */
  private static onNumberInteractionStarted( paperNumberNode: PaperNumberNode ): void {
    const paperNumber = paperNumberNode.paperNumber;
    if ( paperNumber.numberValueProperty.value > 1 ) {
      // this.playArea.splitCue.attachToNumber( paperNumber );
    }
  }

  /**
   * Called when a paper number has finished animating to its destination.
   */
  private onNumberAnimationFinished( paperNumber: PaperNumber ): void {

    // If it animated to the return zone, it's probably split and meant to be returned.
    if ( this.playArea.paperNumbers.includes( paperNumber ) && this.isNumberInReturnZone( paperNumber ) ) {
      if ( paperNumber.includeInSumProperty.value ) {
        this.onNumberDragFinished( paperNumber );
      }
      else {
        const paperNumberValue = paperNumber.numberValueProperty.value;
        this.playArea.removePaperNumber( paperNumber );

        // see if the creator node should show any hidden targets since a counting object was just returned
        this.onesCreatorPanel.countingCreatorNode.checkTargetVisibility( paperNumberValue );
      }
    }
      // if this view is running off of a shared model, then if a paper number has already been removed from the model,
    // check if creator node should be updated
    else if ( !this.viewHasIndependentModel ) {
      const paperNumberValue = paperNumber.numberValueProperty.value;
      this.onesCreatorPanel.countingCreatorNode.checkTargetVisibility( paperNumberValue );
    }
  }

  /**
   * Called when a paper number has finished being dragged.
   */
  private onNumberDragFinished( paperNumber: PaperNumber ): void {

    if ( !this.includeOnesCreatorPanel ) {
      return;
    }

    // Return it to the panel if it's been dropped in the panel.
    if ( this.isNumberInReturnZone( paperNumber ) ) {
      // console.log( `about to drop ${paperNumber.numberValueProperty.value} in ${this.playArea.name} return zone` );
      assert && assert( paperNumber.includeInSumProperty.value, 'paperNumber already removed from sum' );
      paperNumber.includeInSumProperty.value = false;
      this.playArea.calculateTotal();

      // Set its destination to the proper target (with the offset so that it will disappear once centered).
      let targetPosition = this.onesCreatorPanel.countingCreatorNode.getOriginPosition();
      targetPosition = targetPosition.minus( paperNumber.returnAnimationBounds.center );
      const targetScale = paperNumber.groupingEnabledProperty.value ? NumberPlayConstants.GROUPED_STORED_COUNTING_OBJECT_SCALE :
                          NumberPlayConstants.UNGROUPED_STORED_COUNTING_OBJECT_SCALE;
      paperNumber.setDestination( targetPosition, true, {
        targetScale: targetScale,
        targetHandleOpacity: 0
      } );
    }
  }
}

numberPlay.register( 'OnesPlayAreaNode', OnesPlayAreaNode );
export default OnesPlayAreaNode;
