// Copyright 2022, University of Colorado Boulder

/**
 * Dialog that explains the ranges of the numbers to count or subitize for each level and game type.
 * This is intended to be used by teachers to remind them of the range of challenges each level and game type contains.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Dialog from '../../../../sun/js/Dialog.js';
import numberPlay from '../../numberPlay.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import CountingGameLevel from '../model/CountingGameLevel.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';

// constants
const TITLE_FONT = new PhetFont( 32 );
const MAX_CONTENT_WIDTH = 600;

class NumberPlayGameInfoDialog extends Dialog {

  // TODO: This dislog should use common code, see https://github.com/phetsims/vegas/issues/107
  constructor( countingLevels: CountingGameLevel[], subitizeLevels: SubitizeGameLevel[] ) {

    const titleNode = new Text( numberPlayStrings.games, {
      font: TITLE_FONT,
      maxWidth: 0.75 * MAX_CONTENT_WIDTH
    } );

    super( new Node(), {
      title: titleNode,
      ySpacing: 30,
      bottomMargin: 30
    } );
  }
}

numberPlay.register( 'NumberPlayGameInfoDialog', NumberPlayGameInfoDialog );
export default NumberPlayGameInfoDialog;