// Copyright 2021, University of Colorado Boulder

/**
 * CountingGameLevel is the class for a 'Counting' game level model.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import OnesPlayArea from '../../common/model/OnesPlayArea.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevel from './NumberPlayGameLevel.js';
import Range from '../../../../dot/js/Range.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import PlayObjectType from '../../../../counting-common/js/common/model/PlayObjectType.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import numberPlayStrings from '../../numberPlayStrings.js';

// constants
const LEVEL_INPUT_RANGE = 10;

class CountingGameLevel extends NumberPlayGameLevel {

  public readonly objectsPlayArea: OnesPlayArea;
  public readonly playObjectTypeProperty: EnumerationProperty;
  public readonly isObjectsRepresentationProperty: BooleanProperty;
  public readonly groupObjects: boolean;

  constructor( levelNumber: number ) {
    super( levelNumber, numberPlayStrings.counting, LEVEL_INPUT_RANGE );

    // whether objects should be able to be grouped
    this.groupObjects = levelNumber === 2;

    this.objectsPlayArea = new OnesPlayArea( this.challengeNumberProperty, new Vector2( 0, 0 ), {
      isOnes: false,
      sumPropertyRange: new Range( 0, this.challengeNumberProperty.range!.max ),
      setAllObjects: true,
      setAllObjectsAsGrouped: this.groupObjects
    } );

    this.playObjectTypeProperty = new EnumerationProperty( PlayObjectType, CountingGameLevel.getRandomPlayObjectType() );
    this.isObjectsRepresentationProperty = new BooleanProperty( false );
  }

  /**
   * Return a new object type for the current challenge.
   * TODO-TS: Add return type when PlayObjectType is converted to a supported enumeration pattern.
   */
  private static getRandomPlayObjectType() {
    // @ts-ignore
    return PlayObjectType[ dotRandom.sample( PlayObjectType.KEYS ) ];
  }

  public reset(): void {
    super.reset();
    this.playObjectTypeProperty.reset();
    this.isObjectsRepresentationProperty.value = true;
  }

  public step( dt: number ): void {
  }

  /**
   * Sets up a new challenge for this level.
   */
  public newChallenge(): void {
    super.newChallenge();
    this.playObjectTypeProperty.value = CountingGameLevel.getRandomPlayObjectType();
    this.isObjectsRepresentationProperty.value = !this.isObjectsRepresentationProperty.value;
  }
}

numberPlay.register( 'CountingGameLevel', CountingGameLevel );
export default CountingGameLevel;