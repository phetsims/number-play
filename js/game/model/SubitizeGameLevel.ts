// Copyright 2021, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayGameLevel from './NumberPlayGameLevel.js';
import Subitizer from './Subitizer.js';

class SubitizeGameLevel extends NumberPlayGameLevel {

  public questionStringProperty: StringProperty;
  public subitizer: Subitizer;
  public playButtonVisibleProperty: BooleanProperty;
  public startSequencePlayingProperty: BooleanProperty;

  /**
   * @param {number} levelNumber
   * @param {number} minimumSubitizeNumber - minimum number to create a subitized representation for
   * @param {number} maximumSubitizeNumber - maximum number to create a subitized representation for
   */
  constructor( levelNumber: number, minimumSubitizeNumber: number, maximumSubitizeNumber: number ) {
    super( levelNumber, minimumSubitizeNumber, maximumSubitizeNumber );

    // @public (read-only) {StringProperty}
    this.questionStringProperty = new StringProperty( numberPlayStrings.howManyDots );

    // @public (read-only) {Subitizer}
    this.subitizer = new Subitizer( this.challengeNumberProperty, this.numberOfAnswerButtonPressesProperty, levelNumber === 1 );

    // @public {BooleanProperty} - whether the play button is visible
    this.playButtonVisibleProperty = new BooleanProperty( true );

    // @public {BooleanProperty} - whether the start sequence is playing. This can also be used to stop an existing animation
    this.startSequencePlayingProperty = new BooleanProperty( false );
  }

  /**
   * Shows the start sequence if the current challenge is unsolved.
   */
  public resetStartSequence() {
    if ( !this.isSolvedProperty.value ) {
      this.startSequencePlayingProperty.reset();
      this.playButtonVisibleProperty.reset();
      this.subitizer.isPlayingProperty.reset();
    }
  }

  /**
   * Sets up a new challenge for this level.
   */
  public newChallenge() {
    this.isSolvedProperty.reset();
    this.setNewChallengeNumber();
    this.subitizer.setNewCoordinates();
    this.subitizer.isPlayingProperty.value = true;
    this.subitizer.visibleProperty.value = true;
    this.numberOfAnswerButtonPressesProperty.reset();
  }

  public reset() {
    super.reset();
    this.subitizer.reset();
    this.playButtonVisibleProperty.reset();
  }

  /**
   * @param {number} dt
   */
  public step( dt: number ) {
    this.subitizer.step( dt );
  }
}

numberPlay.register( 'SubitizeGameLevel', SubitizeGameLevel );
export default SubitizeGameLevel;