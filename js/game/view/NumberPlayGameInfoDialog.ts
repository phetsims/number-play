// Copyright 2022, University of Colorado Boulder

/**
 * Dialog that explains the ranges of the numbers to count or subitize for each level and game type.
 * This is intended to be used by teachers to remind them of the range of challenges each level and game type contains.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import numberPlay from '../../numberPlay.js';
import { Text } from '../../../../scenery/js/imports.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import GameInfoDialog from '../../../../vegas/js/GameInfoDialog.js';
import NumberPlayQueryParameters from '../../common/NumberPlayQueryParameters.js';

// constants
const TITLE_FONT = new PhetFont( 32 );
const MAX_CONTENT_WIDTH = 600;

class NumberPlayGameInfoDialog extends GameInfoDialog {

  public constructor( levels: NumberPlayGameLevel[] ) {

    const descriptions = levels.map( level => level.gameType.levelDescriptions[ level.levelNumber ] );

    const titleNode = new Text( numberPlayStrings.games, {
      font: TITLE_FONT,
      maxWidth: 0.75 * MAX_CONTENT_WIDTH
    } );

    super( descriptions, {
      title: titleNode,
      gameLevels: NumberPlayQueryParameters.gameLevels,
      vBoxOptions: {
        align: 'left',
        spacing: 20,
        maxWidth: MAX_CONTENT_WIDTH // scale all descriptions uniformly
      },
      ySpacing: 30,
      bottomMargin: 30
    } );
  }
}

numberPlay.register( 'NumberPlayGameInfoDialog', NumberPlayGameInfoDialog );
export default NumberPlayGameInfoDialog;