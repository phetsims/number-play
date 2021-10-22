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

class SubitizeGameLevel extends NumberPlayGameLevel {

  /**
   * @param {number} levelNumber
   */
  constructor( levelNumber ) {
    super( levelNumber );

    // @public (read-only) {string} - message shown in the status bar that appears at the top of each level
    this.statusBarMessage = StringUtils.fillIn( numberPlayStrings.level, {
      levelNumber: levelNumber
    } );

    // @public (read-only) {StringProperty}
    this.questionStringProperty = new StringProperty( numberPlayStrings.howManyDots );

    // @public {NumberProperty} - the random number generated to create a subitized representation for
    this.subitizeNumberProperty = new NumberProperty( dotRandom.nextIntBetween( 1, 5 ) );

    // @public (read-only) {SubitizerModel}
    this.subitizerModel = new SubitizerModel( this.subitizeNumberProperty );

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
}

numberPlay.register( 'SubitizeGameLevel', SubitizeGameLevel );
export default SubitizeGameLevel;