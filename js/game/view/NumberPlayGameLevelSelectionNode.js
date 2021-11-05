// Copyright 2021, University of Colorado Boulder

/**
 * NumberPlayGameLevelSelectionNode is the user interface for level selection and other game settings in the 'Game'
 * screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';

class NumberPlayGameLevelSelectionNode extends Node {

  /**
   * @param {NumberPlayGameModel} model
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   */
  constructor( model, layoutBounds, options ) {

    // a level-selection button for each level
    const levelSelectionButtons = model.levels.map(
      level => new LevelSelectionButton( new Text(
        StringUtils.fillIn( numberPlayStrings.level, {
          levelNumber: level.levelNumber
        } )
      ), level.scoreProperty, {
        // LevelSelectionButton options
        scoreDisplayConstructor: ScoreDisplayNumberAndStar,
        listener: () => {
          model.levelProperty.value = level;
        }
      } )
    );

    const levelSelectionButtonsBox = new HBox( {
      children: levelSelectionButtons,
      spacing: 40
    } );
    levelSelectionButtonsBox.center = layoutBounds.center;

    // Reset All button, at lower right
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        options.resetCallback && options.resetCallback();
      },
      right: layoutBounds.maxX - NumberPlayConstants.SCREEN_VIEW_X_PADDING,
      bottom: layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_Y_PADDING
    } );

    options.children = [ levelSelectionButtonsBox, resetAllButton ];

    super( options );
  }

}

numberPlay.register( 'NumberPlayGameLevelSelectionNode', NumberPlayGameLevelSelectionNode );
export default NumberPlayGameLevelSelectionNode;