// Copyright 2019, University of Colorado Boulder

/**
 * Class for a 'Block Values' Node, which creates two stacks of blocks that represent the given left and right current
 * numbers.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const SIDE_LENGTH = 20; // the side length of one block
  const PADDING = 1; // padding between blocks

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
          fill: 'black'
        } ) );
      } );
      const leftStack = new VBox( {
        children: leftBlocks,
        spacing: PADDING
      } );

      // create and add the right blocks
      _.times( rightCurrentNumber, () => {
        rightBlocks.push( new Rectangle( 0, 0, SIDE_LENGTH, SIDE_LENGTH, {
          fill: NumberPlayConstants.ORANGE_BACKGROUND
        } ) );
      } );
      const rightStack = new VBox( {
        children: rightBlocks,
        spacing: PADDING
      } );

      // align and return
      return new HBox( {
        children: [ leftStack, rightStack ],
        spacing: PADDING * 2,
        align: 'bottom'
      } );
    }
  }

  return numberPlay.register( 'BlockValuesNode', BlockValuesNode );
} );