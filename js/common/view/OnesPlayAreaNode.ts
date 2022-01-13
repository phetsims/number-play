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
import PlayObjectType from '../../../../counting-common/js/common/model/PlayObjectType.js';
import PaperNumberNode from '../../../../counting-common/js/common/view/PaperNumberNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node, Rectangle, SceneryEvent } from '../../../../scenery/js/imports.js';
import ClosestDragListener from '../../../../sun/js/ClosestDragListener.js';
import numberPlay from '../../numberPlay.js';
import OnesPlayArea from '../model/OnesPlayArea.js';
import OnesCreatorPanel from './OnesCreatorPanel.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import { PaperNumberNodeMap } from '../../../../counting-common/js/common/view/CountingCommonView.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';

// types
type OnesPlayAreaNodeOptions = {
  paperNumberLayerNode: null | Node,
  backgroundDragTargetNode: null | Node,
  playObjectTypeProperty: IReadOnlyProperty<PlayObjectType> | null,
  groupingLinkingTypeProperty: EnumerationProperty<GroupingLinkingType> | null,
  viewHasIndependentModel: boolean,
  includeOnesCreatorPanel: boolean
};

class OnesPlayAreaNode extends Node {
  private readonly numberSplitListener: Function;
  private readonly numberInteractionListener: Function;
  private readonly numberAnimationFinishedListener: Function;
  private readonly numberDragFinishedListener: Function;
  private playArea: OnesPlayArea;
  private readonly tryToCombineNumbersCallback: Function;
  private readonly addAndDragNumberCallback: Function;
  private readonly paperNumberNodeMap: PaperNumberNodeMap;
  public readonly availableViewBoundsProperty: Property<Bounds2>;
  readonly playObjectTypeProperty: IReadOnlyProperty<PlayObjectType> | null;
  private readonly groupingLinkingTypeProperty: EnumerationProperty<GroupingLinkingType> | null;
  private readonly viewHasIndependentModel: boolean;
  private readonly closestDragListener: ClosestDragListener;
  private readonly paperNumberLayerNode: Node | null;
  private readonly onesCreatorPanel: OnesCreatorPanel;
  private readonly includeOnesCreatorPanel: boolean;

