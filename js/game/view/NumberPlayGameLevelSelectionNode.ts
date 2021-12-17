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
import { ColorProperty, HBox, Image, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayGameModel from '../model/NumberPlayGameModel.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import subitizeGameIcon1 from '../../../images/subitize_game_icon_1_png.js';
import countingGameIcon1 from '../../../images/counting_game_icon_1_png.js';
import subitizeGameIcon2 from '../../../images/subitize_game_icon_2_png.js';
import countingGameIcon2 from '../../../images/counting_game_icon_2_png.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';

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
  1: countingGameIcon1,
  2: countingGameIcon2
};
GAME_LEVEL_TO_BUTTON_IMAGE[ numberPlayStrings.subitize ] = {
  1: subitizeGameIcon1,
  2: subitizeGameIcon2
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

    // creates a level-selection button for each level
    const createLevelSelectionButton = ( level: NumberPlayGameLevel, baseColor: ColorProperty ) => {
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

    // create the level selection buttons for the 'Counting' game
    const countingGameLevelSelectionButtons = model.countingLevels.map(
      level => createLevelSelectionButton( level, NumberPlayColors.countingGameColorProperty )
    );

    // create the level selection buttons for the 'Subitize' game
    const subitizeGameLevelSelectionButtons = model.subitizeLevels.map(
      level => createLevelSelectionButton( level, NumberPlayColors.subitizeGameColorProperty )
    );

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
}

numberPlay.register( 'NumberPlayGameLevelSelectionNode', NumberPlayGameLevelSelectionNode );
export default NumberPlayGameLevelSelectionNode;