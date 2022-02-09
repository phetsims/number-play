// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for a 'Block Values' Node, which creates two stacks of blocks that represent the given left and right current
 * numbers.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { HBox, Node, Rectangle, VBox } from '../../../../scenery/js/imports.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import numberPlay from '../../numberPlay.js';

// constants
const SIDE_LENGTH = 20.8; // the side length of one block
const PADDING = 2; // padding between blocks

class BlockValuesNode extends Node {

  constructor( leftCurrentNumberProperty: NumberProperty, rightCurrentNumberProperty: NumberProperty ) {
    super();

    // TODO: Fix drawing so initial state can be setup and updated here
  }

  /**
   * Draws a blockValuesNode, which is two 'towers' of blocks, where the height of each tower corresponds to the
   * values of the provided numbers.
   *
   * @param leftCurrentNumber
   * @param rightCurrentNumber
   * @param includeInvisibleBlocks - use true if expecting any values of 0
   */
  public static getBlockValuesNode( leftCurrentNumber: number,
                                    rightCurrentNumber: number,
                                    includeInvisibleBlocks: boolean ): Node {
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
        fill: NumberPlayColors.purpleHighlightColorProperty
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
        fill: NumberPlayColors.orangeHighlightColorProperty
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