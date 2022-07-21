// Copyright 2022, University of Colorado Boulder

/**
 * NumberPlayGameLevelSelectionButtonGroup is the group of level-selection buttons in the 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Image } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import IProperty from '../../../../axon/js/IProperty.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import NumberPlayQueryParameters from '../../common/NumberPlayQueryParameters.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupOptions } from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
const BUTTON_WIDTH = 150;
const BUTTON_SPACING = 30;
const BUTTONS_PER_ROW = 2;

class NumberPlayGameLevelSelectionButtonGroup extends LevelSelectionButtonGroup {

  public constructor( levelProperty: IProperty<NumberPlayGameLevel | null>, levels: NumberPlayGameLevel[] ) {

    const options: LevelSelectionButtonGroupOptions = {
      levelSelectionButtonOptions: {
        iconToScoreDisplayYSpace: 0,
        touchAreaXDilation: NumberPlayConstants.TOUCH_AREA_DILATION,
        touchAreaYDilation: NumberPlayConstants.TOUCH_AREA_DILATION
      },

      // A maximum number of buttons per row, wrapping to a new row
      flowBoxOptions: {
        spacing: BUTTON_SPACING, // horizontal spacing
        lineSpacing: BUTTON_SPACING, // vertical spacing
        preferredWidth: BUTTONS_PER_ROW * ( BUTTON_WIDTH + BUTTON_SPACING ),
        wrap: true, // start a new row when preferredWidth is reached
        justify: 'center' // horizontal justification
      },
      gameLevels: NumberPlayQueryParameters.gameLevels,
      tandem: Tandem.REQUIRED
    };

    const items = levels.map( level => {
      return {
        icon: new Image( level.gameType.levelImages[ level.levelNumber ] ),
        scoreProperty: level.scoreProperty,
        options: {
          createScoreDisplay: ( scoreProperty: IProperty<number> ) => new ScoreDisplayNumberAndStar( scoreProperty ),
          listener: () => {
            levelProperty.value = level;
          },
          baseColor: level.baseColor
        }
      };
    } );

    super( items, options );
  }
}

numberPlay.register( 'NumberPlayGameLevelSelectionButtonGroup', NumberPlayGameLevelSelectionButtonGroup );
export default NumberPlayGameLevelSelectionButtonGroup;