// Copyright 2016-2019, University of Colorado Boulder

/**
 * Node that contains a 1, which can be clicked/dragged to create draggable paper numbers. This file was
 * copied from make-a-ten/explore/view/ExplorePanel.js and then modified by @chrisklus to be used in number-play.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BaseNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/BaseNumber' );
  const BaseNumberNode = require( 'MAKE_A_TEN/make-a-ten/common/view/BaseNumberNode' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  const Vector2 = require( 'DOT/Vector2' );

  class OnesCreatorNode extends Node {

    /**
     * @param {OnesPlayAreaNode} playAreaNode
     * @param {NumberProperty} sumProperty
     * @param {Object} [options] - Passed to Node
     */
    constructor( playAreaNode, sumProperty ) {
      super();

      assert && assert( sumProperty.range, `Range is required: ${sumProperty.range}` );
      const maxSum = sumProperty.range.max;

      // @private {MakeATenExploreScreenView}
      this.playAreaNode = playAreaNode;

      function createTarget( place ) {
        const numberValue = Math.pow( 10, place );
        const node = new Node( {
          cursor: 'pointer',
          // empirically determined stacking
          children: [ new Vector2( -8, -8 ), new Vector2( 0, 0 ) ].map( function( offset ) {
            const paperNode = new BaseNumberNode( new BaseNumber( 1, place ), 1 );
            paperNode.scale( 0.64, 0.55 );
            paperNode.translation = offset;
            return paperNode;
          } )
        } );
        node.touchArea = node.localBounds.dilatedX( 15 ).dilatedY( 5 );

        // We need to be disabled if adding this number would increase the sum past the maximum sum.
        new DerivedProperty( [ sumProperty ], function( sum ) {
          return sum + numberValue <= maxSum;
        } ).linkAttribute( node, 'visible' );

        node.addInputListener( {
          down: function( event ) {
            if ( !event.canStartPress() ) { return; }

            // We want this relative to the screen view, so it is guaranteed to be the proper view coordinates.
            const viewPosition = playAreaNode.globalToLocalPoint( event.pointer.point );
            const paperNumber = new PaperNumber( numberValue, new Vector2( 0, 0 ) );

            // Once we have the number's bounds, we set the position so that our pointer is in the middle of the drag target.
            paperNumber.setDestination( viewPosition.minus( paperNumber.getDragTargetOffset() ), false );

            // Create and start dragging the new paper number node
            playAreaNode.addAndDragNumber( event, paperNumber );
          }
        } );

        return node;
      }

      // @private {Node}
      this.oneTarget = createTarget( 0 );
      this.addChild( this.oneTarget );
    }

    /**
     * Given a specified number of digits for a paper number, return the view coordinates of the closest matching
     * target, so that it can animate back to this location.
     * @public
     *
     * @param {number} digits
     * @returns {Vector2}
     */
    getOriginLocation( digits ) {
      let target;
      switch( digits ) {
        case 1:
          target = this.oneTarget;
          break;
        case 2:
          target = this.tenTarget;
          break;
        case 3:
          target = this.hundredTarget;
          break;
        default:
          // Probably something big, no better place to send it
          target = this.hundredTarget;
      }

      // Trail to playAreaNode, not including the playAreaNode
      let trail = this.playAreaNode.getUniqueLeafTrailTo( target );
      trail = trail.slice( 1, trail.length );

      // Transformed to view coordinates
      return trail.localToGlobalPoint( target.localBounds.center );
    }
  }

  return numberPlay.register( 'OnesCreatorNode', OnesCreatorNode );
} );
