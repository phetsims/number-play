// Copyright 2022, University of Colorado Boulder

/**
 * Info dialog which explains the ranges of the numbers to count or subitize for each level and game type.
 * This is intended to be used by teachers to remind them of the range of challenges each level and game type contains.
 *
 * @author Luisa Vargas
 */

// constants
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Dialog from '../../../../sun/js/Dialog.js';
import numberPlay from '../../numberPlay.js';
import { HBox, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import CountingGameLevel from '../model/CountingGameLevel.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';

const TITLE_FONT = new PhetFont( 32 );
const DESCRIPTION_FONT = new PhetFont( 24 );
const MAX_CONTENT_WIDTH = 600;

class InfoDialog extends Dialog {

  constructor( countingLevels: CountingGameLevel[], subitizeLevels: SubitizeGameLevel[] ) {

    const createLevelDescription = ( level: NumberPlayGameLevel, challengeRangeDescription: string, spacing: number ): HBox => {
      return new HBox( {
        align: 'center',
        spacing: spacing,
        children: [
          new RichText(
            StringUtils.fillIn( numberPlayStrings.gameNameLevelNumberPattern, {
              gameName: level.gameType.gameName,
              levelNumber: level.levelNumber
            } ).bold() + ' ',
            { font: DESCRIPTION_FONT }
          ),
          new RichText(
            StringUtils.fillIn( challengeRangeDescription, {
              minimumChallengeNumber: level.challengeRange.min,
              maximumChallengeNumber: level.challengeRange.max
            } ), { font: DESCRIPTION_FONT }
          )
        ]
      } );
    };

    const countingLevelsDescriptionText = countingLevels.map( countingLevel =>
      createLevelDescription( countingLevel, numberPlayStrings.countFromPattern, 40 ) // empirically determined tweak to look aligned
    );
    const subitizeLevelsDescriptionText = subitizeLevels.map( subitizeLevel =>
      createLevelDescription( subitizeLevel, numberPlayStrings.subitizeFromPattern, 30 ) // empirically determined tweak to look aligned
    );

    const content = ( levelsDescriptionText: RichText[] | VBox[], spacing: number ): VBox => {
      return new VBox( {
        align: 'left',
        spacing: spacing,
        children: levelsDescriptionText,
        maxWidth: MAX_CONTENT_WIDTH // scale all of the descriptions uniformly
      } );
    };

    const titleNode = new Text( numberPlayStrings.games, {
      font: TITLE_FONT,
      maxWidth: 0.75 * MAX_CONTENT_WIDTH
    } );

    super( content( [
      content( countingLevelsDescriptionText, 20 ),
      content( subitizeLevelsDescriptionText, 20 )
    ], 35 ), {
      title: titleNode,
      ySpacing: 20,
      bottomMargin: 20
    } );
  }
}

numberPlay.register( 'InfoDialog', InfoDialog );
export default InfoDialog;