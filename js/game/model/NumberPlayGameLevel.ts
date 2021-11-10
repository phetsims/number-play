// Copyright 2021, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import numberPlay from '../../numberPlay.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import Range from '../../../../dot/js/Range.js';
import dotRandom from '../../../../dot/js/dotRandom.js';

/**
 * NumberPlayGameLevel is the model for a game level which each type of game will extend.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

abstract class NumberPlayGameLevel {

  public levelNumber: number;
  public statusBarMessage: string;
  public scoreProperty: NumberProperty;
  public isSolvedProperty: BooleanProperty;
  public challengeRange: Range;
  public challengeNumberProperty: NumberProperty;
  private oldChallengeNumberOne: number;
  private oldChallengeNumberTwo: number;
  public numberOfAnswerButtonPressesProperty: NumberProperty;

  /**
   * @param {number} levelNumber
   * @param {number} minimumCountNumber
   * @param {number} maximumCountNumber
   */
  constructor( levelNumber: number, minimumChallengeNumber: number, maximumChallengeNumber: number ) {

    // @public (read-only) {number}
    this.levelNumber = levelNumber;

    // @public (read-only) {string} - message shown in the status bar that appears at the top of each level
    this.statusBarMessage = StringUtils.fillIn( numberPlayStrings.level, {
      levelNumber: levelNumber
    } );

    // @public - the total number of points that have been awarded for this level
    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: ( value: number ) => ( value >= 0 )
    } );

    // @public {BooleanProperty} - Whether the current challenge has been solved. A challenge is considered solved when
    // the user has correctly guessed the answer
    this.isSolvedProperty = new BooleanProperty( false );

    // @public (read-only) {Range} - the range of numbers used for all challenges of this level
    this.challengeRange = new Range( minimumChallengeNumber, maximumChallengeNumber );

    // @public {NumberProperty} - the random number generated to create a subitized representation for
    this.challengeNumberProperty = new NumberProperty( this.getNewChallengeNumber(), {
      range: this.challengeRange
    } );

    // @private - used to store old challengeNumber values. this.oldChallengeNumberOne tracks the most recent value of
    // this.challengeNumberProperty, and this.oldChallengeNumberTwo tracks the value used before that.
    this.oldChallengeNumberOne = this.challengeNumberProperty.value;
    this.oldChallengeNumberTwo = this.challengeNumberProperty.value;

    // @public {NumberProperty} - the number of times any wrong answer button in answerButtons was pressed
    this.numberOfAnswerButtonPressesProperty = new NumberProperty( 0, { numberType: 'Integer' } );
  }

  protected reset() {
    this.isSolvedProperty.reset();
    this.scoreProperty.reset();
  }

  public newChallenge() { // TODO-TS: why can't this be protected if i only want sub-class implementations to be protected?
    this.isSolvedProperty.reset();
    this.setNewChallengeNumber();
    this.numberOfAnswerButtonPressesProperty.reset();
  }

  /**
   * Sets a new challenge number. Can be the value of the previous challenge number, but there cannot be three of the
   * same number in a row.
   */
  protected setNewChallengeNumber() {
    assert && assert( this.challengeRange.min !== this.challengeRange.max,
      `challengeRange must contain more than one number: ${this.challengeRange.toString()}` );

    // shift values down to make room for a new subitize number
    this.oldChallengeNumberTwo = this.oldChallengeNumberOne;
    this.oldChallengeNumberOne = this.challengeNumberProperty.value;

    let newSubitizeNumber = this.getNewChallengeNumber();
    while ( newSubitizeNumber === this.oldChallengeNumberOne && newSubitizeNumber === this.oldChallengeNumberTwo ) {
      newSubitizeNumber = this.getNewChallengeNumber();
    }
    this.challengeNumberProperty.value = newSubitizeNumber;
  }

  /**
   * @returns {number}
   */
  private getNewChallengeNumber() {
    return dotRandom.nextIntBetween( this.challengeRange.min, this.challengeRange.max );
  }
}

numberPlay.register( 'NumberPlayGameLevel', NumberPlayGameLevel );
export default NumberPlayGameLevel;