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
const GAME_LEVELS_DEFAULT_VALUES = [ 'a1', 'a2', 'b1', 'b2' ];

const NumberPlayQueryParameters = QueryStringMachine.getAll( {

  // always show the correct answer
  // For internal use only, not public facing.
  showCorrectAnswer: { type: 'flag' },

  // time the subitizer node is shown
  subitizerTimeVisible: {
    public: true,
    type: 'number',
    defaultValue: NumberPlayConstants.SUBITIZER_TIME_VISIBLE
  },

  // the levels to show in the 'Game' screen
  gameLevels: {
    public: true,
    type: 'array',
    elementSchema: {
      type: 'string',
      isValidValue: element => GAME_LEVELS_DEFAULT_VALUES.includes( element )
    },
    defaultValue: GAME_LEVELS_DEFAULT_VALUES,

    // if provided, at least one level is required and repeated levels are not allowed
    isValidValue: array => array.length > 0 && array.length === _.uniq( array ).length
  }

} );

numberPlay.register( 'NumberPlayQueryParameters', NumberPlayQueryParameters );
export default NumberPlayQueryParameters;