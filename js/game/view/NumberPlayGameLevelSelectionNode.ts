// Copyright 2021, University of Colorado Boulder

/**
 * NumberPlayGameLevelSelectionNode is the user interface for level selection and other game settings in the 'Game'
 * screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { ColorProperty, HBox, Image, Node, ProfileColorProperty, Text, VBox } from '../../../../scenery/js/imports.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayGameModel from '../model/NumberPlayGameModel.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import subitizeGameIcon1_png from '../../../images/subitizeGameIcon1_png.js';
import countingGameIcon1_png from '../../../images/countingGameIcon1_png.js';
import subitizeGameIcon2_png from '../../../images/subitizeGameIcon2_png.js';
import countingGameIcon2_png from '../../../images/countingGameIcon2_png.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import NumberPlayQueryParameters from '../../common/NumberPlayQueryParameters.js';

// types
type GameLevelToButtonImageType = {
  [ key: string ]: {
    [ key: number ]: HTMLImageElement
  }
}

// constants
const LEVEL_SELECTION_BUTTON_SPACING = 30;
const GAME_LEVEL_TO_BUTTON_IMAGE = {} as GameLevelToButtonImageType;
GAME_LEVEL_TO_BUTTON_IMAGE[ numberPlayStrings.counting ] = {
  1: countingGameIcon1_png,
  2: countingGameIcon2_png
};
GAME_LEVEL_TO_BUTTON_IMAGE[ numberPlayStrings.subitize ] = {
  1: subitizeGameIcon1_png,
  2: subitizeGameIcon2_png
};

class NumberPlayGameLevelSelectionNode extends Node {

  constructor( model: NumberPlayGameModel, layoutBounds: Bounds2, resetCallback: () => void ) {
    super();

    // create and add the title text
    const titleText = new Text( numberPlayStrings.chooseYourGame, {
      font: new PhetFont( 40 ),
      maxWidth: layoutBounds.width - NumberPlayConstants.SCREEN_VIEW_X_PADDING * 2
    } );
    titleText.centerX = layoutBounds.centerX;
    titleText.top = layoutBounds.top + 42;
    this.addChild( titleText );

    // creates a level selection button for each level
    const createLevelSelectionButton = ( level: NumberPlayGameLevel, baseColor: ColorProperty ): LevelSelectionButton => {
      return new LevelSelectionButton( new Image( GAME_LEVEL_TO_BUTTON_IMAGE[ level.gameName ][ level.levelNumber ] ),
        level.scoreProperty, {
          iconToScoreDisplayYSpace: 0,
          scoreDisplayConstructor: ScoreDisplayNumberAndStar,
          listener: () => {
            model.levelProperty.value = level;
          },
          baseColor: baseColor,
          touchAreaXDilation: NumberPlayConstants.TOUCH_AREA_DILATION,
          touchAreaYDilation: NumberPlayConstants.TOUCH_AREA_DILATION
        } );
    };

    // creates all level selection buttons for a level and returns only the levels specified by the gameLevels query parameter
    const getLevelSelectionButtons = (
      levels: NumberPlayGameLevel[],
      gameType: string,
      gameColorProperty: ProfileColorProperty
    ): LevelSelectionButton[] => {
      const levelSelectionButtons: LevelSelectionButton[] = [];
      const levelNumbers = NumberPlayGameLevelSelectionNode.getLevelNumbers( NumberPlayQueryParameters.gameLevels, gameType );
      levels.forEach( level => {
        const levelSelectionButton = createLevelSelectionButton( level, gameColorProperty );
        if ( levelNumbers.includes( level.levelNumber ) ) {
          levelSelectionButtons.push( levelSelectionButton );
        }
      } );
      return levelSelectionButtons;
    };

    // create the level selection buttons for the each game
    const countingGameLevelSelectionButtons = getLevelSelectionButtons( model.countingLevels, NumberPlayConstants.A,
      NumberPlayColors.countingGameColorProperty );
    const subitizeGameLevelSelectionButtons = getLevelSelectionButtons( model.subitizeLevels, NumberPlayConstants.B,
      NumberPlayColors.subitizeGameColorProperty );

    // arrange and add the level selection buttons
    const levelSelectionButtonsBox = new VBox( {
      children: [
        new HBox( {
          children: countingGameLevelSelectionButtons,
          spacing: LEVEL_SELECTION_BUTTON_SPACING
        } ),
        new HBox( {
          children: subitizeGameLevelSelectionButtons,
          spacing: LEVEL_SELECTION_BUTTON_SPACING
        } )
      ],
      spacing: LEVEL_SELECTION_BUTTON_SPACING
    } );
    levelSelectionButtonsBox.center = layoutBounds.center;
    this.addChild( levelSelectionButtonsBox );

    // create and add reset all button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        resetCallback();
      },
      right: layoutBounds.maxX - NumberPlayConstants.SCREEN_VIEW_X_PADDING,
      bottom: layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_Y_PADDING
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Returns the level number for each level code that matches the provided level character by extracting the level
   * numbers from the level codes. It also sorts them to ensure level x is displayed before level x+1 in case the level
   * codes were provided out of order.
   *
   * @param levelCodes - the array of two-character codes that represent game levels
   * @param levelCharacter - the character that indicates which level codes should be kept and turned into numbers
   */
  private static getLevelNumbers( levelCodes: string[], levelCharacter: string ): number[] {
    const levelsCodesToInclude = levelCodes.filter( levelCode => levelCode.includes( levelCharacter ) );
    const levelNumbers = levelsCodesToInclude.map( levelName => parseInt( levelName.replace( levelCharacter, '' ) ) ); // eslint-disable-line
    return _.sortBy( levelNumbers );
  }
}

numberPlay.register( 'NumberPlayGameLevelSelectionNode', NumberPlayGameLevelSelectionNode );
export default NumberPlayGameLevelSelectionNode;