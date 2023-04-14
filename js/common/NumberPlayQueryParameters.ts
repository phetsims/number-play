// Copyright 2021-2023, University of Colorado Boulder

/**
 * NumberPlayQueryParameters defines query parameters that are specific to this simulation.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import getGameLevelsSchema from '../../../vegas/js/getGameLevelsSchema.js';
import numberPlay from '../numberPlay.js';
import NumberPlayConstants from './NumberPlayConstants.js';

const NumberPlayQueryParameters = QueryStringMachine.getAll( {

  // Time that the objects are shown when they “flash” in the ‘Subitize’ game, in seconds.
  subitizeTimeShown: {
    public: true,
    type: 'number',
    defaultValue: NumberPlayConstants.SHAPE_VISIBLE_TIME,
    isValidValue: ( number: number ) => number >= NumberPlayConstants.MIN_SHAPE_VISIBLE_TIME &&
                                        number < NumberPlayConstants.MAX_SHAPE_VISIBLE_TIME
  },

  // Chooses the game levels that you want to appear on the 'Game' screen.
  // Note that unlike some other PhET sims, higher level numbers are not necessarily more difficult.
  // The values correspond to the games as follows:
  // 1: Counting, Level 1
  // 2: Counting, Level 2
  // 3: Subitize, Level 1
  // 4: Subitize, Level 2
  gameLevels: getGameLevelsSchema( NumberPlayConstants.NUMBER_OF_LEVELS )
} );

numberPlay.register( 'NumberPlayQueryParameters', NumberPlayQueryParameters );
export default NumberPlayQueryParameters;