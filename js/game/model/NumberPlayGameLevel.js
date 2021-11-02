// Copyright 2021, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import numberPlay from '../../numberPlay.js';

/**
 * NumberPlayGameLevel is the model for a game level which each type of game will extend.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

class NumberPlayGameLevel {

  /**
   * @param {number} levelNumber
   */
  constructor( levelNumber ) {

    // @public (read-only) {number}
    this.levelNumber = levelNumber;

    // @public - the total number of points that have been awarded for this level
    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 )
    } );

    // @public {BooleanProperty} - Whether the current challenge has been solved. A challenge is considered solved when
    // the user has correctly guessed the answer
    this.isSolvedProperty = new BooleanProperty( false );
  }

  /**
   * @public
   */
  reset() {
    this.isSolvedProperty.reset();
    this.scoreProperty.reset();
  }
}

numberPlay.register( 'NumberPlayGameLevel', NumberPlayGameLevel );
export default NumberPlayGameLevel;