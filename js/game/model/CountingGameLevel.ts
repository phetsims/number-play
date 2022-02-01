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
import PlayObjectType from '../../../../counting-common/js/common/model/PlayObjectType.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberPlayGameType from './NumberPlayGameType.js';

// constants
const LEVEL_INPUT_RANGE = 10;

class CountingGameLevel extends NumberPlayGameLevel {

  public readonly objectsPlayArea: OnesPlayArea;
  private readonly _playObjectTypeProperty: EnumerationProperty<PlayObjectType>;
  public readonly playObjectTypeProperty: IReadOnlyProperty<PlayObjectType>;
  private readonly _isObjectsRepresentationProperty: BooleanProperty;
  public readonly isObjectsRepresentationProperty: IReadOnlyProperty<boolean>;
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
    this._playObjectTypeProperty = new EnumerationProperty( CountingGameLevel.getRandomPlayObjectType() );
    this.playObjectTypeProperty = this._playObjectTypeProperty;

    // whether the current representation of the challengeNumber are objects. Always use objects as the first representation
    // of the current challenge
    this._isObjectsRepresentationProperty = new BooleanProperty( true );
    this.isObjectsRepresentationProperty = this._isObjectsRepresentationProperty;
  }

  /**
   * @param dt - in seconds
   */
  public step( dt: number ): void {
    this.objectsPlayArea.step( dt );
  }

  public reset(): void {
    super.reset();
    this._isObjectsRepresentationProperty.reset();

    // the playObjectType should not necessarily be reset to the same initial value that the screen loaded with, so
    // don't use traditional reset()
    this._playObjectTypeProperty.value = CountingGameLevel.getRandomPlayObjectType();
  }

  /**
   * Sets up a new challenge for this level.
   */
  public newChallenge(): void {
    super.newChallenge();
    this._playObjectTypeProperty.value = CountingGameLevel.getRandomPlayObjectType();
    this._isObjectsRepresentationProperty.value = !this._isObjectsRepresentationProperty.value;
  }

  /**
   * Return a new object type for the current challenge.
   */
  private static getRandomPlayObjectType(): PlayObjectType {
    return dotRandom.sample( PlayObjectType.enumeration.values.slice() );
  }
}

numberPlay.register( 'CountingGameLevel', CountingGameLevel );
export default CountingGameLevel;