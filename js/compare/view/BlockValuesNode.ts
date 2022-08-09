// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for a 'Block Values' Node, which creates two stacks of blocks that represent the given left and right current
 * numbers.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Node, Rectangle, VBox } from '../../../../scenery/js/imports.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import numberPlay from '../../numberPlay.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

// constants
const SIDE_LENGTH = 20.8; // the side length of one block
const PADDING = 2; // padding between blocks

class BlockValuesNode extends Node {

  public constructor( leftCurrentNumberProperty: TReadOnlyProperty<number>, rightCurrentNumberProperty: TReadOnlyProperty<number> ) {
    super();

    // TODO: Fix drawing so initial state can be setup and updated here
  }

  /**
   * Draws a blockValuesNode, which is two 'towers' of blocks, where the height of each tower corresponds to the
   * values of the provided numbers.
   */
  public static getBlockValuesNode( leftCurrentNumber: number, rightCurrentNumber: number ): Node {

    // create the base, which sits below the block stacks
    const baseNode = new Rectangle( 0, 0, SIDE_LENGTH * 2 + PADDING, 1.25, {
      fill: 'black'
    } );

    const leftBlocks: Node[] = [];
    const rightBlocks: Node[] = [];

    // create and add the left blocks
    _.times( leftCurrentNumber, () => {
      leftBlocks.push( new Rectangle( 0, 0, SIDE_LENGTH, SIDE_LENGTH, {
        fill: NumberPlayColors.purpleHighlightColorProperty
      } ) );
    } );
    const leftStack = new VBox( {
      children: leftBlocks,
      spacing: PADDING,
      excludeInvisibleChildrenFromBounds: false,
      left: baseNode.left,
      bottom: baseNode.top - PADDING
    } );

    // create and add the right blocks
    _.times( rightCurrentNumber, () => {
      rightBlocks.push( new Rectangle( 0, 0, SIDE_LENGTH, SIDE_LENGTH, {
        fill: NumberPlayColors.orangeHighlightColorProperty
      } ) );
    } );
    const rightStack = new VBox( {
      children: rightBlocks,
      spacing: PADDING,
      excludeInvisibleChildrenFromBounds: false,
      right: baseNode.right,
      bottom: baseNode.top - PADDING
    } );

    return new Node( {
      children: [ leftStack, rightStack, baseNode ]
    } );
  }
}

numberPlay.register( 'BlockValuesNode', BlockValuesNode );
export default BlockValuesNode;