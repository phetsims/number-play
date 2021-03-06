// Copyright 2019-2021, University of Colorado Boulder

/**
 * Node that contains a 1, which can be clicked/dragged to create draggable paper numbers. This file was
 * copied from make-a-ten/explore/view/ExplorePanel.js and then modified by @chrisklus to be used in number-play.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BaseNumber from '../../../../counting-common/js/common/model/BaseNumber.js';
import PaperNumber from '../../../../counting-common/js/common/model/PaperNumber.js';
import BaseNumberNode from '../../../../counting-common/js/common/view/BaseNumberNode.js';
import BasePictorialNode from '../../../../counting-common/js/common/view/BasePictorialNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';

// constants
const NUMBER_VALUE = NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE;

class OnesCreatorNode extends Node {

  /**
   * @param {OnesPlayAreaNode} playAreaNode
   * @param {NumberProperty} sumProperty
   * @param {EnumerationProperty.<PlayObjectType>} [playObjectTypeProperty]
   */
  constructor( playAreaNode, sumProperty, playObjectTypeProperty ) {
    super();

    assert && assert( sumProperty.range, `Range is required: ${sumProperty.range}` );
    const maxSum = sumProperty.range.max;

    // @private {MakeATenExploreScreenView}
    this.playAreaNode = playAreaNode;

    function createTarget() {
      const node = new Node( {
        cursor: 'pointer',
        // empirically determined stacking
        children: [ new Vector2( -11, -11 ), new Vector2( 0, 0 ) ].map( offset => {
          let targetNode;
          // TODO: needs attention, see https://github.com/phetsims/number-play/issues/19
          if ( playObjectTypeProperty ) {
            targetNode = new BasePictorialNode( new BaseNumber( 1, 0 ), 1, false, playObjectTypeProperty );
            targetNode.scale( 0.85 );
          }
          else {
            targetNode = new BaseNumberNode( new BaseNumber( 1, 0 ), 1, false );
            targetNode.scale( 0.64, 0.55 );
          }
          targetNode.translation = offset;
          return targetNode;
        } )
      } );
      node.touchArea = node.localBounds.dilatedX( 15 ).dilatedY( 5 );

      // We need to be disabled if adding this number would increase the sum past the maximum sum.
      new DerivedProperty( [ sumProperty ], sum => sum + NUMBER_VALUE <= maxSum ).linkAttribute( node, 'visible' );

      node.addInputListener( {
        down: event => {
          if ( !event.canStartPress() ) { return; }

          // We want this relative to the screen view, so it is guaranteed to be the proper view coordinates.
          const viewPosition = playAreaNode.globalToLocalPoint( event.pointer.point );
          const paperNumber = new PaperNumber( NUMBER_VALUE, new Vector2( 0, 0 ) );

          // TODO: needs improvement, magic values determined from bounds of rendered play object nodes, see https://github.com/phetsims/number-play/issues/19
          const dragTargetOffset = playObjectTypeProperty ? new Vector2( 41, 57 ) : paperNumber.getDragTargetOffset();

          // Once we have the number's bounds, we set the position so that our pointer is in the middle of the drag target.
          paperNumber.setDestination( viewPosition.minus( dragTargetOffset ), false );

          // Create and start dragging the new paper number node
          playAreaNode.addAndDragNumber( event, paperNumber );

          // TODO: the need for this guard means that the play areas are not in sync, and should be eliminated when https://github.com/phetsims/number-play/issues/6 is fixed.
          if ( playAreaNode.playArea.currentNumberProperty.value < playAreaNode.playArea.currentNumberProperty.range.max ) {

            // a user grabbed a new number, so update the sim's currentNumberProperty
            playAreaNode.playArea.isControllingCurrentNumber = true;
            playAreaNode.playArea.currentNumberProperty.value++;
            playAreaNode.playArea.isControllingCurrentNumber = false;
          }
        }
      } );

      return node;
    }

    // @private {Node}
    this.oneTarget = createTarget();
    this.addChild( this.oneTarget );
  }

  /**
   * Return the view coordinates of the target.
   * @public
   *
   * @returns {Vector2}
   */
  getOriginPosition() {

    // Trail to playAreaNode, not including the playAreaNode
    let trail = this.playAreaNode.getUniqueLeafTrailTo( this.oneTarget );
    trail = trail.slice( 1, trail.length );

    // Transformed to view coordinates
    return trail.localToGlobalPoint( this.oneTarget.localBounds.center );
  }
}

numberPlay.register( 'OnesCreatorNode', OnesCreatorNode );
export default OnesCreatorNode;
