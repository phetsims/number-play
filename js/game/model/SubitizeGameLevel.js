// Copyright 2021, University of Colorado Boulder

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayGameLevel from './NumberPlayGameLevel.js';
import SubitizerModel from './SubitizerModel.js';
import Range from '../../../../dot/js/Range.js';

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
    this.subitizeNumberProperty = new NumberProperty( this.getNextSubitizeNumber(), {
      range: this.subitizeRange
    } );

    // @public (read-only) {SubitizerModel}
    this.subitizerModel = new SubitizerModel( this.subitizeNumberProperty, levelNumber === 1 );

    // @public Fires when the level is reset
    this.newSubitizeNumberEmitter = new Emitter();
  }

  /**
   * @public
   */
  reset() {
    super.reset();
    this.newSubitizeNumberEmitter.emit();
  }

  /**
   * @param {number} dt
   * @public
   */
  step( dt ) {
    this.subitizerModel.step( dt );
  }

  /**
   * @returns {number}
   * @public
   */
  getNextSubitizeNumber() {
    return dotRandom.nextIntBetween( this.subitizeRange.min, this.subitizeRange.max );
  }
}

numberPlay.register( 'SubitizeGameLevel', SubitizeGameLevel );
export default SubitizeGameLevel;