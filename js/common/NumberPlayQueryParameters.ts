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

  // the highest number that the 'Compare' screen can count to. Must be an integer between 1 and 20.
  compareMax: {
    public: true,
    type: 'number',
    defaultValue: NumberPlayConstants.TWENTY,
    isValidValue: ( number: number ) => Number.isInteger( number ) && number > 0 && number <= NumberPlayConstants.TWENTY
  },

  // time that the objects are shown when they “flash” in the ‘Subitize’ game, in seconds. If the user gets the answer
  // incorrect 3 times on a single challenge, the time is increased for that challenge until it's answered correctly.
  subitizeTimeShown: {
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

  // whether the current number on the 'Ten' and 'Twenty' screens or the compare statement on the 'Compare' screen
  // should be read out loud whenever their value changes
  readAloud: {
    public: true,
    type: 'flag'
  },

  // specifies a second locale to make available on the 'Ten', 'Twenty', and 'Compare' screens. Values are specified
  // with a locale code, e.g. 'en'.
  secondLocale: {
    public: true,
    type: 'string',
    defaultValue: null
  },

  // whether the paper ones are visible on the 'Lab' screen
  showLabOnes: {
    public: true,
    type: 'flag'
  }
} );

numberPlay.register( 'NumberPlayQueryParameters', NumberPlayQueryParameters );
export default NumberPlayQueryParameters;