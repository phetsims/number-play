// Copyright 2019-2021, University of Colorado Boulder

/**
 * Class for a 'Block Values' Node, which creates two stacks of blocks that represent the given left and right current
 * numbers.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import numberPlay from '../../numberPlay.js';

// constants
const SIDE_LENGTH = 19; // the side length of one block
const PADDING = 2; // padding between blocks

class BlockValuesNode extends Node {

  /**
   * @param {NumberProperty} leftCurrentNumberProperty
   * @param {NumberProperty} rightCurrentNumberProperty
   */
  constructor( leftCurrentNumberProperty, rightCurrentNumberProperty ) {
    super();

    // TODO: Fix drawing so initial state can be setup and updated here
  }

  /**
   * Draws a blockValuesNode, which is two 'towers' of blocks, where the height of each tower corresponds to the
   * values of the provided numbers.
   *
   * @param {number} leftCurrentNumber
   * @param {number} rightCurrentNumber
   * @param {boolean} includeInvisibleBlocks - use true if expecting any values of 0
   * @returns {Node}
   * @public
   */
  static getBlockValuesNode( leftCurrentNumber, rightCurrentNumber, includeInvisibleBlocks ) {
    const leftBlocks = [];
    const rightBlocks = [];

    if ( includeInvisibleBlocks ) {

      // add invisible blocks to each stack so that the node can still be positioned correctly when values are 0
      leftBlocks.push( new Rectangle( 0, 0, SIDE_LENGTH, SIDE_LENGTH, {
        visible: false
      } ) );
      rightBlocks.push( new Rectangle( 0, 0, SIDE_LENGTH, SIDE_LENGTH, {
        visible: false
      } ) );
    }

    // create and add the left blocks
    _.times( leftCurrentNumber, () => {
      leftBlocks.push( new Rectangle( 0, 0, SIDE_LENGTH, SIDE_LENGTH, {
        fill: NumberPlayConstants.MEDIUM_GREEN_FILL
      } ) );
    } );
    const leftStack = new VBox( {
      children: leftBlocks,
      spacing: PADDING,
      excludeInvisibleChildrenFromBounds: false
    } );

    // create and add the right blocks
    _.times( rightCurrentNumber, () => {
      rightBlocks.push( new Rectangle( 0, 0, SIDE_LENGTH, SIDE_LENGTH, {
        fill: NumberPlayConstants.MEDIUM_ORANGE_FILL
      } ) );
    } );
    const rightStack = new VBox( {
      children: rightBlocks,
      spacing: PADDING,
      excludeInvisibleChildrenFromBounds: false
    } );

    // align and return
    return new HBox( {
      children: [ leftStack, rightStack ],
      spacing: PADDING,
      align: 'bottom'
    } );
  }
}

numberPlay.register( 'BlockValuesNode', BlockValuesNode );
export default BlockValuesNode;