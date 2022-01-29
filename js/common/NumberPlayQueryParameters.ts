// Copyright 2021-2022, University of Colorado Boulder

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

  // time that the objects are shown when they “flash” in the ‘Subitize’ game, in seconds. If the user gets the answer
  // incorrect 3 times on a single challenge, the time is increased for that challenge until it's answered correctly.
  subitizerTimeVisible: {
    public: true,
    type: 'number',
    defaultValue: NumberPlayConstants.SHAPE_VISIBLE_TIME
  },

  // Chooses the game levels that you want to appear on the 'Game' screen.
  // Note that unlike some other PhET sims, higher level numbers are not necessarily more difficult.
  // The values correspond to the games as follows:
  // 1: Counting, Level 1
  // 2: Counting, Level 2
  // 3: Subitize, Level 1
  // 4: Subitize, Level 2
  gameLevels: getGameLevelsSchema( 4 ),

  // whether the current number should be read out loud whenever it changes
  countAloud: {
    public: true,
    type: 'flag'
  },

  // specifies a second locale to make available on the 'Ten', 'Twenty', and 'Compare' screens. Values are specified
  // with a locale code, e.g. 'en'.
  secondLocale: {
    public: true,
    type: 'string',
    defaultValue: null
  }
} );

numberPlay.register( 'NumberPlayQueryParameters', NumberPlayQueryParameters );
export default NumberPlayQueryParameters;