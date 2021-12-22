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
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';

// constants
const LEVEL_INPUT_RANGE = 10;

class CountingGameLevel extends NumberPlayGameLevel {

  public readonly objectsPlayArea: OnesPlayArea;
  private readonly _playObjectTypeProperty: EnumerationProperty;
  public readonly playObjectTypeProperty: IReadOnlyProperty<Enumeration>;
  private readonly _isObjectsRepresentationProperty: BooleanProperty;
  public readonly isObjectsRepresentationProperty: IReadOnlyProperty<boolean>;
  public readonly groupObjects: boolean;

  constructor( levelNumber: number ) {
    super( levelNumber, 'counting', LEVEL_INPUT_RANGE );

    // whether objects should be able to be grouped
    this.groupObjects = ( levelNumber === 2 );

    this.objectsPlayArea = new OnesPlayArea( this.challengeNumberProperty, new Vector2( 0, 0 ), {
      isOnes: false,
      sumPropertyRange: new Range( 0, this.challengeNumberProperty.range!.max ),
      setAllObjects: true,
      setAllObjectsAsGrouped: this.groupObjects
    } );

    // the object type of the current challenge
    // TODO-TS: Use updated enumeration pattern for Property when PlayObjectType is converted. See https://github.com/phetsims/number-play/issues/80
    this._playObjectTypeProperty = new EnumerationProperty( PlayObjectType, CountingGameLevel.getRandomPlayObjectType() );
    this.playObjectTypeProperty = this._playObjectTypeProperty;

    // whether the current representation of the challengeNumber are objects. Always use objects as the first representation
    // of the current challenge
    this._isObjectsRepresentationProperty = new BooleanProperty( true );
    this.isObjectsRepresentationProperty = this._isObjectsRepresentationProperty;
  }

  /**
   * Return a new object type for the current challenge.
   * TODO-TS: Add return type when PlayObjectType is converted to a supported enumeration pattern. See https://github.com/phetsims/number-play/issues/80
   */
  private static getRandomPlayObjectType() {
    // @ts-ignore
    return PlayObjectType[ dotRandom.sample( PlayObjectType.KEYS ) ];
  }

  public reset(): void {
    super.reset();
    this._playObjectTypeProperty.reset();
    this._isObjectsRepresentationProperty.reset();
  }

  /**
   * Sets up a new challenge for this level.
   */
  public newChallenge(): void {
    super.newChallenge();
    this._playObjectTypeProperty.value = CountingGameLevel.getRandomPlayObjectType();
    this._isObjectsRepresentationProperty.value = !this._isObjectsRepresentationProperty.value;
  }
}

numberPlay.register( 'CountingGameLevel', CountingGameLevel );
export default CountingGameLevel;