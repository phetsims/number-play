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
import CardinalityGameLevel from './CardinalityGameLevel.js';

class NumberPlayGameModel {

  public readonly subitizeLevels: SubitizeGameLevel[];
  public readonly cardinalityLevels: CardinalityGameLevel[];
  public readonly levels: Array<SubitizeGameLevel | CardinalityGameLevel>;
  public levelProperty: Property<SubitizeGameLevel | CardinalityGameLevel | null>

  constructor( tandem: Tandem ) {

    this.cardinalityLevels = [ new CardinalityGameLevel( 1, 1, 10 ), new CardinalityGameLevel( 2, 11, 20 ) ];
    this.subitizeLevels = [ new SubitizeGameLevel( 1, 1, 5 ), new SubitizeGameLevel( 2, 6, 10 ) ];
    this.levels = [ ...this.cardinalityLevels, ...this.subitizeLevels ];

    // the selected game level - null means 'no selection' and causes the view to return to the level-selection UI
    this.levelProperty = new Property<SubitizeGameLevel | CardinalityGameLevel | null>( null, {
      validValues: [ null, ...this.levels ]
    } );
  }

  public reset() {
    this.levels.forEach( level => level.reset() );
  }

  public step( dt: number ) {
    this.levels.forEach( level => level.step( dt ) );
  }
}

numberPlay.register( 'NumberPlayGameModel', NumberPlayGameModel );
export default NumberPlayGameModel;