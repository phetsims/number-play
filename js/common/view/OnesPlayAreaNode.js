// Copyright 2019-2021, University of Colorado Boulder

/**
 * Play area node for the OnesAccordionBox. This file was copied from counting-common/common/view/CountingCommonView.js and
 * make-a-ten/explore/view/MakeATenExploreScreenView.js and then modified by @chrisklus to be used in number-play.
 *
 * @author Sharfudeen Ashraf
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';
import PaperNumber from '../../../../counting-common/js/common/model/PaperNumber.js';
import PaperNumberNode from '../../../../counting-common/js/common/view/PaperNumberNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import BucketFront from '../../../../scenery-phet/js/bucket/BucketFront.js';
import BucketHole from '../../../../scenery-phet/js/bucket/BucketHole.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import ClosestDragListener from '../../../../sun/js/ClosestDragListener.js';
import numberPlay from '../../numberPlay.js';
import OnesCreatorNode from './OnesCreatorNode.js';

class OnesPlayAreaNode extends Node {

  /**
   * @param {OnesPlayArea} playArea
   * @param {Bounds2} playAreaViewBounds
   * @param {ModelViewTransform2} translateMVT
   * @param {object} [options]
   */
  constructor( playArea, playAreaViewBounds, translateMVT, options ) {
    super();

    options = merge( {
      paperNumberLayerNode: null, // {null|Node}
      backgroundDragTargetNode: null, // {null|Node}
      playObjectTypeProperty: null, // {EnumerationProperty.<PlayObjectType>|null}
      groupingLinkingTypeProperty: null, // {EnumerationProperty.<GroupingLinkingType>|null}
      viewHasIndependentModel: true // {boolean} whether this view is hooked up to its own model or a shared model
    }, options );

    // @private {Function} - Called with function( paperNumberNode ) on number splits
    this.numberSplitListener = this.onNumberSplit.bind( this );

    // @private {Function} - Called with function( paperNumberNode ) when a number begins to be interacted with.
    this.numberInteractionListener = this.onNumberInteractionStarted.bind( this );

    // @private {Function} - Called with function( paperNumber ) when a number finishes animation
    this.numberAnimationFinishedListener = this.onNumberAnimationFinished.bind( this );

    // @private {Function} - Called with function( paperNumber ) when a number finishes being dragged
    this.numberDragFinishedListener = this.onNumberDragFinished.bind( this );

    // @public {OnesPlayArea}
    this.playArea = playArea;

    // @private {Function}
    this.tryToCombineNumbersCallback = this.tryToCombineNumbers.bind( this );

    // @private {Function}
    this.addAndDragNumberCallback = this.addAndDragNumber.bind( this );

    // @private {number} PaperNumber.id => {PaperNumberNode} - lookup map for efficiency
    this.paperNumberNodeMap = {};

    // @public {Property.<Bounds2>} - The view coordinates where numbers can be dragged. Can update when the sim
    //                                is resized.
    this.availableViewBoundsProperty = new Property( playAreaViewBounds );

    // @private {EnumerationProperty.<PlayObjectType>}|null}
    this.playObjectTypeProperty = options.playObjectTypeProperty;

    // @private {EnumerationProperty.<GroupingLinkingType>}|null}
    this.groupingLinkingTypeProperty = options.groupingLinkingTypeProperty;

    // @private {boolean}
    this.viewHasIndependentModel = options.viewHasIndependentModel;

    // @private {ClosestDragListener} - Handle touches nearby to the numbers, and interpret those as the proper drag.
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

    // Add nodes for every already-existing paper number
    playArea.paperNumbers.forEach( paperNumberAddedListener );

    // Add and remove nodes to match the playArea
    playArea.paperNumbers.addItemAddedListener( paperNumberAddedListener );
    playArea.paperNumbers.addItemRemovedListener( paperNumberRemovedListener );

    // Persistent, no need to unlink
    this.availableViewBoundsProperty.lazyLink( availableViewBounds => {
      playArea.paperNumbers.forEach( paperNumber => {
        paperNumber.setConstrainedDestination( availableViewBounds, paperNumber.positionProperty.value );
      } );
    } );

    // when the groupingLinkingType is switched to no grouping, break apart any object groups
    this.groupingLinkingTypeProperty && this.groupingLinkingTypeProperty.lazyLink( groupingLinkingType => {
      if ( groupingLinkingType === GroupingLinkingType.NO_GROUPING && this.playObjectTypeProperty ) {
        playArea.paperNumbers.forEach( paperNumber => {
          const paperNumberNode = this.paperNumberNodeMap[ paperNumber.id ];
          paperNumberNode.updateNumber();
        } );
      }
    } );

    // create and add the bucket back
    const bucketHole = new BucketHole( playArea.bucket, translateMVT );
    this.addChild( bucketHole );

    // @private {OnesCreatorNode} - Shows the 1 that can be dragged.
    this.onesCreatorNode = new OnesCreatorNode( this, playArea.sumProperty, this.playObjectTypeProperty );
    this.addChild( this.onesCreatorNode );

    // create and add the bucket front
    const bucketFrontNode = new BucketFront( playArea.bucket, translateMVT );
    bucketFrontNode.centerBottom = translateMVT.modelToViewPosition( playArea.bucket.position );
    bucketHole.center = bucketFrontNode.centerTop;
    this.onesCreatorNode.centerBottom = bucketFrontNode.center;
    this.addChild( bucketFrontNode );

    // @private {Node} - Where all of the paper numbers are. Created if not provided.
    this.paperNumberLayerNode = null;
    if ( options.paperNumberLayerNode ) {
      this.paperNumberLayerNode = options.paperNumberLayerNode;
    }
    else {
      this.paperNumberLayerNode = new Node();
      this.addChild( this.paperNumberLayerNode );
    }
  }

  /**
   * Add a paper number to the playArea and immediately start dragging it with the provided event.
   * @public
   *
   * @param {SceneryEvent} event - The Scenery event that triggered this.
   * @param {PaperNumber} paperNumber - The paper number to add and then drag
   */
  addAndDragNumber( event, paperNumber ) {

    // Add it and lookup the related node.
    this.playArea.addPaperNumber( paperNumber );
    const paperNumberNode = this.findPaperNumberNode( paperNumber );
    paperNumberNode.startSyntheticDrag( event );
  }

  /**
   * Creates and adds a PaperNumberNode.
   * @public
   *
   * @param {PaperNumber} paperNumber
   * @returns {PaperNumberNode} - The created node
   */
  onPaperNumberAdded( paperNumber ) {

    // let the model know if is being shared or not
    paperNumber.viewHasIndependentModel = this.viewHasIndependentModel;

    const paperNumberNode = new PaperNumberNode( paperNumber, this.availableViewBoundsProperty,
      this.addAndDragNumberCallback, this.tryToCombineNumbersCallback, this.playObjectTypeProperty, this.groupingLinkingTypeProperty );

    // if a number's value is set to 0, make it's corresponding node not pickable (since it's on its way to the bucket)
    paperNumber.numberValueProperty.link( numberValue => {
      if ( numberValue < 1 ) {
        paperNumberNode.pickable = false;
        paperNumberNode.interruptSubtreeInput();
      }
    } );

    this.paperNumberNodeMap[ paperNumberNode.paperNumber.id ] = paperNumberNode;
    this.paperNumberLayerNode.addChild( paperNumberNode );
    paperNumberNode.attachListeners();

    this.closestDragListener.addDraggableItem( paperNumberNode );

    // Add listeners
    paperNumberNode.splitEmitter.addListener( this.numberSplitListener );
    paperNumberNode.interactionStartedEmitter.addListener( this.numberInteractionListener );
    paperNumber.endAnimationEmitter.addListener( this.numberAnimationFinishedListener );
    paperNumber.endDragEmitter.addListener( this.numberDragFinishedListener );
  }

  /**
   * Handles removing the relevant PaperNumberNode
   * @public
   *
   * @param {PaperNumber} paperNumber
   */
  onPaperNumberRemoved( paperNumber ) {
    const paperNumberNode = this.findPaperNumberNode( paperNumber );

    // Remove listeners
    paperNumber.endDragEmitter.removeListener( this.numberDragFinishedListener );
    paperNumber.endAnimationEmitter.removeListener( this.numberAnimationFinishedListener );
    paperNumberNode.interactionStartedEmitter.removeListener( this.numberInteractionListener );
    paperNumberNode.splitEmitter.removeListener( this.numberSplitListener );

    delete this.paperNumberNodeMap[ paperNumberNode.paperNumber.id ];
    this.closestDragListener.removeDraggableItem( paperNumberNode );
    paperNumberNode.dispose();
  }

  /**
   * Given a {PaperNumber}, find our current display ({PaperNumberNode}) of it.
   * @public
   *
   * @param {PaperNumber} paperNumber
   * @returns {PaperNumberNode}
   */
  findPaperNumberNode( paperNumber ) {
    const result = this.paperNumberNodeMap[ paperNumber.id ];
    assert && assert( result, 'Did not find matching Node' );
    return result;
  }

  /**
   * When the user drops a paper number they were dragging, see if it can combine with any other nearby paper numbers.
   * @public
   *
   * @param {PaperNumber} draggedPaperNumber
   */
  tryToCombineNumbers( draggedPaperNumber ) {
    const draggedNode = this.findPaperNumberNode( draggedPaperNumber );
    const allPaperNumberNodes = _.filter( this.paperNumberLayerNode.children, child => child instanceof PaperNumberNode );

    // remove any paperNumbers with a value of 0 - these are already on their way back to the bucket and should not
    // be tried to combined with. return if no paperNumbers are left or if the draggedPaperNumber's value is 0
    _.remove( allPaperNumberNodes, paperNumberNode => {
      return paperNumberNode.paperNumber.numberValueProperty.value === 0;
    } );
    if ( allPaperNumberNodes.length === 0 || draggedPaperNumber.numberValueProperty.value === 0 ) {
      return;
    }

    const droppedNodes = draggedNode.findAttachableNodes( allPaperNumberNodes );

    // Check them in reverse order (the one on the top should get more priority)
    droppedNodes.reverse();

    for ( let i = 0; i < droppedNodes.length; i++ ) { // eslint-disable-line no-unreachable-loop
      const droppedNode = droppedNodes[ i ];
      const droppedPaperNumber = droppedNode.paperNumber;

      // if grouping is turned off, repel away
      if ( this.groupingLinkingTypeProperty && this.groupingLinkingTypeProperty.value === GroupingLinkingType.NO_GROUPING ) {
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

    // if the dragged number is  larger than the node below it (dropped node), reorder
    // them in a way to bring small number on the top. see issue #39
    for ( let i = 0; i < allPaperNumberNodes.length; i++ ) {
      if ( allPaperNumberNodes[ i ] === draggedNode ) {
        continue;
      }

      if ( allPaperNumberNodes[ i ].bounds.intersectsBounds( draggedNode.bounds ) ) {
        if ( draggedNode.bounds.width > allPaperNumberNodes[ i ].bounds.width ) {
          allPaperNumberNodes[ i ].moveToFront();
        }
      }
    }
  }

  /**
   * Whether the paper number is predominantly over the explore panel (should be collected).
   * @private
   *
   * @param {PaperNumber} paperNumber
   * @returns {boolean}
   */
  isNumberInReturnZone( paperNumber ) {
    // TODO: This may need more attention, see https://github.com/phetsims/number-play/issues/19
    const localBounds = paperNumber.alternateBounds && paperNumber.viewHasIndependentModel ?
                        paperNumber.alternateBounds : paperNumber.getLocalBounds();

    const position = paperNumber.positionProperty.value;
    const parentBounds = new Bounds2( position.x + localBounds.minX, position.y + localBounds.minY,
      position.x + localBounds.maxX, position.y + localBounds.maxY );

    // And the bounds of our panel
    const panelBounds = this.onesCreatorNode.bounds.withMaxY( this.availableViewBoundsProperty.value.bottom );

    return panelBounds.intersectsBounds( parentBounds );
  }

  /**
   * Called when a paper number node is split.
   * @private
   *
   * @param {PaperNumberNode} paperNumberNode
   */
  onNumberSplit( paperNumberNode ) {
    // this.playArea.splitCue.triggerFade();
  }

  /**
   * Called when a paper number node starts being interacted with.
   * @private
   *
   * @param {PaperNumberNode} paperNumberNode
   */
  onNumberInteractionStarted( paperNumberNode ) {
    const paperNumber = paperNumberNode.paperNumber;
    if ( paperNumber.numberValueProperty.value > 1 ) {
      // this.playArea.splitCue.attachToNumber( paperNumber );
    }
  }

  /**
   * Called when a paper number has finished animating to its destination.
   * @private
   *
   * @param {PaperNumber} paperNumber
   */
  onNumberAnimationFinished( paperNumber ) {

    // If it animated to the return zone, it's probably split and meant to be returned.
    if ( this.isNumberInReturnZone( paperNumber ) && this.playArea.paperNumbers.includes( paperNumber ) ) {
      this.playArea.removePaperNumber( paperNumber );
    }
  }

  /**
   * Called when a paper number has finished being dragged.
   * @private
   *
   * @param {PaperNumber} paperNumber
   */
  onNumberDragFinished( paperNumber ) {

    // Return it to the panel if it's been dropped in the panel.
    if ( this.isNumberInReturnZone( paperNumber ) ) {

      const paperNumberValue = paperNumber.numberValueProperty.value;
      paperNumber.numberValueProperty.value = 0;

      // Set its destination to the proper target (with the offset so that it will disappear once centered).
      let targetPosition = this.onesCreatorNode.getOriginPosition();

      // TODO: the ternary below is a hack that shouldn't be needed once https://github.com/phetsims/number-play/issues/6 is fixed.
      const paperCenterOffset = new PaperNumber( paperNumberValue > 0 ? paperNumberValue : 1, new Vector2( 0, 0 ) ).getLocalBounds().center;
      targetPosition = targetPosition.minus( paperCenterOffset );
      paperNumber.setDestination( targetPosition, true );


      // TODO: the need for this guard means that the play areas are not in sync, and should be eliminated when https://github.com/phetsims/number-play/issues/6 is fixed.
      if ( this.playArea.currentNumberProperty.value > this.playArea.currentNumberProperty.range.min ) {

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
