// Copyright 2021-2023, University of Colorado Boulder

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
import TProperty from '../../../../axon/js/TProperty.js';
import TModel from '../../../../joist/js/TModel.js';

class NumberPlayGameModel implements TModel {

  public readonly subitizeLevels: SubitizeGameLevel[];
  public readonly countingLevels: CountingGameLevel[];
  public readonly levels: Array<NumberPlayGameLevel>;

  // the selected game level - null means 'no selection' so that the view returns to the level-selection UI
  public readonly levelProperty: TProperty<NumberPlayGameLevel | null>;

  public constructor( tandem: Tandem ) {

    // create the levels for each game
    this.countingLevels = [ new CountingGameLevel( 1 ), new CountingGameLevel( 2 ) ];
    this.subitizeLevels = [ new SubitizeGameLevel( 1 ), new SubitizeGameLevel( 2 ) ];
    this.levels = [ ...this.countingLevels, ...this.subitizeLevels ];

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

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

numberPlay.register( 'NumberPlayGameModel', NumberPlayGameModel );
export default NumberPlayGameModel;