// Copyright 2021-2023, University of Colorado Boulder

/**
 * SubitizeGameLevel is the class for a 'Subitize' game level model.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevel from './NumberPlayGameLevel.js';
import Subitizer from './Subitizer.js';
import NumberPlayGameType from './NumberPlayGameType.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';

// constants
const LEVEL_INPUT_RANGE = 5;

class SubitizeGameLevel extends NumberPlayGameLevel {

  public readonly subitizer: Subitizer;
  public readonly baseColorProperty = NumberPlayColors.subitizeGameColorProperty;

  public constructor( levelNumber: number ) {
    super( levelNumber, NumberPlayGameType.SUBITIZE, LEVEL_INPUT_RANGE );

    this.subitizer = new Subitizer(
      this.challengeNumberProperty,
      this.isChallengeSolvedProperty,
      this.numberOfAnswerButtonPressesProperty,
      levelNumber === 1
    );
  }

  /**
   * Sets up a new challenge for this level.
   */
  public override newChallenge(): void {
    super.newChallenge();
    this.subitizer.newChallenge();
  }

  /**
   * @param dt - in seconds
   */
  public override step( dt: number ): void {
    super.step( dt );
    this.subitizer.step( dt );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'SubitizeGameLevel', SubitizeGameLevel );
export default SubitizeGameLevel;