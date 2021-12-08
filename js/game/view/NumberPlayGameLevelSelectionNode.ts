// Copyright 2021, University of Colorado Boulder

/**
 * NumberPlayGameLevelSelectionNode is the user interface for level selection and other game settings in the 'Game'
 * screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { HBox } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayGameModel from '../model/NumberPlayGameModel.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { VBox } from '../../../../scenery/js/imports.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import CountingGameLevel from '../model/CountingGameLevel.js';
import { HStrut } from '../../../../scenery/js/imports.js';

class NumberPlayGameLevelSelectionNode extends Node {

  constructor( model: NumberPlayGameModel, layoutBounds: Bounds2, resetCallback: () => void ) {
    super();

    // create and add the title text
    const titleText = new Text( numberPlayStrings.chooseYourGame, { font: new PhetFont( 40 ) } );
    titleText.centerX = layoutBounds.centerX;
    titleText.top = layoutBounds.top + 42; // empirically determined
    this.addChild( titleText );

    // creates a level-selection button for each level
    const createLevelSelectionButton = ( level: SubitizeGameLevel | CountingGameLevel, baseColor: string ) => {
      return new LevelSelectionButton( new VBox( {
        children: [
          new HStrut( 47 ),
          new Text( level.gameName ),
          new Text( StringUtils.fillIn( numberPlayStrings.levelPattern, { levelNumber: level.levelNumber } ) )
        ]
      } ), level.scoreProperty, {
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
    const countingLevelSelectionButtons = model.countingLevels.map(
      level => createLevelSelectionButton( level, NumberPlayConstants.COUNTING_GAME_COLOR )
    );

    // create the level selection buttons for the 'Subitize' game
    const subitizeGameLevelSelectionButtons = model.subitizeLevels.map(
      level => createLevelSelectionButton( level, NumberPlayConstants.SUBITIZE_GAME_COLOR )
    );

    // arrange and add the level selection buttons
    const buttonSpacing = 30;
    const levelSelectionButtonsBox = new VBox( {
      children: [
        new HBox( {
          children: countingLevelSelectionButtons,
          spacing: buttonSpacing
        } ),
        new HBox( {
          children: subitizeGameLevelSelectionButtons,
          spacing: buttonSpacing
        } )
      ],
      spacing: buttonSpacing
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