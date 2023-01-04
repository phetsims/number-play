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
import NumberPlayStrings from '../../NumberPlayStrings.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import GameInfoDialog from '../../../../vegas/js/GameInfoDialog.js';
import NumberPlayQueryParameters from '../../common/NumberPlayQueryParameters.js';

// constants
const TITLE_FONT = new PhetFont( 32 );

class NumberPlayGameInfoDialog extends GameInfoDialog {

  public constructor( levels: NumberPlayGameLevel[] ) {

    const descriptions = levels.map( level => level.gameType.levelDescriptions[ level.levelNumber ] );

    const titleNode = new Text( NumberPlayStrings.games, {
      font: TITLE_FONT
    } );

    super( descriptions, {
      title: titleNode,
      gameLevels: NumberPlayQueryParameters.gameLevels,
      ySpacing: 30,
      bottomMargin: 30
    } );
  }
}

numberPlay.register( 'NumberPlayGameInfoDialog', NumberPlayGameInfoDialog );
export default NumberPlayGameInfoDialog;