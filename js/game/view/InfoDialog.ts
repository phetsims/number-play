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
import { HBox, Node, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import CountingGameLevel from '../model/CountingGameLevel.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';

// constants
const TITLE_FONT = new PhetFont( 32 );
const DESCRIPTION_FONT = new PhetFont( 24 );
const MAX_CONTENT_WIDTH = 600;
const V_BOX_ALIGNMENT = 'left';

class InfoDialog extends Dialog {

  constructor( countingLevels: CountingGameLevel[], subitizeLevels: SubitizeGameLevel[] ) {

    const createLevelNameLabel = ( level: NumberPlayGameLevel ) => new RichText(
      StringUtils.fillIn( numberPlayStrings.gameNameLevelNumberPattern, {
        gameName: level.gameType.gameName,
        levelNumber: level.levelNumber
      } ).bold(), {
        font: DESCRIPTION_FONT
      } );

    const createLevelDescriptionLabel = ( level: NumberPlayGameLevel, challengeRangeDescription: string ) => new RichText(
      StringUtils.fillIn( challengeRangeDescription, {
        minimumChallengeNumber: level.challengeRange.min,
        maximumChallengeNumber: level.challengeRange.max
      } ), {
        font: DESCRIPTION_FONT
      } );

    const levelNameLabels = tallVBox( [
      shortVBox( countingLevels.map( level => createLevelNameLabel( level ) ) ),
      shortVBox( subitizeLevels.map( level => createLevelNameLabel( level ) ) )
    ] );

    const levelDescriptionLabels = tallVBox( [
      shortVBox( countingLevels.map( level => createLevelDescriptionLabel( level, numberPlayStrings.countFromPattern ) ) ),
      shortVBox( subitizeLevels.map( level => createLevelDescriptionLabel( level, numberPlayStrings.subitizeFromPattern ) ) )
    ] );

    const titleNode = new Text( numberPlayStrings.games, {
      font: TITLE_FONT,
      maxWidth: 0.75 * MAX_CONTENT_WIDTH
    } );

    super( new HBox( {
      spacing: 40,
      children: [ levelNameLabels, levelDescriptionLabels ],
      maxWidth: MAX_CONTENT_WIDTH // scale all of the descriptions uniformly so they line up correctly
    } ), {
      title: titleNode,
      ySpacing: 30,
      bottomMargin: 30
    } );
  }
}

// creates a VBox creator with the specified spacing
const createVBoxCreator = ( spacing: number ) => ( children: Node[] ) => new VBox( {
  align: V_BOX_ALIGNMENT,
  spacing: spacing,
  children: [ ...children ]
} );

// VBox creators for convenience
const shortVBox = createVBoxCreator( 15 );
const tallVBox = createVBoxCreator( 40 );

numberPlay.register( 'InfoDialog', InfoDialog );
export default InfoDialog;