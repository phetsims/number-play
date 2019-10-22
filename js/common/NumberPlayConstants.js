// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within this simulation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );

  const NumberPlayConstants = {

    // the two defining numbers of this sim
    TEN: 10,
    TWENTY: 20,

    PAPER_NUMBER_INITIAL_VALUE: 1, // the initial value of every created paperNumber

    // accordion box sizing, all of which is defined here for convenience. values come from the screen design asset.

    // sizing for the 'upper' accordion boxes, which include the 'Number', 'Numeral', and 'Ten Frame' accordion boxes
    NUMERAL_ACCORDION_BOX_WIDTH: 192,        // width of the 'Numeral' accordion box on both screens
    UPPER_OUTER_ACCORDION_BOX_WIDTH: 304,    // width of the accordion boxes in the upper left and right of both screens
    TEN_UPPER_ACCORDION_BOX_HEIGHT: 146,     // height of the upper accordion boxes on the 'Ten' screen
    TWENTY_UPPER_ACCORDION_BOX_HEIGHT: 98,   // height of the upper accordion boxes on the 'Twenty' screen

    // sizing for the 'lower' accordion boxes, which include the 'Ones' and 'Objects' accordion boxes
    TEN_LOWER_ACCORDION_BOX_WIDTH: 414,      // width of the 'lower' accordion boxes on the 'Ten' screen
    TWENTY_ONES_ACCORDION_BOX_WIDTH: 536,    // width of the 'Ones' accordion box on the Twenty screen
    TWENTY_OBJECTS_ACCORDION_BOX_WIDTH: 304, // width of the 'Objects' accordion box on the Twenty screen
    TEN_LOWER_ACCORDION_BOX_HEIGHT: 405,     // height of the 'lower' accordion boxes on the 'Ten' screen
    TWENTY_LOWER_ACCORDION_BOX_HEIGHT: 448,  // height of the 'lower' accordion boxes on the 'Twenty' screen

    // layout
    SCREEN_VIEW_X_PADDING: 15,               // minimum x-distance any node is positioned from the edges of the sim
    SCREEN_VIEW_Y_PADDING: 15,               // minimum y-distance any node is positioned from the edges of the sim
    ACCORDION_BOX_X_MARGIN: 72,              // distance between the sides of the sim and all adjacent accordion boxes
    ACCORDION_BOX_TOP_MARGIN: 26,            // distance between the top of the sim and all 'upper' accordion boxes
    ACCORDION_BOX_BOTTOM_MARGIN: 15,         // distance between the bottom of the sim and all 'lower' accordion boxes

    // options for all AccordionBox instances
    ACCORDION_BOX_OPTIONS: {
      resize: false,
      titleAlignX: 'left',
      titleXSpacing: 8,
      showTitleWhenExpanded: false,
      cornerRadius: 6,
      titleYMargin: 10,
      buttonXMargin: 10,
      buttonYMargin: 10,
      contentXMargin: 10,
      contentYMargin: 0,
      contentXSpacing: 0,
      contentAlign: 'left',
      expandCollapseButtonOptions: {
        sideLength: 20
      }
    },
    ACCORDION_BOX_TITLE_FONT: new PhetFont( 16 ),

    // colors
    TEN_SCREEN_BACKGROUND: 'rgb( 171, 255, 195 )',
    TWENTY_SCREEN_BACKGROUND: 'rgb( 255, 250, 210 )',
    GREEN_BACKGROUND: 'rgb( 217, 255, 223 )',
    ORANGE_BACKGROUND: 'rgb( 255, 218, 176 )',
    PURPLE_BACKGROUND: 'rgb( 254, 202, 255 )',
    BLUE_BACKGROUND: 'rgb( 190, 232, 255 )',
    BUCKET_BASE_COLOR: 'rgb( 100, 101, 162 )',

    // misc TODO: when base classes exist, move bucket specs there
    BUCKET_SIZE: new Dimension2( 100, 50 ) // in screen coordinates
  };

  return numberPlay.register( 'NumberPlayConstants', NumberPlayConstants );
} );