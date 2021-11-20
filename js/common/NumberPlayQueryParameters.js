// Copyright 2021, University of Colorado Boulder

import numberPlay from '../numberPlay.js';
import NumberPlayConstants from './NumberPlayConstants.js';

/**
 * NumberPlayQueryParameters defines query parameters that are specific to this simulation.
 *
 * @author Luisa Vargas
 */

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

  gameLevels: {
    public: true,
    type: 'array',
    elementSchema: {
      type: 'number',
      isValidValue: Number.isInteger
    },
    defaultValue: null,
    isValidValue: array => {
      return ( array === null ) || (
        array.length > 0 &&
        // unique level numbers
        array.length === _.uniq( array ).length &&
        // valid level numbers
        _.every( array, element => element > 0 && element <= NumberPlayConstants.NUMBER_OF_GAME_LEVELS )
      );
    }
  }

} );

numberPlay.register( 'NumberPlayQueryParameters', NumberPlayQueryParameters );
export default NumberPlayQueryParameters;