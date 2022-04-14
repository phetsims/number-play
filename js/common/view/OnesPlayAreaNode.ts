// Copyright 2019-2022, University of Colorado Boulder

/**
 * Play area node for the OnesAccordionBox. This file was copied from counting-common/common/view/CountingCommonView.js and
 * make-a-ten/explore/view/MakeATenExploreScreenView.js and then modified by @chrisklus to be used in number-play.
 *
 * @author Sharfudeen Ashraf
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import PaperNumber from '../../../../counting-common/js/common/model/PaperNumber.js';
import PaperNumberNode from '../../../../counting-common/js/common/view/PaperNumberNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node, PressListenerEvent, Rectangle } from '../../../../scenery/js/imports.js';
import ClosestDragListener from '../../../../sun/js/ClosestDragListener.js';
import numberPlay from '../../numberPlay.js';
import OnesPlayArea from '../model/OnesPlayArea.js';
import OnesCreatorPanel from './OnesCreatorPanel.js';
import { PaperNumberNodeMap } from '../../../../counting-common/js/common/view/CountingCommonView.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import NumberPlayConstants from '../NumberPlayConstants.js';

// types
type OnesPlayAreaNodeOptions = {
  paperNumberLayerNode: null | Node;
  backgroundDragTargetNode: null | Node;
  viewHasIndependentModel: boolean;
  includeOnesCreatorPanel: boolean;
};

// constants
const COUNTING_OBJECT_HANDLE_OFFSET_Y = -9.5;  // empirically determined to be an appropriate length for just 10s and 1s

class OnesPlayAreaNode extends Node {
  private readonly numberSplitListener: Function;
  private readonly numberInteractionListener: Function;
  private readonly numberAnimationFinishedListener: Function;
  private readonly numberDragFinishedListener: Function;
  public readonly playArea: OnesPlayArea;
  private readonly tryToCombineNumbersCallback: Function;
  private readonly addAndDragNumberCallback: Function;
  private readonly paperNumberNodeMap: PaperNumberNodeMap;
  public readonly availableViewBoundsProperty: Property<Bounds2>;
  public readonly countingObjectTypeProperty: IReadOnlyProperty<CountingObjectType>;
  private readonly viewHasIndependentModel: boolean;
  private readonly closestDragListener: ClosestDragListener;
  private readonly paperNumberLayerNode: Node | null;
  private readonly onesCreatorPanel: OnesCreatorPanel;
  private readonly includeOnesCreatorPanel: boolean;
  private readonly getPaperNumberOrigin: () => Vector2 = () => Vector2.ZERO;

  constructor( playArea: OnesPlayArea,
               countingObjectTypeProperty: IReadOnlyProperty<CountingObjectType>,
               playAreaViewBounds: Bounds2,
               providedOptions?: Partial<OnesPlayAreaNodeOptions> ) {
    super();

    const options = merge( {
      paperNumberLayerNode: null,
      backgroundDragTargetNode: null,
      viewHasIndependentModel: true, // whether this view is hooked up to its own model or a shared model
      includeOnesCreatorPanel: true
    }, providedOptions ) as OnesPlayAreaNodeOptions;

    // TODO-TS: Get rid of this binding pattern. Update function signatures in the attributes.

    // Called with function( paperNumberNode ) on number splits
    this.numberSplitListener = this.onNumberSplit.bind( this );

    // Called with function( paperNumberNode ) when a number begins to be interacted with.
    this.numberInteractionListener = OnesPlayAreaNode.onNumberInteractionStarted.bind( this );

    // Called with function( paperNumber ) when a number finishes animation
    this.numberAnimationFinishedListener = this.onNumberAnimationFinished.bind( this );

    // Called with function( paperNumber ) when a number finishes being dragged
    this.numberDragFinishedListener = this.onNumberDragFinished.bind( this );

    this.playArea = playArea;

    this.tryToCombineNumbersCallback = this.tryToCombineNumbers.bind( this );

    this.addAndDragNumberCallback = this.addAndDragNumber.bind( this );

    // PaperNumber.id => {PaperNumberNode} - lookup map for efficiency
    this.paperNumberNodeMap = {};

    // The view coordinates where numbers can be dragged. Can update when the sim is resized.
    this.availableViewBoundsProperty = new Property( playAreaViewBounds );
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
      backgroundDragTargetNode = new Rectangle( playAreaViewBounds );
      this.addChild( backgroundDragTargetNode );
    }
    backgroundDragTargetNode.addInputListener( this.closestDragListener );

    const paperNumberAddedListener = this.onPaperNumberAdded.bind( this );
    const paperNumberRemovedListener = this.onPaperNumberRemoved.bind( this );

    // Where all of the paper numbers are. Created if not provided.
    this.paperNumberLayerNode = null;
    if ( options.paperNumberLayerNode ) {
      this.paperNumberLayerNode = options.paperNumberLayerNode;
    }
    else {
      this.paperNumberLayerNode = new Node();
    }

    // Add nodes for every already-existing paper number
    playArea.paperNumbers.forEach( paperNumberAddedListener );

    // Add and remove nodes to match the playArea
    playArea.paperNumbers.addItemAddedListener( paperNumberAddedListener );
    playArea.paperNumbers.addItemRemovedListener( paperNumberRemovedListener );

    // Persistent, no need to unlink
    this.availableViewBoundsProperty.lazyLink( () => {
      this.constrainAllPositions();
    } );

    // create and add the OnesCreatorPanel
    this.onesCreatorPanel = new OnesCreatorPanel( playArea, this );
    this.onesCreatorPanel.bottom = playAreaViewBounds.maxY - CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;
    this.onesCreatorPanel.left = playAreaViewBounds.minX + CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;
    if ( options.includeOnesCreatorPanel ) {
      this.addChild( this.onesCreatorPanel );
      this.getPaperNumberOrigin = () => this.onesCreatorPanel.countingCreatorNode.getOriginPosition();
    }

    // initialize the model with positioning information
    if ( this.viewHasIndependentModel ) {
      const countingCreatorNodeTop = options.includeOnesCreatorPanel ? this.onesCreatorPanel.top : playAreaViewBounds.bottom;
      this.playArea.initialize( this.getPaperNumberOrigin, countingCreatorNodeTop, playAreaViewBounds );
    }

    // add the paperNumberLayerNode after the creator panel
    this.addChild( this.paperNumberLayerNode );

    this.includeOnesCreatorPanel = options.includeOnesCreatorPanel;
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
    const paperNumberNode = this.findPaperNumberNode( paperNumber );
    paperNumberNode.startSyntheticDrag( event );
  }

  /**
   * Creates and adds a PaperNumberNode.
   */
  public onPaperNumberAdded( paperNumber: PaperNumber ): void {

    const paperNumberNode = new PaperNumberNode(
      paperNumber,
      this.availableViewBoundsProperty,
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

    // Add listeners
    // @ts-ignore TODO: See TODO in the constructor
    paperNumberNode.splitEmitter.addListener( this.numberSplitListener );
    // @ts-ignore
    paperNumberNode.interactionStartedEmitter.addListener( this.numberInteractionListener );
    // @ts-ignore
    paperNumber.endAnimationEmitter.addListener( this.numberAnimationFinishedListener );
    // @ts-ignore
    paperNumber.endDragEmitter.addListener( this.numberDragFinishedListener );
  }

  /**
   * Handles removing the relevant PaperNumberNode
   */
  public onPaperNumberRemoved( paperNumber: PaperNumber ): void {
    const paperNumberNode = this.findPaperNumberNode( paperNumber );

    // Remove listeners
    // @ts-ignore TODO: See TODO in the constructor
    paperNumber.endDragEmitter.removeListener( this.numberDragFinishedListener );
    // @ts-ignore
    paperNumber.endAnimationEmitter.removeListener( this.numberAnimationFinishedListener );
    // @ts-ignore
    paperNumberNode.interactionStartedEmitter.removeListener( this.numberInteractionListener );
    // @ts-ignore
    paperNumberNode.splitEmitter.removeListener( this.numberSplitListener );

    delete this.paperNumberNodeMap[ paperNumberNode.paperNumber.id ];
    this.closestDragListener.removeDraggableItem( paperNumberNode );
    paperNumberNode.dispose();
  }

  /**
   * Given a {PaperNumber}, find our current display ({PaperNumberNode}) of it.
   */
  public findPaperNumberNode( paperNumber: PaperNumber ): PaperNumberNode {
    const result = this.paperNumberNodeMap[ paperNumber.id ];
    assert && assert( result, 'Did not find matching Node' );
    return result;
  }

  /**
   * When the user drops a paper number they were dragging, see if it can combine with any other nearby paper numbers.
   */
  public tryToCombineNumbers( draggedPaperNumber: PaperNumber ): void {
    const draggedNode = this.findPaperNumberNode( draggedPaperNumber );
    // @ts-ignore TS-TODO: How to make TS .children is of type PaperNumberNode[]?
    const allPaperNumberNodes: PaperNumberNode[] = _.filter( this.paperNumberLayerNode!.children, child => child instanceof PaperNumberNode );

    // remove any paperNumbers that aren't included in the sum - these are already on their way back to the bucket and
    // should not be tried to combined with. return if no paperNumbers are left or if the draggedPaperNumber is not
    // included in the sum
    _.remove( allPaperNumberNodes, paperNumberNode => {
      return !paperNumberNode.paperNumber.includeInSumProperty.value;
    } );
    if ( allPaperNumberNodes.length === 0 || !draggedPaperNumber.includeInSumProperty.value ) {
      return;
    }

    // @ts-ignore TODO-TS: Remove when PaperNumber is converted to TypeScript
    const droppedNodes = draggedNode.findAttachableNodes( allPaperNumberNodes );

    // Check them in reverse order (the one on the top should get more priority)
    droppedNodes.reverse();

    for ( let i = 0; i < droppedNodes.length; i++ ) { // eslint-disable-line no-unreachable-loop
      const droppedNode = droppedNodes[ i ];
      const droppedPaperNumber = droppedNode.paperNumber;

      // if grouping is turned off, repel away
      if ( !this.playArea.groupingEnabledProperty.value || !droppedPaperNumber.groupingEnabledProperty.value ) {
        if ( draggedPaperNumber.positionProperty.value.distance( droppedPaperNumber.positionProperty.value ) < 7 ) { // TODO: https://github.com/phetsims/number-play/issues/19 match this with the card object spacing
          this.playArea.repelAway( this.availableViewBoundsProperty.value, draggedPaperNumber, droppedPaperNumber, () => {
            return {
              left: -10,
              right: 10
            };
          } );
        }
      }
      else {

        // allow any two numbers to be combined
        this.playArea.collapseNumberModels( this.availableViewBoundsProperty.value, draggedPaperNumber, droppedPaperNumber );
        return; // No need to re-layer or try combining with others
      }
    }
  }

  /**
   * Make sure all paper numbers are within the availableViewBounds
   */
  private constrainAllPositions(): void {
    this.playArea.paperNumbers.forEach( ( paperNumber: PaperNumber ) => {
      paperNumber.setConstrainedDestination( this.availableViewBoundsProperty.value, paperNumber.positionProperty.value );
    } );
  }

  /**
   * Whether the paper number is predominantly over the explore panel (should be collected).
   */
  private isNumberInReturnZone( paperNumber: PaperNumber ): boolean {
    const parentBounds = this.findPaperNumberNode( paperNumber ).bounds;

    // And the bounds of our panel
    const panelBounds = this.onesCreatorPanel.bounds;

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

      const amountToSubtract = paperNumber.includeInSumProperty.value ? paperNumber.numberValueProperty.value : 0;
      paperNumber.includeInSumProperty.value = false;

      // Set its destination to the proper target (with the offset so that it will disappear once centered).
      let targetPosition = this.onesCreatorPanel.countingCreatorNode.getOriginPosition();
      targetPosition = targetPosition.minus( paperNumber.returnAnimationBounds.center );
      const targetScale = paperNumber.groupingEnabledProperty.value ? NumberPlayConstants.GROUPED_STORED_COUNTING_OBJECT_SCALE :
                          NumberPlayConstants.UNGROUPED_STORED_COUNTING_OBJECT_SCALE;
      paperNumber.setDestination( targetPosition, true, {
        targetScale: targetScale,
        targetHandleOpacity: 0
      } );

      // TODO: the need for this guard means that the play areas are not in sync, and should be eliminated when https://github.com/phetsims/number-play/issues/6 is fixed.
      if ( this.playArea.currentNumberProperty.value > this.playArea.currentNumberProperty.range!.min ) {

        // a user returned a number, so update the sim's currentNumberProperty
        this.playArea.isControllingCurrentNumber = true;
        this.playArea.currentNumberProperty.value =
          Math.max( this.playArea.currentNumberProperty.value - amountToSubtract,
            this.playArea.currentNumberProperty.range!.min );
        this.playArea.isControllingCurrentNumber = false;
      }
    }
  }
}

numberPlay.register( 'OnesPlayAreaNode', OnesPlayAreaNode );
export default OnesPlayAreaNode;
