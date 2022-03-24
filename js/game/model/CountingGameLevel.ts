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
  public readonly groupObjectsAllowed: boolean;
  public readonly groupObjectsEnabledProperty: BooleanProperty;

  constructor( levelNumber: number ) {
    super( levelNumber, NumberPlayGameType.COUNTING, LEVEL_INPUT_RANGE );

    // whether objects should be able to be grouped
    this.groupObjectsAllowed = ( levelNumber === 2 );

    // whether grouping is enabled for a set of objects
    this.groupObjectsEnabledProperty = new BooleanProperty( this.groupObjectsAllowed );

    this.objectsPlayArea = new OnesPlayArea(
      this.challengeNumberProperty,
      this.groupObjectsEnabledProperty, {
        sumPropertyRange: new Range( 0, this.challengeNumberProperty.range!.max ),
        setAllObjects: true
      } );

    // the object type of the current challenge
    this.countingObjectTypeProperty = new EnumerationProperty( CountingGameLevel.getRandomCountingObjectType() );

    // whether the current representation of the challengeNumber are objects or ten frames
    this.isObjectsRepresentationProperty = new BooleanProperty( true );
  }

  public reset(): void {
    super.reset();
    this.isObjectsRepresentationProperty.reset();
    this.groupObjectsEnabledProperty.reset();

    // the CountingObjectType should not necessarily be reset to the same initial value that the screen loaded with, so
    // don't use traditional reset()
    this.countingObjectTypeProperty.value = CountingGameLevel.getRandomCountingObjectType();
  }

  /**
   * Sets up a new challenge for this level.
   */
  public newChallenge(): void {
    this.isObjectsRepresentationProperty.value = !this.isObjectsRepresentationProperty.value;

    // every time objects become the representation, if grouping objects is allowed, flip whether the object should
    // group or not. also do this before super.newChallenge() is called since the object positions are set when the
    // challenge number is set.
    if ( this.isObjectsRepresentationProperty.value && this.groupObjectsAllowed ) {
      this.groupObjectsEnabledProperty.value = !this.groupObjectsEnabledProperty.value;
    }

    super.newChallenge();
    this.countingObjectTypeProperty.value = CountingGameLevel.getRandomCountingObjectType();
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