// Copyright 2021, University of Colorado Boulder

/**
 * NumberPlayQueryParameters defines query parameters that are specific to this simulation.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import numberPlay from '../numberPlay.js';
import NumberPlayConstants from './NumberPlayConstants.js';

// constants
const GAME_LEVELS_DEFAULT_VALUES = [
  `${NumberPlayConstants.A}1`, // a1
  `${NumberPlayConstants.A}2`, // a2
  `${NumberPlayConstants.B}1`, // b1
  `${NumberPlayConstants.B}2`  // b2
];

const NumberPlayQueryParameters = QueryStringMachine.getAll( {

  // time that the objects are shown when they “flash” in the ‘Subitize’ game, in seconds. If the user gets the answer
  // incorrect 3 times on a single challenge, the time is increased for that challenge until it's answered correctly.
  subitizerTimeVisible: {
    public: true,
    type: 'number',
    defaultValue: NumberPlayConstants.SHAPE_VISIBLE_TIME
  },

  // the levels to show in the 'Game' screen. 'a' levels correspond to the 'Counting' game, while 'b' levels
  // correspond to the 'Subitize' game
  gameLevels: {
    public: true,
    type: 'array',
    elementSchema: {
      type: 'string',
      isValidValue: element => GAME_LEVELS_DEFAULT_VALUES.includes( element )
    },
    defaultValue: GAME_LEVELS_DEFAULT_VALUES,

    // if provided, at least one level is required and repeated levels are not allowed
    isValidValue: array => ( array.length > 0 ) && ( array.length === _.uniq( array ).length )
  }

} );

numberPlay.register( 'NumberPlayQueryParameters', NumberPlayQueryParameters );
export default NumberPlayQueryParameters;