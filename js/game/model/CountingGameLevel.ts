// Copyright 2021-2023, University of Colorado Boulder

/**
 * CountingGameLevel is the class for a 'Counting' game level model.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import CountingArea from '../../../../number-suite-common/js/common/model/CountingArea.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevel from './NumberPlayGameLevel.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberPlayGameType from './NumberPlayGameType.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import Property from '../../../../axon/js/Property.js';

// constants
const LEVEL_INPUT_RANGE = 10;

class CountingGameLevel extends NumberPlayGameLevel {

  public readonly objectsCountingArea: CountingArea;

  // the object type of the current challenge
  public readonly countingObjectTypeProperty: EnumerationProperty<CountingObjectType>;

  // whether the current representation of the challengeNumber are objects or ten frames
  public readonly isObjectsRepresentationProperty: Property<boolean>;

  // whether objects should be able to be grouped
  public readonly groupObjectsAllowed: boolean;

  // whether grouping is enabled for a set of objects
  public readonly groupObjectsEnabledProperty: Property<boolean>;
  public readonly baseColorProperty = NumberPlayColors.countingGameColorProperty;

  public constructor( levelNumber: number ) {
    super( levelNumber, NumberPlayGameType.COUNTING, LEVEL_INPUT_RANGE );

    this.groupObjectsAllowed = ( levelNumber === 2 );

    this.groupObjectsEnabledProperty = new BooleanProperty( this.groupObjectsAllowed );

    this.objectsCountingArea = new CountingArea( this.challengeNumberProperty.range.max, this.groupObjectsEnabledProperty );

    this.countingObjectTypeProperty = new EnumerationProperty( CountingGameLevel.getRandomCountingObjectType() );

    this.isObjectsRepresentationProperty = new BooleanProperty( true );
  }

  public override reset(): void {
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
  public override newChallenge(): void {
    super.newChallenge();

    this.isObjectsRepresentationProperty.value = !this.isObjectsRepresentationProperty.value;

    // every time objects become the representation, if grouping objects is allowed, flip whether the object should
    // group or not.
    if ( this.isObjectsRepresentationProperty.value && this.groupObjectsAllowed ) {
      this.groupObjectsEnabledProperty.value = !this.groupObjectsEnabledProperty.value;
    }

    this.countingObjectTypeProperty.value = CountingGameLevel.getRandomCountingObjectType();
    this.objectsCountingArea.createAllObjects( this.challengeNumberProperty.value, this.groupObjectsEnabledProperty.value );
  }

  /**
   * Return a new object type for the current challenge.
   */
  private static getRandomCountingObjectType(): CountingObjectType {
    return dotRandom.sample( [ CountingObjectType.DOG, CountingObjectType.APPLE, CountingObjectType.BUTTERFLY,
      CountingObjectType.BALL ] );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'CountingGameLevel', CountingGameLevel );
export default CountingGameLevel;