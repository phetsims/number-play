// Copyright 2022, University of Colorado Boulder

/**
 * NumberPlayPreferencesNode is the user interface for sim-specific preferences for Number Play, accessed via the
 * Preferences dialog. These preferences are global, and affect all screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Font, HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import NumberSuiteCommonPreferencesNode from './NumberSuiteCommonPreferencesNode.js';
import numberPlayPreferences, { NumberPlayPreferences } from '../model/numberPlayPreferences.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';

export default class NumberPlayPreferencesNode extends NumberSuiteCommonPreferencesNode<NumberPlayPreferences> {

  public constructor() {

    // TODO: game level controls may be removed
    const gameLevelsTitle = new Text( NumberPlayStrings.gameLevelsStringProperty,
      NumberSuiteCommonPreferencesNode.CONTROL_TEXT_BOLD_OPTIONS );
    const gameLevelsDescription = new Text( NumberPlayStrings.gameLevelsDescriptionStringProperty,
      NumberSuiteCommonPreferencesNode.CONTROL_TEXT_OPTIONS );

    const gameLevelsHeader = new VBox( {
      children: [ gameLevelsTitle, gameLevelsDescription ],
      spacing: NumberSuiteCommonPreferencesNode.CONTROL_DESCRIPTION_SPACING,
      align: 'left'
    } );

    const showCountingLevelOneCheckbox = new Checkbox( numberPlayPreferences.showCountingLevelOneProperty,
      new Text( NumberPlayStrings.countingLevelOneStringProperty, NumberSuiteCommonPreferencesNode.CONTROL_TEXT_OPTIONS ) );
    const showCountingLevelTwoCheckbox = new Checkbox( numberPlayPreferences.showCountingLevelTwoProperty,
      new Text( NumberPlayStrings.countingLevelTwoStringProperty, NumberSuiteCommonPreferencesNode.CONTROL_TEXT_OPTIONS ) );
    const showSubitizeLevelOneCheckbox = new Checkbox( numberPlayPreferences.showSubitizeLevelOneProperty,
      new Text( NumberPlayStrings.subitizeLevelOneStringProperty, NumberSuiteCommonPreferencesNode.CONTROL_TEXT_OPTIONS ) );
    const showSubitizeLevelTwoCheckbox = new Checkbox( numberPlayPreferences.showSubitizeLevelTwoProperty,
      new Text( NumberPlayStrings.subitizeLevelTwoStringProperty, NumberSuiteCommonPreferencesNode.CONTROL_TEXT_OPTIONS ) );

    // TODO: Make into its own type if we like this - make general number spinner control if we keep the compare max control
    const subitizeTimeText = new Text( NumberPlayStrings.subitizeTimeStringProperty,
      NumberSuiteCommonPreferencesNode.CONTROL_TEXT_BOLD_OPTIONS );
    const subitizeTimeRange = numberPlayPreferences.subitizeTimeShownProperty.rangeProperty.value!;
    const subitizeTimeSpinner = new NumberSpinner( numberPlayPreferences.subitizeTimeShownProperty,
      new Property<Range>( subitizeTimeRange ), {
        arrowsPosition: 'leftRight',
        deltaValue: 0.1,
        numberDisplayOptions: {
          valuePattern: '{{value}} s',
          decimalPlaces: 1,
          align: 'center',
          xMargin: 10,
          yMargin: 3,
          textOptions: {
            font: new Font( { size: NumberSuiteCommonPreferencesNode.FONT_SIZE } )
          }
        }
      } );
    const subitizeTimeHBox = new HBox( {
      children: [ subitizeTimeText, subitizeTimeSpinner ],
      spacing: 226
    } );

    const subitizeTimeDescriptionText = new Text( NumberPlayStrings.subitizeTimeDescriptionStringProperty,
      NumberSuiteCommonPreferencesNode.CONTROL_TEXT_OPTIONS );
    const subitizeTimeControl = new VBox( {
      children: [ subitizeTimeHBox, subitizeTimeDescriptionText ],
      spacing: NumberSuiteCommonPreferencesNode.CONTROL_DESCRIPTION_SPACING,
      align: 'left'
    } );

    const gameScreenControls = new VBox( {
      children: [ showCountingLevelOneCheckbox, showCountingLevelTwoCheckbox, showSubitizeLevelOneCheckbox,
        showSubitizeLevelTwoCheckbox ],
      spacing: 6,
      align: 'left'
    } );

    super( numberPlayPreferences, [ gameLevelsHeader, gameScreenControls, subitizeTimeControl ] );

    // disable any controls that are not applicable to the current selection of screens
    if ( QueryStringMachine.containsKey( 'screens' ) ) {
      const screens = phet.chipper.queryParameters.screens;
      const isSecondLocaleScreen = screens.includes( 1 ) || screens.includes( 2 );
      const isGameScreen = screens.includes( 3 );
      const isLabScreen = screens.includes( 4 );

      this.showSecondLocaleControl.enabled = isSecondLocaleScreen;
      gameLevelsHeader.enabled = isGameScreen;
      gameScreenControls.enabled = isGameScreen;
      subitizeTimeControl.enabled = isGameScreen;
      this.showLabOnesToggleSwitch.enabled = isLabScreen;
    }
  }
}

numberPlay.register( 'NumberPlayPreferencesNode', NumberPlayPreferencesNode );