  constructor( playArea: OnesPlayArea, playAreaViewBounds: Bounds2, providedOptions?: Partial<OnesPlayAreaNodeOptions> ) {
    super();

    const options = merge( {
      paperNumberLayerNode: null,
      backgroundDragTargetNode: null,
      playObjectTypeProperty: null,
      groupingLinkingTypeProperty: null,
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

    this.playObjectTypeProperty = options.playObjectTypeProperty;

    this.groupingLinkingTypeProperty = options.groupingLinkingTypeProperty;

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
    this.availableViewBoundsProperty.lazyLink( availableViewBounds => {
      playArea.paperNumbers.forEach( ( paperNumber: PaperNumber ) => {
        paperNumber.setConstrainedDestination( availableViewBounds, paperNumber.positionProperty.value );
      } );
    } );

    // when the groupingLinkingType is switched to no grouping, break apart any object groups
    this.groupingLinkingTypeProperty && this.groupingLinkingTypeProperty.lazyLink( groupingLinkingType => {
      if ( ( groupingLinkingType === GroupingLinkingType.UNGROUPED || groupingLinkingType === GroupingLinkingType.GROUPED )
           && this.playObjectTypeProperty ) {
        playArea.paperNumbers.forEach( ( paperNumber: PaperNumber ) => {
          const paperNumberNode = this.paperNumberNodeMap[ paperNumber.id ];
          paperNumberNode.updateNumber();
        } );
      }
    } );

    // create and add the OnesCreatorPanel
    this.onesCreatorPanel = new OnesCreatorPanel( playArea, this );
    this.onesCreatorPanel.bottom = playAreaViewBounds.maxY;
    if ( options.includeOnesCreatorPanel ) {
      this.addChild( this.onesCreatorPanel );
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
  public addAndDragNumber( event: SceneryEvent, paperNumber: PaperNumber ): void {

    // Add it and lookup the related node.
    this.playArea.addPaperNumber( paperNumber );
    const paperNumberNode = this.findPaperNumberNode( paperNumber );
    paperNumberNode.startSyntheticDrag( event );
  }

  /**
   * Creates and adds a PaperNumberNode.
   */
  public onPaperNumberAdded( paperNumber: PaperNumber ): void {

    // let the model know if is being shared or not
    paperNumber.viewHasIndependentModel = this.viewHasIndependentModel;

    const paperNumberNode = new PaperNumberNode( paperNumber, this.availableViewBoundsProperty,
      this.addAndDragNumberCallback, this.tryToCombineNumbersCallback, this.playObjectTypeProperty, this.groupingLinkingTypeProperty );

    // if a number's value is set to 0, make it's corresponding node not pickable (since it's on its way to the bucket)
    paperNumber.numberValueProperty.link( numberValue => {
      if ( numberValue < 1 ) {
        paperNumberNode.interruptSubtreeInput();
        paperNumberNode.pickable = false;
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
    const allPaperNumberNodes = _.filter( this.paperNumberLayerNode!.children, child => child instanceof PaperNumberNode );

    // remove any paperNumbers with a value of 0 - these are already on their way back to the bucket and should not
    // be tried to combined with. return if no paperNumbers are left or if the draggedPaperNumber's value is 0
    _.remove( allPaperNumberNodes, paperNumberNode => {
      // @ts-ignore TODO-TS: Remove when PaperNumber is converted to TypeScript
      return paperNumberNode.paperNumber.numberValueProperty.value === 0;
    } );
    if ( allPaperNumberNodes.length === 0 || draggedPaperNumber.numberValueProperty.value === 0 ) {
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
      if ( this.groupingLinkingTypeProperty && this.groupingLinkingTypeProperty.value === GroupingLinkingType.UNGROUPED ) {
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
   * Whether the paper number is predominantly over the explore panel (should be collected).
   */
  private isNumberInReturnZone( paperNumber: PaperNumber ): boolean {
    const parentBounds = this.findPaperNumberNode( paperNumber ).bounds;

    // And the bounds of our panel
    const panelBounds = this.onesCreatorPanel.bounds.withMaxY( this.availableViewBoundsProperty.value.bottom );

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
      this.playArea.removePaperNumber( paperNumber );
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

      const paperNumberValue = paperNumber.numberValueProperty.value;
      paperNumber.numberValueProperty.value = 0;

      // Set its destination to the proper target (with the offset so that it will disappear once centered).
      let targetPosition = this.onesCreatorPanel.countingCreatorNode.getOriginPosition();

      // TODO: the ternary below is a hack that shouldn't be needed once https://github.com/phetsims/number-play/issues/6 is fixed.
      const paperCenterOffset = new PaperNumber( paperNumberValue > 0 ? paperNumberValue : 1, new Vector2( 0, 0 ) ).getLocalBounds().center;
      targetPosition = targetPosition.minus( paperCenterOffset );
      paperNumber.setDestination( targetPosition, true );


      // TODO: the need for this guard means that the play areas are not in sync, and should be eliminated when https://github.com/phetsims/number-play/issues/6 is fixed.
      if ( this.playArea.currentNumberProperty.value > this.playArea.currentNumberProperty.range!.min ) {

        // a user returned a number, so update the sim's currentNumberProperty
        this.playArea.isControllingCurrentNumber = true;
        this.playArea.currentNumberProperty.value = this.playArea.currentNumberProperty.value - paperNumberValue;
        this.playArea.isControllingCurrentNumber = false;
      }
    }
  }
}

numberPlay.register( 'OnesPlayAreaNode', OnesPlayAreaNode );
export default OnesPlayAreaNode;
