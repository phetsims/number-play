// Copyright 2019-2021, University of Colorado Boulder

/**
 * Visual view of paper numbers (PaperNumber), with stacked images based on the digits of the number.
 *
 * @author Sharfudeen Ashraf
 * @author Chris Klusendorf (PhET Interactive Simulations), copied from counting-common
 */

import Emitter from '../../../../axon/js/Emitter.js';
import ArithmeticRules from '../../../../counting-common/js/common/model/ArithmeticRules.js';
import BaseNumber from '../../../../counting-common/js/common/model/BaseNumber.js';
import PaperNumber from '../../../../counting-common/js/common/model/PaperNumber.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import arrayRemove from '../../../../phet-core/js/arrayRemove.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import numberPlay from '../../numberPlay.js';
import BaseNumberNode from './BaseNumberNode.js';

class PaperNumberNode extends Node {
  /**
   * @param {PaperNumber} paperNumber
   * @param {Property.<Bounds2>} availableViewBoundsProperty
   * @param {Function} addAndDragNumber - function( event, paperNumber ), adds and starts a drag for a number
   * @param {Function} tryToCombineNumbers - function( paperNumber ), called to combine our paper number
   * @param {EnumerationProperty.<PlayObjectType>} playObjectTypeProperty
   */
  constructor( paperNumber, availableViewBoundsProperty, addAndDragNumber, tryToCombineNumbers, playObjectTypeProperty ) {

    super();

    // @public {EnumerationProperty.<PlayObjectType>}
    this.playObjectTypeProperty = playObjectTypeProperty;

    // @public {PaperNumber} - Our model
    this.paperNumber = paperNumber;

    // @public {Emitter} - Triggered with self when this paper number node starts to get dragged
    this.moveEmitter = new Emitter( { parameters: [ { valueType: PaperNumberNode } ] } );

    // @public {Emitter} - Triggered with self when this paper number node is split
    this.splitEmitter = new Emitter( { parameters: [ { valueType: PaperNumberNode } ] } );

    // @public {Emitter} - Triggered when user interaction with this paper number begins.
    this.interactionStartedEmitter = new Emitter( { parameters: [ { valueType: PaperNumberNode } ] } );

    // @private {boolean} - When true, don't emit from the moveEmitter (synthetic drag)
    this.preventMoveEmit = false;

    // @private {Bounds2}
    this.availableViewBoundsProperty = availableViewBoundsProperty;

    // @private {Node} - Container for the digit image nodes
    this.numberImageContainer = new Node( {
      pickable: false
    } );
    this.addChild( this.numberImageContainer );

    // @private {Rectangle} - Hit target for the "split" behavior, where one number would be pulled off from the
    //                        existing number.
    this.splitTarget = new Rectangle( 0, 0, 0, 0, {
      cursor: 'pointer'
    } );
    this.addChild( this.splitTarget );

    // @private {Rectangle} - Hit target for the "move" behavior, which just drags the existing paper number.
    this.moveTarget = new Rectangle( 0, 0, 100, 100, {
      cursor: 'move'
    } );
    this.addChild( this.moveTarget );

    // View-coordinate offset between our position and the pointer's position, used for keeping drags synced.
    // @private {DragListener}
    this.moveDragHandler = new DragListener( {
      targetNode: this,
      pressCursor: 'move', // Our target doesn't have the move cursor, so we need to override here
      start: ( event, listener ) => {
        this.interactionStartedEmitter.emit( this );
        if ( !this.preventMoveEmit ) {
          this.moveEmitter.emit( this );
        }
      },

      drag: ( event, listener ) => {
        paperNumber.setConstrainedDestination( availableViewBoundsProperty.value, listener.parentPoint );
      },

      end: ( event, listener ) => {
        tryToCombineNumbers( this.paperNumber );
        paperNumber.endDragEmitter.emit( paperNumber );
      }
    } );
    this.moveDragHandler.isUserControlledProperty.link( controlled => {
      paperNumber.userControlledProperty.value = controlled;
    } );
    this.moveTarget.addInputListener( this.moveDragHandler );

    // @private {Object}
    this.splitDragHandler = {
      down: event => {
        if ( !event.canStartPress() ) { return; }

        const viewPosition = this.globalToParentPoint( event.pointer.point );

        // Determine how much (if any) gets moved off
        const pulledPlace = paperNumber.getBaseNumberAt( this.parentToLocalPoint( viewPosition ) ).place;
        const amountToRemove = ArithmeticRules.pullApartNumbers( paperNumber.numberValueProperty.value, pulledPlace );
        const amountRemaining = paperNumber.numberValueProperty.value - amountToRemove;

        // it cannot be split - so start moving
        if ( !amountToRemove ) {
          this.startSyntheticDrag( event );
          return;
        }

        paperNumber.changeNumber( amountRemaining );

        this.interactionStartedEmitter.emit( this );
        this.splitEmitter.emit( this );

        const newPaperNumber = new PaperNumber( amountToRemove, paperNumber.positionProperty.value );
        addAndDragNumber( event, newPaperNumber );
      }
    };
    this.splitTarget.addInputListener( this.splitDragHandler );

    // @private {Function} - Listener that hooks model position to view translation.
    this.translationListener = position => {
      this.translation = position;
    };

    // @private {Function} - Listener for when our number changes
    this.updateNumberListener = this.updateNumber.bind( this );

    // @private {Function} - Listener reference that gets attached/detached. Handles moving the Node to the front.
    this.userControlledListener = userControlled => {
      if ( userControlled ) {
        this.moveToFront();
      }
    };
  }

