// Copyright 2021-2022, University of Colorado Boulder

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
import NumberPlayGameLevel from './NumberPlayGameLevel.js';

class NumberPlayGameModel {

  public readonly subitizeLevels: SubitizeGameLevel[];
  public readonly countingLevels: CountingGameLevel[];
  public readonly levels: Array<NumberPlayGameLevel>;
  public readonly levelProperty: Property<NumberPlayGameLevel| null>;

  constructor( tandem: Tandem ) {

    // create the levels for each game
    this.countingLevels = [ new CountingGameLevel( 1 ), new CountingGameLevel( 2 ) ];
    this.subitizeLevels = [ new SubitizeGameLevel( 1 ), new SubitizeGameLevel( 2 ) ];
    this.levels = [ ...this.countingLevels, ...this.subitizeLevels ];

    // the selected game level - null means 'no selection' so that the view returns to the level-selection UI
    this.levelProperty = new Property<NumberPlayGameLevel | null>( null, {
      validValues: [ null, ...this.levels ]
    } );
  }

  public reset(): void {
    this.levels.forEach( level => level.reset() );
  }

  /**
   * @param dt - in seconds
   */
  public step( dt: number ): void {
    this.levels.forEach( level => level.step( dt ) );
  }
}

numberPlay.register( 'NumberPlayGameModel', NumberPlayGameModel );
export default NumberPlayGameModel;