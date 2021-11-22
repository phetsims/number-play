// Copyright 2021, University of Colorado Boulder

/**
 * Model class for the 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import numberPlay from '../../numberPlay.js';
import SubitizeGameLevel from './SubitizeGameLevel.js';
import CountingGameLevel from './CountingGameLevel.js';
import NumberPlayQueryParameters from '../../common/NumberPlayQueryParameters.js';

class NumberPlayGameModel {

  public readonly subitizeLevels: SubitizeGameLevel[];
  public readonly countingLevels: CountingGameLevel[];
  public readonly levels: Array<SubitizeGameLevel | CountingGameLevel>;
  public readonly levelProperty: Property<SubitizeGameLevel | CountingGameLevel | null>

  constructor( tandem: Tandem ) {

    // get the level numbers specified by the gameLevels query parameter
    const gameALevelNumbers = NumberPlayGameModel.getLevelNumbers( NumberPlayQueryParameters.gameLevels, 'a' );
    const gameBLevelNumbers = NumberPlayGameModel.getLevelNumbers( NumberPlayQueryParameters.gameLevels, 'b' );

    // create the levels for each game
    this.countingLevels = gameALevelNumbers.map( gameALevelNumber => new CountingGameLevel( gameALevelNumber ) );
    this.subitizeLevels = gameBLevelNumbers.map( gameBLevelNumber => new SubitizeGameLevel( gameBLevelNumber ) );
    this.levels = [ ...this.countingLevels, ...this.subitizeLevels ];

    // the selected game level - null means 'no selection' and causes the view to return to the level-selection UI
    this.levelProperty = new Property<SubitizeGameLevel | CountingGameLevel | null>( null, {
      validValues: [ null, ...this.levels ]
    } );
  }

  public reset() {
    this.levels.forEach( level => level.reset() );
  }

  public step( dt: number ) {
    this.levels.forEach( level => level.step( dt ) );
  }

  /**
   * Returns the level number for each level code that matches the provided level letter by extracting the level
   * numbers from the level codes.
   *
   * @param levelCodes - the array of two-character codes that represent game levels
   * @param levelLetter - the letter that indicates which level codes should be kept and turned into numbers
   */
  private static getLevelNumbers( levelCodes: string[], levelLetter: string ): number[] {
    return levelCodes.filter( string => string.includes( levelLetter ) ).map( levelName =>
      parseInt( levelName.replace( levelLetter, '' ) ) // eslint-disable-line
    );
  }
}

numberPlay.register( 'NumberPlayGameModel', NumberPlayGameModel );
export default NumberPlayGameModel;