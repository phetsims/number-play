// Copyright 2021, University of Colorado Boulder

import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevel from './NumberPlayGameLevel.js';

/**
 * CardinalityCountGameLevel is TODO
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */
class CardinalityCountGameLevel extends NumberPlayGameLevel {
  // public objectsPlayArea: OnesPlayArea;

  constructor( levelNumber: number, minimumCountNumber: number, maximumCountNumber: number ) {
    super( levelNumber, minimumCountNumber, maximumCountNumber );

    // @public (read-only) - the model for managing the play area in the ObjectsAccordionBox
    // this.objectsPlayArea = new OnesPlayArea( this.challengeNumberProperty, new Vector2( 0, 0 ), {
    //   isOnes: false
    // } );
  }

  public reset() {
    super.reset();
  }

  public step( dt: number ) {
  }

  public newChallenge() {
    super.newChallenge();
  }
}

numberPlay.register( 'CardinalityCountGameLevel', CardinalityCountGameLevel );
export default CardinalityCountGameLevel;