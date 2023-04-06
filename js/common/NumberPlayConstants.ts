// Copyright 2019-2023, University of Colorado Boulder

/**
 * Constants defined for this simulation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import numberPlay from '../numberPlay.js';
import CountingCommonConstants from '../../../counting-common/js/common/CountingCommonConstants.js';

const NumberPlayConstants = {

  // the two defining numbers of the 'Ten' and 'Twenty' screens
  TEN: 10,
  MAX_SUM: CountingCommonConstants.MAX_IMAGES_PER_COUNTING_OBJECT,

  // accordion box sizing for the 'Ten', 'Twenty', and 'Compare' screens

  // sizing for the 'upper' accordion boxes, which include the 'Number', 'Total', and 'Ten Frame' accordion boxes
  UPPER_OUTER_ACCORDION_BOX_WIDTH: 308,     // width of the accordion boxes in the upper left and upper right of the
                                            // 'Ten' and 'Twenty' screens
  UPPER_OUTER_AB_TITLE_MAX_WIDTH: 254,      // max width of the title of the upper outer accordion boxes
  TEN_UPPER_ACCORDION_BOX_HEIGHT: 145,      // height of the upper accordion boxes on the 'Ten' screen
  TWENTY_UPPER_ACCORDION_BOX_HEIGHT: 98,    // height of the upper accordion boxes on the 'Twenty' screen

  // sizing for the 'lower' accordion boxes, which include the 'Ones' and 'Objects' accordion boxes
  LOWER_ACCORDION_BOX_CONTENT_WIDTH: 422,   // width of the 'lower' accordion box content on all screens
  TEN_LOWER_ACCORDION_BOX_HEIGHT: 420,      // height of the 'lower' accordion boxes on the 'Ten' screen

  // game screen

  NUMBER_OF_LEVELS: 4,

  // subitizer game
  SHAPE_DELAY_TIME: 0.5, // amount of time to delay before showing the shape
  SHAPE_VISIBLE_TIME: 0.5, // amount of time the shape is shown, in seconds
  SHAPE_VISIBLE_TIME_INCREASE_AMOUNT: 0.1, // amount the shape visible time is increased by, in seconds
  MIN_SHAPE_VISIBLE_TIME: 0.1,
  MAX_SHAPE_VISIBLE_TIME: 2, // max amount of time the shape can be visible, in seconds
  NUMBER_OF_SUBITIZER_GUESSES_AT_NORMAL_TIME: 2, // number of guesses before increasing the shape visible time

  // amount to increase all the buttons by in the game screen (except the reveal button), in screen coordinates
  TOUCH_AREA_DILATION: 9
};

numberPlay.register( 'NumberPlayConstants', NumberPlayConstants );
export default NumberPlayConstants;