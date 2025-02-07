// Copyright 2022-2024, University of Colorado Boulder

/**
 * NumberPlayGameLevelSelectionButtonGroup is the group of level-selection buttons in the 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import TProperty from '../../../../axon/js/TProperty.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupOptions } from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import NumberPlayQueryParameters from '../../common/NumberPlayQueryParameters.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';

// constants
const BUTTON_SPACING = 30;

class NumberPlayGameLevelSelectionButtonGroup extends LevelSelectionButtonGroup {

  public constructor( levelProperty: TProperty<NumberPlayGameLevel | null>, levels: NumberPlayGameLevel[] ) {

    const options: LevelSelectionButtonGroupOptions = {
      levelSelectionButtonOptions: {
        iconToScoreDisplayYSpace: 0,
        touchAreaXDilation: NumberPlayConstants.TOUCH_AREA_DILATION,
        touchAreaYDilation: NumberPlayConstants.TOUCH_AREA_DILATION
      },

      // always put the counting levels on the top row, subitize levels always on the bottoms row
      createLayoutNode: ( levelSelectionButtons: LevelSelectionButton[] ) => {
        assert && assert( levelSelectionButtons.length === 4, 'this layout is hardcoded for 4 buttons' );
        return new VBox( {
          children: [
            new HBox( {
              children: [ levelSelectionButtons[ 0 ], levelSelectionButtons[ 1 ] ],
              spacing: BUTTON_SPACING
            } ),
            new HBox( {
              children: [ levelSelectionButtons[ 2 ], levelSelectionButtons[ 3 ] ],
              spacing: BUTTON_SPACING
            } )
          ],
          spacing: BUTTON_SPACING
        } );
      },
      gameLevels: NumberPlayQueryParameters.gameLevels,
      tandem: Tandem.REQUIRED
    };

    const items = levels.map( level => {
      return {
        icon: new Image( level.gameType.levelImages[ level.levelNumber ] ),
        scoreProperty: level.scoreProperty,
        options: {
          createScoreDisplay: ( scoreProperty: TProperty<number> ) => new ScoreDisplayNumberAndStar( scoreProperty ),
          listener: () => {
            levelProperty.value = level;
          },
          baseColor: level.baseColorProperty
        }
      };
    } );

    super( items, options );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }
}

numberPlay.register( 'NumberPlayGameLevelSelectionButtonGroup', NumberPlayGameLevelSelectionButtonGroup );
export default NumberPlayGameLevelSelectionButtonGroup;