// Copyright 2019-2022, University of Colorado Boulder

/**
 * Play area node for counting objects. This file was copied from counting-common/common/view/CountingCommonView.js and
 * make-a-ten/explore/view/MakeATenExploreScreenView.js and then modified by @chrisklus to be used in number-play.
 *
 * @author Sharfudeen Ashraf
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import CountingObject from '../../../../counting-common/js/common/model/CountingObject.js';
import CountingObjectNode from '../../../../counting-common/js/common/view/CountingObjectNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node, PressListenerEvent, Rectangle } from '../../../../scenery/js/imports.js';
import ClosestDragListener from '../../../../sun/js/ClosestDragListener.js';
import numberPlay from '../../numberPlay.js';
import CountingPlayArea from '../model/CountingPlayArea.js';
import CountingObjectCreatorPanel from './CountingObjectCreatorPanel.js';
import { CountingObjectNodeMap } from '../../../../counting-common/js/common/view/CountingCommonView.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import DraggableTenFrameNode from '../../lab/view/DraggableTenFrameNode.js';

type SelfOptions = {
  countingObjectLayerNode?: null | Node;
  backgroundDragTargetNode?: null | Node;
  viewHasIndependentModel?: boolean; // whether this view is hooked up to its own model or a shared model
  includeCountingObjectCreatorPanel?: boolean;
  creatorPanelX?: null | number;
  returnZoneProperty?: null | TReadOnlyProperty<Bounds2>;
};
type CountingPlayAreaNodeOptions = SelfOptions;

// constants
const COUNTING_OBJECT_HANDLE_OFFSET_Y = -9.5;  // empirically determined to be an appropriate length for just 10s and 1s

class CountingPlayAreaNode extends Node {
  private readonly numberSplitListener: ( countingObjectNode: CountingObjectNode ) => void;
  private readonly numberInteractionListener: ( countingObjectNode: CountingObjectNode ) => void;
  private readonly numberAnimationFinishedListener: ( countingObject: CountingObject ) => void;
  private readonly numberDragFinishedListener: ( countingObjectNode: CountingObjectNode ) => void;
  public readonly playArea: CountingPlayArea;
  private readonly tryToCombineNumbersCallback: ( draggedCountingObject: CountingObject ) => void;
  private readonly addAndDragNumberCallback: ( event: PressListenerEvent, countingObject: CountingObject ) => void;
  private readonly countingObjectNodeMap: CountingObjectNodeMap;

  // the bounds of the play area where counting objects can be dragged
  public readonly playAreaBoundsProperty: TReadOnlyProperty<Bounds2>;
  public readonly countingObjectTypeProperty: TReadOnlyProperty<CountingObjectType>;
  private readonly viewHasIndependentModel: boolean;
  private readonly closestDragListener: ClosestDragListener;
  private readonly countingObjectLayerNode: Node | null;
  private readonly CountingObjectCreatorPanel: CountingObjectCreatorPanel;
  private readonly includeCountingObjectCreatorPanel: boolean;
  private readonly getCountingObjectOrigin: () => Vector2 = () => Vector2.ZERO;
  private readonly returnZoneProperty: TReadOnlyProperty<Bounds2> | null;

  public constructor( playArea: CountingPlayArea,
                      countingObjectTypeProperty: TReadOnlyProperty<CountingObjectType>,
                      playAreaBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions?: CountingPlayAreaNodeOptions ) {
    super();

    const options = optionize<CountingPlayAreaNodeOptions, SelfOptions>()( {
      countingObjectLayerNode: null,
      backgroundDragTargetNode: null,
      viewHasIndependentModel: true,
      includeCountingObjectCreatorPanel: true,
      creatorPanelX: null,
      returnZoneProperty: null
    }, providedOptions );

    // TODO-TS: Get rid of this binding pattern. Update function signatures in the attributes.

    // Called with function( countingObjectNode ) on number splits
    this.numberSplitListener = this.onNumberSplit.bind( this );

    // Called with function( countingObjectNode ) when a number begins to be interacted with.
    this.numberInteractionListener = CountingPlayAreaNode.onNumberInteractionStarted.bind( this );

    // Called with function( countingObject ) when a number finishes animation
    this.numberAnimationFinishedListener = this.onNumberAnimationFinished.bind( this );

    // Called with function( countingObject ) when a number finishes being dragged
    this.numberDragFinishedListener = ( countingObjectNode: CountingObjectNode ) => {
      this.onNumberDragFinished( countingObjectNode.countingObject );
    };

    this.playArea = playArea;

    this.tryToCombineNumbersCallback = this.tryToCombineNumbers.bind( this );
    this.addAndDragNumberCallback = this.addAndDragNumber.bind( this );

    // CountingObject.id => {CountingObjectNode} - lookup map for efficiency
    this.countingObjectNodeMap = {};

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

    const countingObjectAddedListener = this.onCountingObjectAdded.bind( this );
    const countingObjectRemovedListener = this.onCountingObjectRemoved.bind( this );

    // Add nodes for every already-existing counting Object
    playArea.countingObjects.forEach( countingObjectAddedListener );

    // Add and remove nodes to match the playArea
    playArea.countingObjects.addItemAddedListener( countingObjectAddedListener );
    playArea.countingObjects.addItemRemovedListener( countingObjectRemovedListener );

    // Persistent, no need to unlink
    this.playAreaBoundsProperty.lazyLink( () => {
      this.constrainAllPositions();
    } );

    // create the CountingObjectCreatorPanel
    this.CountingObjectCreatorPanel = new CountingObjectCreatorPanel( playArea, this );
    if ( options.creatorPanelX ) {
      this.CountingObjectCreatorPanel.centerX = options.creatorPanelX;
    }
    else {
      this.CountingObjectCreatorPanel.left = playAreaBoundsProperty.value.minX + CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;
    }

    // set the y position of the CountingObjectCreatorPanel. NOTE: It is assumed below during initialization that the
    // CountingObjectCreatorPanel is positioned along the bottom of the playArea bounds
    const updateCountingObjectCreatorPanelPosition = () => {
      this.CountingObjectCreatorPanel.bottom = playAreaBoundsProperty.value.bottom -
                                     CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;
    };
    playAreaBoundsProperty.link( updateCountingObjectCreatorPanelPosition );
    this.transformEmitter.addListener( updateCountingObjectCreatorPanelPosition );

    if ( options.includeCountingObjectCreatorPanel ) {
      this.addChild( this.CountingObjectCreatorPanel );
      this.getCountingObjectOrigin = () => this.CountingObjectCreatorPanel.countingCreatorNode.getOriginPosition();
    }

    // initialize the model with positioning information
    if ( this.viewHasIndependentModel ) {
      const countingObjectCreatorNodeHeight = options.includeCountingObjectCreatorPanel ? this.CountingObjectCreatorPanel.height : 0;
      this.playArea.initialize( this.getCountingObjectOrigin, countingObjectCreatorNodeHeight, playAreaBoundsProperty );
    }

    // Where all of the counting Objects are. Created if not provided.
    this.countingObjectLayerNode = null;
    if ( options.countingObjectLayerNode ) {
      this.countingObjectLayerNode = options.countingObjectLayerNode;
    }
    else {
      this.countingObjectLayerNode = new Node();

      // add the countingObjectLayerNode after the creator panel
      this.addChild( this.countingObjectLayerNode );
    }

    this.includeCountingObjectCreatorPanel = options.includeCountingObjectCreatorPanel;
    this.returnZoneProperty = options.returnZoneProperty;
  }

  /**
   * Add a counting Object to the playArea and immediately start dragging it with the provided event.
   *
   * @param event - The Scenery event that triggered this.
   * @param countingObject - The counting Object to add and then drag
   */
  public addAndDragNumber( event: PressListenerEvent, countingObject: CountingObject ): void {

    // Add it and lookup the related node.
    this.playArea.addCountingObject( countingObject );
    this.playArea.calculateTotal();

    const countingObjectNode = this.getCountingObjectNode( countingObject );
    countingObjectNode.startSyntheticDrag( event );
  }

  /**
   * Creates and adds a CountingObjectNode.
   */
  public onCountingObjectAdded( countingObject: CountingObject ): void {

    const countingObjectNode = new CountingObjectNode(
      countingObject,
      this.playAreaBoundsProperty,
      this.addAndDragNumberCallback,
      this.tryToCombineNumbersCallback, {
        countingObjectTypeProperty: this.countingObjectTypeProperty,
        baseNumberNodeOptions: {
          handleOffsetY: COUNTING_OBJECT_HANDLE_OFFSET_Y
        }
      } );

    this.countingObjectNodeMap[ countingObjectNode.countingObject.id ] = countingObjectNode;
    this.countingObjectLayerNode!.addChild( countingObjectNode );
    countingObjectNode.attachListeners();

    this.closestDragListener.addDraggableItem( countingObjectNode );

    // add listeners
    countingObjectNode.splitEmitter.addListener( this.numberSplitListener );
    countingObjectNode.interactionStartedEmitter.addListener( this.numberInteractionListener );
    countingObject.endAnimationEmitter.addListener( this.numberAnimationFinishedListener );
    countingObjectNode.endDragEmitter.addListener( this.numberDragFinishedListener );
  }

  /**
   * Handles removing the relevant CountingObjectNode
   */
  public onCountingObjectRemoved( countingObject: CountingObject ): void {
    const countingObjectNode = this.getCountingObjectNode( countingObject );

    // Remove listeners
    countingObjectNode.endDragEmitter.removeListener( this.numberDragFinishedListener );
    countingObject.endAnimationEmitter.removeListener( this.numberAnimationFinishedListener );
    countingObjectNode.interactionStartedEmitter.removeListener( this.numberInteractionListener );
    countingObjectNode.splitEmitter.removeListener( this.numberSplitListener );

    delete this.countingObjectNodeMap[ countingObjectNode.countingObject.id ];
    this.closestDragListener.removeDraggableItem( countingObjectNode );
    countingObjectNode.dispose();
  }

  /**
   * Given a CountingObject, get the current view (CountingObjectNode) of it.
   */
  public getCountingObjectNode( countingObject: CountingObject ): CountingObjectNode {
    const result = this.countingObjectNodeMap[ countingObject.id ];
    assert && assert( result, 'Did not find matching Node' );
    return result;
  }

  /**
   * When the user drops a counting Object they were dragging, see if it can combine with any other nearby counting Objects.
   */
  public tryToCombineNumbers( draggedCountingObject: CountingObject ): void {
    // TODO: This seems like a weird sidestep to try tenframes first and maybe be moved
    if ( this.tryToAddToTenFrame( draggedCountingObject ) ) {
      return;
    }

    const draggedNode = this.getCountingObjectNode( draggedCountingObject );

    const allCountingObjectNodes = _.filter( this.countingObjectLayerNode!.children,
      child => child instanceof CountingObjectNode ) as CountingObjectNode[];

    // remove any countingObjects that aren't included in the sum - these are already on their way back to the bucket and
    // should not be tried to combined with. return if no countingObjects are left or if the draggedCountingObject is not
    // included in the sum
    _.remove( allCountingObjectNodes, countingObjectNode => {
      return !countingObjectNode.countingObject.includeInSumProperty.value;
    } );
    if ( allCountingObjectNodes.length === 0 || !draggedCountingObject.includeInSumProperty.value ) {
      return;
    }

    const droppedNodes = draggedNode.findAttachableNodes( allCountingObjectNodes );

    // Check them in reverse order (the one on the top should get more priority)
    droppedNodes.reverse();

    for ( let i = 0; i < droppedNodes.length; i++ ) {
      const droppedNode = droppedNodes[ i ];
      const droppedCountingObject = droppedNode.countingObject;

      // if grouping is turned off, repel away
      if ( !this.playArea.groupingEnabledProperty.value || !droppedCountingObject.groupingEnabledProperty.value ) {
        if ( draggedCountingObject.positionProperty.value.distance( droppedCountingObject.positionProperty.value ) < 7 ) { // TODO: https://github.com/phetsims/number-play/issues/19 match this with the card object spacing
          this.playArea.repelAway( this.playAreaBoundsProperty.value, draggedCountingObject, droppedCountingObject, () => {
            return {
              left: -10,
              right: 10
            };
          } );
        }
      }
      else {

        // allow any two numbers to be combined
        this.playArea.collapseNumberModels( this.playAreaBoundsProperty.value, draggedCountingObject, droppedCountingObject );
        return; // No need to re-layer or try combining with others
      }
    }
  }

  private tryToAddToTenFrame( droppedCountingObject: CountingObject ): boolean {
    if ( !this.playArea.tenFrames ) {
      return false;
    }

    const droppedNode = this.getCountingObjectNode( droppedCountingObject );
    const allDraggableTenFrameNodes = _.filter( this.countingObjectLayerNode!.children,
      child => child instanceof DraggableTenFrameNode ) as DraggableTenFrameNode[];

    const droppedNodeCountingType = droppedNode.countingObjectTypeProperty.value;

    if ( !allDraggableTenFrameNodes.length ) {
      return false;
    }

    const attachableDroppedTenFrameNodes = this.findAttachableTenFrameNodes( droppedNode, allDraggableTenFrameNodes );

    // TODO: Docs and cleanup
    if ( attachableDroppedTenFrameNodes.length ) {
      attachableDroppedTenFrameNodes.forEach( droppedTenFrameNode => {
        if ( !this.isCountingObjectContainedByTenFrame( droppedCountingObject ) ) {

          const droppedTenFrame = droppedTenFrameNode.tenFrame;
          let matchingCountingObjectType = false;

          if ( droppedTenFrame.countingObjects.lengthProperty.value ) {
            matchingCountingObjectType = this.playArea.countingObjects.includes( droppedTenFrame.countingObjects[ 0 ] );
          }

          if ( matchingCountingObjectType ||
               ( !droppedTenFrame.countingObjects.lengthProperty.value && droppedNodeCountingType !== CountingObjectType.PAPER_NUMBER )
          ) {
            droppedTenFrame.tryToAddCountingObject( droppedCountingObject );
          }
          else {
            droppedTenFrame.pushAwayCountingObject( droppedCountingObject, this.playAreaBoundsProperty.value );
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
  private isCountingObjectContainedByTenFrame( countingObject: CountingObject ): boolean {
    let isContained = false;
    this.playArea.tenFrames?.forEach( tenFrame => {
      if ( tenFrame.containsCountingObject( countingObject ) ) {
        isContained = true;
      }
    } );

    return isContained;
  }

  /**
   * TODO
   */
  private findAttachableTenFrameNodes( countingObjectNode: CountingObjectNode,
                                       allDraggableTenFrameNodes: DraggableTenFrameNode[] ): DraggableTenFrameNode[] {
    const tenFrameNodeCandidates = allDraggableTenFrameNodes.slice();

    // find all other counting Object nodes that are overlapping the dropped node
    const unorderedAttachableTenFrameNodes = tenFrameNodeCandidates.filter( tenFrameNode => {
      return tenFrameNode.tenFrame.isCountingObjectOnTopOf( countingObjectNode.countingObject );
    } );

    return _.sortBy( unorderedAttachableTenFrameNodes, attachableTenFrameNode => {
      return attachableTenFrameNode.parent!.indexOfChild( attachableTenFrameNode );
    } );
  }

  /**
   * Make sure all counting Objects are within the availableViewBounds
   */
  private constrainAllPositions(): void {
    this.playArea.countingObjects.forEach( ( countingObject: CountingObject ) => {
      countingObject.setConstrainedDestination( this.playAreaBoundsProperty.value, countingObject.positionProperty.value );
    } );
  }

  /**
   * Whether the counting Object is predominantly over the explore panel (should be collected).
   */
  private isNumberInReturnZone( countingObject: CountingObject ): boolean {
    const parentBounds = this.getCountingObjectNode( countingObject ).bounds;

    // And the bounds of our panel
    const panelBounds = this.returnZoneProperty ? this.returnZoneProperty.value : this.CountingObjectCreatorPanel.bounds;

    return panelBounds.intersectsBounds( parentBounds );
  }

  /**
   * Called when a counting Object node is split.
   */
  private onNumberSplit( countingObjectNode: CountingObjectNode ): void {
    // this.playArea.splitCue.triggerFade();
  }

  /**
   * Called when a counting Object node starts being interacted with.
   */
  private static onNumberInteractionStarted( countingObjectNode: CountingObjectNode ): void {
    const countingObject = countingObjectNode.countingObject;
    if ( countingObject.numberValueProperty.value > 1 ) {
      // this.playArea.splitCue.attachToNumber( countingObject );
    }
  }

  /**
   * Called when a counting Object has finished animating to its destination.
   */
  private onNumberAnimationFinished( countingObject: CountingObject ): void {

    // If it animated to the return zone, it's probably split and meant to be returned.
    if ( this.playArea.countingObjects.includes( countingObject ) && this.isNumberInReturnZone( countingObject ) ) {
      if ( countingObject.includeInSumProperty.value ) {
        this.onNumberDragFinished( countingObject );
      }
      else {
        const countingObjectValue = countingObject.numberValueProperty.value;
        this.playArea.removeCountingObject( countingObject );

        // see if the creator node should show any hidden targets since a counting object was just returned
        this.CountingObjectCreatorPanel.countingCreatorNode.checkTargetVisibility( countingObjectValue );
      }
    }
      // if this view is running off of a shared model, then if a counting Object has already been removed from the model,
    // check if creator node should be updated
    else if ( !this.viewHasIndependentModel ) {
      const countingObjectValue = countingObject.numberValueProperty.value;
      this.CountingObjectCreatorPanel.countingCreatorNode.checkTargetVisibility( countingObjectValue );
    }
  }

  /**
   * Called when a counting Object has finished being dragged.
   */
  private onNumberDragFinished( countingObject: CountingObject ): void {

    if ( !this.includeCountingObjectCreatorPanel ) {
      return;
    }

    // Return it to the panel if it's been dropped in the panel.
    if ( this.isNumberInReturnZone( countingObject ) ) {
      // console.log( `about to drop ${countingObject.numberValueProperty.value} in ${this.playArea.name} return zone` );
      assert && assert( countingObject.includeInSumProperty.value, 'countingObject already removed from sum' );
      countingObject.includeInSumProperty.value = false;
      this.playArea.calculateTotal();

      // Set its destination to the proper target (with the offset so that it will disappear once centered).
      let targetPosition = this.CountingObjectCreatorPanel.countingCreatorNode.getOriginPosition();
      targetPosition = targetPosition.minus( countingObject.returnAnimationBounds.center );
      const targetScale = countingObject.groupingEnabledProperty.value ? NumberPlayConstants.GROUPED_STORED_COUNTING_OBJECT_SCALE :
                          NumberPlayConstants.UNGROUPED_STORED_COUNTING_OBJECT_SCALE;
      countingObject.setDestination( targetPosition, true, {
        targetScale: targetScale,
        targetHandleOpacity: 0
      } );
    }
  }
}

numberPlay.register( 'CountingPlayAreaNode', CountingPlayAreaNode );
export default CountingPlayAreaNode;
