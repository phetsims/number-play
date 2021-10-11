// Copyright 2021, University of Colorado Boulder

/**
 * Model class for the 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Property from '../../../../axon/js/Property.js';
import numberPlay from '../../numberPlay.js';
import SubitizeGameLevel from './SubitizeGameLevel.js';

class NumberPlayGameModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // @public {SubitizeGameLevel[]}
    this.levels = [ new SubitizeGameLevel( 1 ), new SubitizeGameLevel( 2 ) ];

    // @public {Property.<null|SubitizeGameLevel>} - the selected game level
    // null means 'no selection' and causes the view to return to the level-selection UI
    this.levelProperty = new Property( null, {
      validValues: [ null, ...this.levels ]
    } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.levels.forEach( level => level.reset() );
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
  }
}

numberPlay.register( 'NumberPlayGameModel', NumberPlayGameModel );
export default NumberPlayGameModel;