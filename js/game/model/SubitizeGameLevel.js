// Copyright 2021, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayGameLevel from './NumberPlayGameLevel.js';
import Subitizer from './Subitizer.js';

class SubitizeGameLevel extends NumberPlayGameLevel {

  /**
   * @param {number} levelNumber
   * @param {number} minimumSubitizeNumber - minimum number to create a subitized representation for
   * @param {number} maximumSubitizeNumber - maximum number to create a subitized representation for
   */
  constructor( levelNumber, minimumSubitizeNumber, maximumSubitizeNumber ) {
    super( levelNumber );

    // @public (read-only) {string} - message shown in the status bar that appears at the top of each level
    this.statusBarMessage = StringUtils.fillIn( numberPlayStrings.level, {
      levelNumber: levelNumber
    } );

    // @public (read-only) {StringProperty}
    this.questionStringProperty = new StringProperty( numberPlayStrings.howManyDots );

    // @public (read-only) {Range} - the range of the subitize number representation for this level
    this.subitizeRange = new Range( minimumSubitizeNumber, maximumSubitizeNumber );

    // @public {NumberProperty} - the random number generated to create a subitized representation for
    this.subitizeNumberProperty = new NumberProperty( this.getNewSubitizeNumber(), {
      range: this.subitizeRange
    } );

    // @private - used to store old subitizeNumber values. this.oldSubitizeNumberOne tracks the most recent value of
    // this.subitizeNumberProperty, and this.oldSubitizeNumberTwo tracks the value used before that.
    this.oldSubitizeNumberOne = this.subitizeNumberProperty.value;
    this.oldSubitizeNumberTwo = this.subitizeNumberProperty.value;

    // @public {NumberProperty} number of times any wrong answer button in answerButtons was pressed
    this.numberOfAnswerButtonPressesProperty = new NumberProperty( 0, { numberType: 'Integer' } );

    // @public (read-only) {Subitizer}
    this.subitizer = new Subitizer( this.subitizeNumberProperty, this.numberOfAnswerButtonPressesProperty, levelNumber === 1 );

    // @public {BooleanProperty} - whether the play button is visible
    this.playButtonVisibleProperty = new BooleanProperty( true );
  }

  /**
   * Shows the start sequence if the current challenge is unsolved.
   * @public
   */
  resetStartSequence() {
    if ( !this.isSolvedProperty.value ) {
      this.playButtonVisibleProperty.reset();
      this.subitizer.isPlayingProperty.reset();
    }
  }

  /**
   * Sets up a new challenge for this level.
   * @public
   */
  newChallenge() {
    this.isSolvedProperty.reset();
    this.setNewSubitizeNumber();
    this.subitizer.setNewCoordinates();
    this.subitizer.isPlayingProperty.value = true;
    this.subitizer.visibleProperty.value = true;
    this.numberOfAnswerButtonPressesProperty.reset();
  }

  /**
   * @public
   */
  reset() {
    super.reset();
    this.subitizer.reset();
    this.playButtonVisibleProperty.reset();
  }

  /**
   * @param {number} dt
   * @public
   */
  step( dt ) {
    this.subitizer.step( dt );
  }


  /**
   * Sets a new subitize number. Can be the value of the previous subitize number, but there cannot be three of the same
   * number in a row.
   *
   * @public
   */
  setNewSubitizeNumber() {
    assert && assert( this.subitizeRange.min !== this.subitizeRange.max,
      `subitizeRange must contain more than one number: ${this.subitizeRange.toString()}` );

    // shift values down to make room for a new subitize number
    this.oldSubitizeNumberTwo = this.oldSubitizeNumberOne;
    this.oldSubitizeNumberOne = this.subitizeNumberProperty.value;

    let newSubitizeNumber = this.getNewSubitizeNumber();
    while ( newSubitizeNumber === this.oldSubitizeNumberOne && newSubitizeNumber === this.oldSubitizeNumberTwo ) {
      newSubitizeNumber = this.getNewSubitizeNumber();
    }
    this.subitizeNumberProperty.value = newSubitizeNumber;
  }

  /**
   * @returns {number}
   * @private
   */
  getNewSubitizeNumber() {
    return dotRandom.nextIntBetween( this.subitizeRange.min, this.subitizeRange.max );
  }
}

numberPlay.register( 'SubitizeGameLevel', SubitizeGameLevel );
export default SubitizeGameLevel;