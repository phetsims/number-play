// Copyright 2021, University of Colorado Boulder

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayGameLevel from './NumberPlayGameLevel.js';

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
  }
}

numberPlay.register( 'SubitizeGameLevel', SubitizeGameLevel );
export default SubitizeGameLevel;