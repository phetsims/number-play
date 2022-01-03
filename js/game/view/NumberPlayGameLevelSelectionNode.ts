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
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import NumberPlayQueryParameters from '../../common/NumberPlayQueryParameters.js';

// constants
const LEVEL_SELECTION_BUTTON_SPACING = 30;

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
      return new LevelSelectionButton( new Image( level.gameType.levelImages[ level.levelNumber ] ),
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
    const getLevelSelectionButtons = ( levels: NumberPlayGameLevel[], gameColorProperty: ProfileColorProperty ) =>
      levels.map( level => createLevelSelectionButton( level, gameColorProperty ) );

    // create the level selection buttons for the each game
    const countingGameLevelSelectionButtons = getLevelSelectionButtons( model.countingLevels,
      NumberPlayColors.countingGameColorProperty );
    const subitizeGameLevelSelectionButtons = getLevelSelectionButtons( model.subitizeLevels,
      NumberPlayColors.subitizeGameColorProperty );

    const levelSelectionButtons = [ ...countingGameLevelSelectionButtons, ...subitizeGameLevelSelectionButtons ];

    // Hide buttons for levels that are not included in gameLevels query parameter. We must still create these buttons
    // so that we don't change the PhET-iO API. This assumes levelSelectionButtons are ordered correctly for their
    // desired layout so that the query parameter values match what is specified in the gameLevels documentation.
    if ( NumberPlayQueryParameters.gameLevels ) {
      levelSelectionButtons.forEach( ( button, index ) => {
        button.visible = NumberPlayQueryParameters.gameLevels.includes( index + 1 );
      } );
    }

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