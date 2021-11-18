// Copyright 2021, University of Colorado Boulder

/**
 * CardinalityGameLevel is the class for a 'Cardinality' game level model.
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

class CardinalityGameLevel extends NumberPlayGameLevel {

  public readonly objectsPlayArea: OnesPlayArea;
  public readonly playObjectTypeProperty: EnumerationProperty;
  public readonly isObjectsRepresentationProperty: BooleanProperty;

  constructor( levelNumber: number, minimumCountNumber: number, maximumCountNumber: number ) {
    super( levelNumber, minimumCountNumber, maximumCountNumber );

    this.objectsPlayArea = new OnesPlayArea( this.challengeNumberProperty, new Vector2( 0, 0 ), {
      isOnes: false,
      sumPropertyRange: new Range( 0, this.challengeNumberProperty.range!.max ),
      setAllObjects: true
    } );

    // @ts-ignore
    this.playObjectTypeProperty = new EnumerationProperty( PlayObjectType, CardinalityGameLevel.getRandomPlayObjectType() );
    this.isObjectsRepresentationProperty = new BooleanProperty( true );
  }

  private static getRandomPlayObjectType() {
    // @ts-ignore
    return PlayObjectType[ dotRandom.sample( PlayObjectType.KEYS ) ];
  }

  public reset() {
    super.reset();
    this.playObjectTypeProperty.reset();
    this.isObjectsRepresentationProperty.reset();
  }

  public step( dt: number ) {
  }

  /**
   * Sets up a new challenge for this level.
   */
  public newChallenge() {
    super.newChallenge();
    // @ts-ignore
    this.playObjectTypeProperty.value = CardinalityGameLevel.getRandomPlayObjectType();
    this.isObjectsRepresentationProperty.value = !this.isObjectsRepresentationProperty.value;
  }
}

numberPlay.register( 'CardinalityGameLevel', CardinalityGameLevel );
export default CardinalityGameLevel;