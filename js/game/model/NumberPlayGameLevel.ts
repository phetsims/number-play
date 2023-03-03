// Copyright 2021-2023, University of Colorado Boulder

/**
 * NumberPlayGameLevel is the model for a game level which each type of game will extend.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import numberPlay from '../../numberPlay.js';
import Range from '../../../../dot/js/Range.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import NumberPlayGameType from './NumberPlayGameType.js';
import { TColor } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';

abstract class NumberPlayGameLevel {

  public readonly levelNumber: number;
  public static readonly REWARD_SCORE = 10;

  // the total number of points that have been awarded for this level
  public readonly scoreProperty: Property<number>;

  // whether the current challenge has been solved. A challenge is considered solved when the user has correctly
  // guessed the answer
  public readonly isChallengeSolvedProperty: Property<boolean>;

  // the range of numbers used for all challenges of this level
  public readonly challengeRange: Range;

  // the random number generated to create a representation for
  public readonly challengeNumberProperty: NumberProperty;

  // used to store old challenge number values. this.oldChallengeNumberOne tracks the most recent value of
  // this.challengeNumberProperty, and this.oldChallengeNumberTwo tracks the value used before that.
  private oldChallengeNumberOne: number;
  private oldChallengeNumberTwo: number;

  // the number of times any wrong answer button in answerButtons was pressed
  public readonly numberOfAnswerButtonPressesProperty: Property<number>;
  public readonly gameType: NumberPlayGameType;
  public abstract readonly baseColorProperty: TColor;

  /**
   * @param levelNumber
   * @param gameType
   * @param levelChallengeRange - the range of challenge numbers for a level, where 'range' is referring to a
   * mathematical range, where the min and max values are unknown, so it is just a number
   */
  protected constructor( levelNumber: number, gameType: NumberPlayGameType, levelChallengeRange: number ) {

    this.levelNumber = levelNumber;
    this.gameType = gameType;

    this.challengeRange = NumberPlayGameLevel.getChallengeRange( levelNumber, levelChallengeRange );

    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: ( value: number ) => ( value >= 0 )
    } );

    this.isChallengeSolvedProperty = new BooleanProperty( false );

    this.challengeNumberProperty = new NumberProperty( this.getRandomChallengeNumber(), {
      numberType: 'Integer',
      range: this.challengeRange
    } );

    this.oldChallengeNumberOne = this.challengeNumberProperty.value;
    this.oldChallengeNumberTwo = this.challengeNumberProperty.value;

    this.numberOfAnswerButtonPressesProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: ( value: number ) => ( value >= 0 )
    } );
  }

  public reset(): void {
    this.scoreProperty.reset();
    this.isChallengeSolvedProperty.reset();
    this.numberOfAnswerButtonPressesProperty.reset();

    // the challengeNumber should not necessarily be reset to the same initial number that the screen loaded with,
    // so don't use traditional reset()
    this.challengeNumberProperty.value = this.getRandomChallengeNumber();
  }

  /**
   * @param dt - in seconds
   */
  public step( dt: number ): void {
    // See subclass for implementation
  }

  /**
   * Sets up a new challenge for this level.
   */
  public newChallenge(): void {
    this.isChallengeSolvedProperty.value = false;
    this.setRandomChallengeNumber();
    this.numberOfAnswerButtonPressesProperty.reset();
  }

  /**
   * Sets a new challenge number. Can be the value of the previous challenge number, but there cannot be three of the
   * same number in a row.
   */
  private setRandomChallengeNumber(): void {
    assert && assert( this.challengeRange.min !== this.challengeRange.max,
      `challengeRange must contain more than one number: ${this.challengeRange.toString()}` );

    // shift values down to make room for a new challenge number
    this.oldChallengeNumberTwo = this.oldChallengeNumberOne;
    this.oldChallengeNumberOne = this.challengeNumberProperty.value;

    let newChallengeNumber = this.getRandomChallengeNumber();
    while ( ( newChallengeNumber === this.oldChallengeNumberOne ) && ( newChallengeNumber === this.oldChallengeNumberTwo ) ) {
      newChallengeNumber = this.getRandomChallengeNumber();
    }
    this.challengeNumberProperty.value = newChallengeNumber;
  }

  /**
   * Generate a random challenge number that is in the defined challenge range.
   */
  private getRandomChallengeNumber(): number {
    return dotRandom.nextIntBetween( this.challengeRange.min, this.challengeRange.max );
  }

  /**
   * Calculates the range of the challenge numbers for the given level number and input range. This is converting
   * levelChallengeRange, a mathematical range (see parameter doc of this class), to a Range type, which includes min
   * and max values.
   *
   * Examples:
   * 1, 10 => 1, 10
   * 2, 10 => 11, 20
   * 1, 5 => 1, 5
   * 2, 5 => 6, 10
   */
  private static getChallengeRange( levelNumber: number, levelChallengeRange: number ): Range {
    const minimumChallengeNumber = ( levelNumber - 1 ) * levelChallengeRange + 1;
    const maximumChallengeNumber = levelNumber * levelChallengeRange;
    return new Range( minimumChallengeNumber, maximumChallengeNumber );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

numberPlay.register( 'NumberPlayGameLevel', NumberPlayGameLevel );
export default NumberPlayGameLevel;