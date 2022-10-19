// Copyright 2022, University of Colorado Boulder

/**
 * NumberPlayPreferencesNode is the user interface for sim-specific preferences for Number Play, accessed via the
 * Preferences dialog. These preferences are global, and affect all screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import NumberSuiteCommonPreferencesNode from './NumberSuiteCommonPreferencesNode.js';
import numberPlayPreferences, { NumberPlayPreferences } from '../model/numberPlayPreferences.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Utils from '../../../../dot/js/Utils.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';

export default class NumberPlayPreferencesNode extends NumberSuiteCommonPreferencesNode<NumberPlayPreferences> {

  public constructor() {

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

    const subitizeTimeText = new Text( NumberPlayStrings.subitizeTimeStringProperty,
      NumberSuiteCommonPreferencesNode.CONTROL_TEXT_BOLD_OPTIONS );
    const subitizeTimeSlider = new HSlider( numberPlayPreferences.subitizeTimeShownProperty,
      numberPlayPreferences.subitizeTimeShownProperty.range!, {
        constrainValue: ( value: number ) => Utils.toFixedNumber( value, 1 )
      } );
    const subitizeTimeControl = new HBox( {
      children: [ subitizeTimeText, subitizeTimeSlider ]
    } );

    const gameScreenControls = new VBox( {
      children: [ showCountingLevelOneCheckbox, showCountingLevelTwoCheckbox, showSubitizeLevelOneCheckbox,
        showSubitizeLevelTwoCheckbox, subitizeTimeControl ],
      spacing: 6,
      align: 'left'
    } );

    super( numberPlayPreferences, [ gameLevelsHeader, gameScreenControls ] );
  }
}

numberPlay.register( 'NumberPlayPreferencesNode', NumberPlayPreferencesNode );