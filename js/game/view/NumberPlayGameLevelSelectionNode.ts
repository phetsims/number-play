// Copyright 2021-2025, University of Colorado Boulder

/**
 * NumberPlayGameLevelSelectionNode is the user interface for level selection and other game settings in the 'Game'
 * screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Disposable from '../../../../axon/js/Disposable.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import NumberSuiteCommonConstants from '../../../../number-suite-common/js/common/NumberSuiteCommonConstants.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';
import NumberPlayGameModel from '../model/NumberPlayGameModel.js';
import NumberPlayGameInfoDialog from './NumberPlayGameInfoDialog.js';
import NumberPlayGameLevelSelectionButtonGroup from './NumberPlayGameLevelSelectionButtonGroup.js';

// constants
const INFO_BUTTON_SIZE = 35;
const INFO_BUTTON_MARGIN = 20;

class NumberPlayGameLevelSelectionNode extends Node {

  public constructor( model: NumberPlayGameModel, layoutBounds: Bounds2, resetCallback: () => void ) {
    super();

    // create the info dialog, which displays info about each game
    const numberPlayGameInfoDialog = new NumberPlayGameInfoDialog( model.levels );

    // Info button, to right of 'Choose Your Game!', opens the Info dialog.
    const infoButton = new InfoButton( {
      maxHeight: INFO_BUTTON_SIZE,
      listener: () => numberPlayGameInfoDialog.show()
    } );

    // leave room for the info button
    const titleMaxWidth = layoutBounds.width - NumberSuiteCommonConstants.SCREEN_VIEW_PADDING_X * 2 - infoButton.width * 2 -
                          INFO_BUTTON_MARGIN * 2;

    // create and add the title text
    const titleText = new Text( NumberPlayStrings.chooseYourGameStringProperty, {
      font: new PhetFont( 40 ),
      maxWidth: titleMaxWidth
    } );

    const hBox = new HBox( {
      children: [ titleText, infoButton ],
      spacing: INFO_BUTTON_MARGIN,
      align: 'center'
    } );
    this.addChild( hBox );
    hBox.top = layoutBounds.top + 42;

    ManualConstraint.create( this, [ hBox ], hBox => {
      hBox.centerX = layoutBounds.centerX + ( INFO_BUTTON_MARGIN + infoButton.width ) / 2;
    } );

    const levelSelectionButtonGroup = new NumberPlayGameLevelSelectionButtonGroup( model.levelProperty, model.levels );
    levelSelectionButtonGroup.center = layoutBounds.center;
    this.addChild( levelSelectionButtonGroup );

    // create and add reset all button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        resetCallback();
      },
      right: layoutBounds.maxX - NumberSuiteCommonConstants.SCREEN_VIEW_PADDING_X,
      bottom: layoutBounds.maxY - NumberSuiteCommonConstants.SCREEN_VIEW_PADDING_Y
    } );
    this.addChild( resetAllButton );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }
}

numberPlay.register( 'NumberPlayGameLevelSelectionNode', NumberPlayGameLevelSelectionNode );
export default NumberPlayGameLevelSelectionNode;