  /**
   * Rebuilds the image nodes that display the actual paper number, and resizes the mouse/touch targets.
   * @private
   */
  updateNumber() {
    const reversedBaseNumbers = this.paperNumber.baseNumbers.slice().reverse();

    // Reversing allows easier opacity computation and has the nodes in order for setting children.
    this.numberImageContainer.children = _.map( reversedBaseNumbers, ( baseNumber, index ) => new BaseNumberNode( baseNumber, 0.95 * Math.pow( 0.97, index ), reversedBaseNumbers.length > 1, this.playObjectTypeProperty ) );

    // Grab the bounds of the biggest base number for the full bounds
    const fullBounds = this.paperNumber.baseNumbers[ this.paperNumber.baseNumbers.length - 1 ].bounds;

    // Split target only visible if our number is > 1. Move target can resize as needed.
    if ( this.paperNumber.numberValueProperty.value === 1 ) {
      this.splitTarget.visible = false;
      this.moveTarget.mouseArea = this.moveTarget.touchArea = this.moveTarget.rectBounds = fullBounds;
      this.splitTarget.mouseArea = this.moveTarget.touchArea = this.moveTarget.rectBounds = new Bounds2( 0, 0, 0, 0 );
    }
    else {
      this.splitTarget.visible = true;

      // Locate the boundary between the "move" input area and "split" input area.
      const boundaryY = this.paperNumber.getBoundaryY();

      // Modify our move/split targets
      this.moveTarget.mouseArea = this.moveTarget.touchArea = this.moveTarget.rectBounds = fullBounds.withMinY( boundaryY );
      this.splitTarget.mouseArea = this.splitTarget.touchArea = this.splitTarget.rectBounds = fullBounds.withMaxY( boundaryY );
    }

    // Changing the number must have happened from an interaction. If combined, we want to put cues on this.
    this.interactionStartedEmitter.emit( this );
  }

  /**
   * Called when we grab an event from a different input (like clicking the paper number in the explore panel, or
   * splitting paper numbers), and starts a drag on this paper number.
   * @public
   *
   * @param {SceneryEvent} event - Scenery event from the relevant input handler
   */
  startSyntheticDrag( event ) {
    // Don't emit a move event, as we don't want the cue to disappear.
    this.preventMoveEmit = true;
    this.moveDragHandler.press( event );
    this.preventMoveEmit = false;
  }

  /**
   * Implements the API for ClosestDragListener.
   * @public
   *
   * @param {SceneryEvent} event - Scenery event from the relevant input handler
   */
  startDrag( event ) {
    if ( this.globalToLocalPoint( event.pointer.point ).y < this.splitTarget.bottom && this.paperNumber.numberValueProperty.value > 1 ) {
      this.splitDragHandler.down( event );
    }
    else {
      this.moveDragHandler.press( event );
    }
  }

  /**
   * Implements the API for ClosestDragListener.
   * @public
   *
   * @param {Vector2} globalPoint
   */
  computeDistance( globalPoint ) {
    if ( this.paperNumber.userControlledProperty.value ) {
      return Number.POSITIVE_INFINITY;
    }
    else {
      const globalBounds = this.localToGlobalBounds( this.paperNumber.getLocalBounds() );
      return Math.sqrt( globalBounds.minimumDistanceToPointSquared( globalPoint ) );
    }
  }

  /**
   * Attaches listeners to the model. Should be called when added to the scene graph.
   * @public
   */
  attachListeners() {
    // mirrored unlinks in detachListeners()
    this.paperNumber.userControlledProperty.link( this.userControlledListener );
    this.paperNumber.numberValueProperty.link( this.updateNumberListener );
    this.paperNumber.positionProperty.link( this.translationListener );
  }

  /**
   * Removes listeners from the model. Should be called when removed from the scene graph.
   * @public
   */
  detachListeners() {
    this.paperNumber.positionProperty.unlink( this.translationListener );
    this.paperNumber.numberValueProperty.unlink( this.updateNumberListener );
    this.paperNumber.userControlledProperty.unlink( this.userControlledListener );
  }

  /**
   * Find all nodes which are attachable to the dragged node. This method is called once the user ends the dragging.
   * @public
   *
   * @param {Array.<PaperNumberNode>} allPaperNumberNodes
   * @returns {Array}
   */
  findAttachableNodes( allPaperNumberNodes ) {
    const attachableNodeCandidates = allPaperNumberNodes.slice();
    arrayRemove( attachableNodeCandidates, this );

    return attachableNodeCandidates.filter( candidateNode => PaperNumber.arePaperNumbersAttachable( this.paperNumber, candidateNode.paperNumber ) );
  }

  /**
   * Given a number's digit and place, looks up the associated image.
   * @public
   *
   * @param {number} digit
   * @param {number} place
   * @returns {HTMLImageElement}
   */
  static getNumberImage( digit, place ) {
    return new BaseNumberNode( new BaseNumber( digit, place ), 1 );
  }
}

numberPlay.register( 'PaperNumberNode', PaperNumberNode );

export default PaperNumberNode;