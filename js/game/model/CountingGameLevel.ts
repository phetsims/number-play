// Copyright 2021-2022, University of Colorado Boulder

/**
 * CountingGameLevel is the class for a 'Counting' game level model.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import OnesPlayArea from '../../common/model/OnesPlayArea.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevel from './NumberPlayGameLevel.js';
import Range from '../../../../dot/js/Range.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberPlayGameType from './NumberPlayGameType.js';

// constants
const LEVEL_INPUT_RANGE = 10;

class CountingGameLevel extends NumberPlayGameLevel {

  public readonly objectsPlayArea: OnesPlayArea;
  public readonly countingObjectTypeProperty: EnumerationProperty<CountingObjectType>;
  public readonly isObjectsRepresentationProperty: BooleanProperty;
  public readonly groupObjects: boolean;

  constructor( levelNumber: number ) {
    super( levelNumber, NumberPlayGameType.COUNTING, LEVEL_INPUT_RANGE );

    // whether objects should be able to be grouped
    this.groupObjects = ( levelNumber === 2 );

    this.objectsPlayArea = new OnesPlayArea(
      this.challengeNumberProperty,
      new BooleanProperty( this.groupObjects ), {
        sumPropertyRange: new Range( 0, this.challengeNumberProperty.range!.max ),
        setAllObjects: true
      } );

    // the object type of the current challenge
    this.countingObjectTypeProperty = new EnumerationProperty( CountingGameLevel.getRandomCountingObjectType() );

    // whether the current representation of the challengeNumber are objects. Always use objects as the first representation
    // of the current challenge
    this.isObjectsRepresentationProperty = new BooleanProperty( true );
  }

  /**
   * @param dt - in seconds
   */
  public step( dt: number ): void {
    this.objectsPlayArea.step( dt );
  }

  public reset(): void {
    super.reset();
    this.isObjectsRepresentationProperty.reset();

    // the CountingObjectType should not necessarily be reset to the same initial value that the screen loaded with, so
    // don't use traditional reset()
    this.countingObjectTypeProperty.value = CountingGameLevel.getRandomCountingObjectType();
  }

  /**
   * Sets up a new challenge for this level.
   */
  public newChallenge(): void {
    super.newChallenge();
    this.countingObjectTypeProperty.value = CountingGameLevel.getRandomCountingObjectType();
    this.isObjectsRepresentationProperty.value = !this.isObjectsRepresentationProperty.value;
  }

  /**
   * Return a new object type for the current challenge.
   */
  private static getRandomCountingObjectType(): CountingObjectType {
    return dotRandom.sample( [ CountingObjectType.DOG, CountingObjectType.APPLE, CountingObjectType.BUTTERFLY,
      CountingObjectType.BALL ] );
  }
}

numberPlay.register( 'CountingGameLevel', CountingGameLevel );
export default CountingGameLevel;