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

export default class NumberPlayPreferencesNode extends NumberSuiteCommonPreferencesNode<NumberPlayPreferences> {

  public constructor() {

    const gameScreenSectionTitle = new Text( 'Game Screen', {
      fontWeight: 'bold',
      fontSize: NumberSuiteCommonPreferencesNode.FONT_SIZE
    } );

    const showCountingLevelOneCheckbox = new Checkbox( numberPlayPreferences.showCountingLevelOneProperty,
      new Text( 'Counting: Level One', { fontSize: NumberSuiteCommonPreferencesNode.FONT_SIZE } ) );
    const showCountingLevelTwoCheckbox = new Checkbox( numberPlayPreferences.showCountingLevelTwoProperty,
      new Text( 'Counting: Level Two', { fontSize: NumberSuiteCommonPreferencesNode.FONT_SIZE } ) );
    const showSubitizeLevelOneCheckbox = new Checkbox( numberPlayPreferences.showSubitizeLevelOneProperty,
      new Text( 'Subitize: Level One', { fontSize: NumberSuiteCommonPreferencesNode.FONT_SIZE } ) );
    const showSubitizeLevelTwoCheckbox = new Checkbox( numberPlayPreferences.showSubitizeLevelTwoProperty,
      new Text( 'Subitize: Level Two', { fontSize: NumberSuiteCommonPreferencesNode.FONT_SIZE } ) );

    const subitizeTimeText = new Text( 'Subitize Time', {
      fontSize: NumberSuiteCommonPreferencesNode.FONT_SIZE
    } );
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

    super( numberPlayPreferences, [ gameScreenSectionTitle, gameScreenControls ] );
  }
}

numberPlay.register( 'NumberPlayPreferencesNode', NumberPlayPreferencesNode );