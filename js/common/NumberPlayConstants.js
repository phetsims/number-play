// Copyright 2019-2021, University of Colorado Boulder

/**
 * Constants used in multiple locations within this simulation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import numberPlay from '../numberPlay.js';

// constants used to define other constants
const LIGHT_GREEN_BACKGROUND = 'rgb( 215, 255, 227 )';
const LIGHT_ORANGE_BACKGROUND = 'rgb( 255, 242, 220 )';

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
  LOWER_ACCORDION_BOX_WIDTH: 414,          // width of the 'lower' accordion boxes on both screens
  LOWER_ACCORDION_BOX_CONTENT_WIDTH: 372,  // width of the 'lower' accordion box content on both screens
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

  // screen backgrounds
  TEN_SCREEN_BACKGROUND: LIGHT_GREEN_BACKGROUND,
  TWENTY_SCREEN_BACKGROUND: LIGHT_ORANGE_BACKGROUND,

  // accordion box backgrounds
  GREEN_BACKGROUND: 'rgb( 159, 237, 172 )',
  LIGHT_GREEN_BACKGROUND: LIGHT_GREEN_BACKGROUND,
  ORANGE_BACKGROUND: 'rgb( 249, 210, 172 )',
  LIGHT_ORANGE_BACKGROUND: LIGHT_ORANGE_BACKGROUND,
  PURPLE_BACKGROUND: 'rgb( 252, 220, 255 )',
  BLUE_BACKGROUND: 'rgb( 204, 239, 255 )',
  WHITE_BACKGROUND: 'rgb( 255, 255, 255 )',

  // misc TODO: when base classes exist, move bucket specs there
  BUCKET_BASE_COLOR: 'rgb( 100, 101, 162 )',
  BUCKET_SIZE: new Dimension2( 100, 50 ) // in screen coordinates
};

numberPlay.register( 'NumberPlayConstants', NumberPlayConstants );
export default NumberPlayConstants;