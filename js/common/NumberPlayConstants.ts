// Copyright 2019-2022, University of Colorado Boulder

/**
 * Constants defined for this simulation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import numberPlay from '../numberPlay.js';
import numberPlayStrings from '../numberPlayStrings.js';
import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import BooleanProperty from '../../../axon/js/BooleanProperty.js';

// strings
const zeroString = numberPlayStrings.zero;
const oneString = numberPlayStrings.one;
const twoString = numberPlayStrings.two;
const threeString = numberPlayStrings.three;
const fourString = numberPlayStrings.four;
const fiveString = numberPlayStrings.five;
const sixString = numberPlayStrings.six;
const sevenString = numberPlayStrings.seven;
const eightString = numberPlayStrings.eight;
const nineString = numberPlayStrings.nine;
const tenString = numberPlayStrings.ten;
const elevenString = numberPlayStrings.eleven;
const twelveString = numberPlayStrings.twelve;
const thirteenString = numberPlayStrings.thirteen;
const fourteenString = numberPlayStrings.fourteen;
const fifteenString = numberPlayStrings.fifteen;
const sixteenString = numberPlayStrings.sixteen;
const seventeenString = numberPlayStrings.seventeen;
const eighteenString = numberPlayStrings.eighteen;
const nineteenString = numberPlayStrings.nineteen;
const twentyString = numberPlayStrings.twenty;

// types
type NumberToString = {
  [ key: number ]: string
}
export type AccordionBoxOptions = { // TODO-TS: these should be defined in AccordionBox
  resize: boolean,
  titleAlignX: 'left' | 'center' | 'right',
  titleXSpacing: number,
  showTitleWhenExpanded: boolean,
  cornerRadius: number,
  titleYMargin: number,
  buttonXMargin: number,
  buttonYMargin: number,
  contentXMargin: number,
  contentYMargin: number,
  contentXSpacing: number,
  contentAlign: 'left' | 'center' | 'right',
  fill: ProfileColorProperty,
  expandCollapseButtonOptions: {
    sideLength: number
  },
  expandedProperty: BooleanProperty
}

const NumberPlayConstants = {

  // the two defining numbers of this sim
  TEN: 10,
  TWENTY: 20,

  PAPER_NUMBER_INITIAL_VALUE: 1, // the initial value of every created paperNumber

  // accordion box sizing, all of which is defined here for convenience. values come from the screen design asset.

  // sizing for the 'upper' accordion boxes, which include the 'Number', 'Total', and 'Ten Frame' accordion boxes
  TOTAL_ACCORDION_BOX_WIDTH: 200,           // width of the 'Total' accordion box on both screens
  UPPER_OUTER_ACCORDION_BOX_WIDTH: 310,     // width of the accordion boxes in the upper left and right of both screens
  UPPER_OUTER_AB_TITLE_MAX_WIDTH: 254,      // max width of the title of the upper outer accordion boxes
  TEN_UPPER_ACCORDION_BOX_HEIGHT: 146,      // height of the upper accordion boxes on the 'Ten' screen
  TWENTY_UPPER_ACCORDION_BOX_HEIGHT: 98,    // height of the upper accordion boxes on the 'Twenty' screen

  // sizing for the 'lower' accordion boxes, which include the 'Ones' and 'Objects' accordion boxes
  LOWER_ACCORDION_BOX_TITLE_MAX_WIDTH: 364, // max width of the title of the lower outer accordion boxes
  LOWER_ACCORDION_BOX_CONTENT_WIDTH: 383,   // width of the 'lower' accordion box content on both screens
  TEN_LOWER_ACCORDION_BOX_HEIGHT: 420,      // height of the 'lower' accordion boxes on the 'Ten' screen
  TWENTY_LOWER_ACCORDION_BOX_HEIGHT: 468,   // height of the 'lower' accordion boxes on the 'Twenty' screen

  // layout
  SCREEN_VIEW_PADDING_X: 15,                // minimum x-distance any node is positioned from the edges of the sim
  SCREEN_VIEW_PADDING_Y: 15,                // minimum y-distance any node is positioned from the edges of the sim
  ACCORDION_BOX_MARGIN_X: 72,               // distance between the sides of the sim and all adjacent accordion boxes

  // options for all AccordionBox instances
  ACCORDION_BOX_OPTIONS: {
    resize: true,
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
  } as AccordionBoxOptions,
  ACCORDION_BOX_TITLE_FONT: new PhetFont( 16 ),

  // map number values to their corresponding string
  NUMBER_TO_STRING: {
    0: zeroString,
    1: oneString,
    2: twoString,
    3: threeString,
    4: fourString,
    5: fiveString,
    6: sixString,
    7: sevenString,
    8: eightString,
    9: nineString,
    10: tenString,
    11: elevenString,
    12: twelveString,
    13: thirteenString,
    14: fourteenString,
    15: fifteenString,
    16: sixteenString,
    17: seventeenString,
    18: eighteenString,
    19: nineteenString,
    20: twentyString
  } as NumberToString,

  // game screen

  // subitizer game
  SHAPE_DELAY_TIME: 0.5, // amount of time to delay before showing the shape
  SHAPE_VISIBLE_TIME: 0.5, // amount of time the shape is shown, in seconds
  SHAPE_VISIBLE_TIME_INCREASE_AMOUNT: 0.1, // amount the shape visible time is increased by, in seconds
  NUMBER_OF_SUBITIZER_GUESSES_AT_NORMAL_TIME: 2, // number of guesses before increasing the shape visible time

  // amount to increase all the buttons by in the game screen (except the reveal button), in screen coordinates
  TOUCH_AREA_DILATION: 9
};

numberPlay.register( 'NumberPlayConstants', NumberPlayConstants );
export default NumberPlayConstants;