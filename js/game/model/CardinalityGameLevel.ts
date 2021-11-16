// Copyright 2021, University of Colorado Boulder

/**
 * CardinalityGameLevel is TODO
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
  playObjectTypeProperty: EnumerationProperty;
  isTenFrameProperty: BooleanProperty;

  constructor( levelNumber: number, minimumCountNumber: number, maximumCountNumber: number ) {
    super( levelNumber, minimumCountNumber, maximumCountNumber );

    this.objectsPlayArea = new OnesPlayArea( this.challengeNumberProperty, new Vector2( 0, 0 ), {
      isOnes: false,
      sumPropertyRange: new Range( 0, this.challengeNumberProperty.range!.max ),
      setAllObjects: true
    } );
    this.objectsPlayArea.createAllObjects();

    // @ts-ignore
    this.playObjectTypeProperty = new EnumerationProperty( PlayObjectType, PlayObjectType.DOG );
    this.isTenFrameProperty = new BooleanProperty( dotRandom.nextBoolean() );
  }

  public reset() {
    super.reset();
    this.playObjectTypeProperty.reset();
    this.isTenFrameProperty.reset();
  }

  public step( dt: number ) {
  }

  /**
   * Sets up a new challenge for this level.
   */
  public newChallenge() {
    super.newChallenge();
    this.objectsPlayArea.createAllObjects();
    // @ts-ignore
    this.playObjectTypeProperty.value = PlayObjectType[ dotRandom.sample( PlayObjectType.KEYS ) ];
    this.isTenFrameProperty.value = dotRandom.nextBoolean();
  }
}

numberPlay.register( 'CardinalityGameLevel', CardinalityGameLevel );
export default CardinalityGameLevel;