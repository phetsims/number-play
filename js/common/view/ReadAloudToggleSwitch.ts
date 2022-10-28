// Copyright 2022, University of Colorado Boulder

/**
 * A toggle switch in the Preferences Dialog that controls whether the sim automatically reads the current total out loud
 * when it changes.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import { Text } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import NumberSuiteCommonPreferences from '../model/NumberSuiteCommonPreferences.js';
import PreferencesToggleSwitch from '../../../../joist/js/preferences/PreferencesToggleSwitch.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';
import NumberSuiteCommonPreferencesNode from './NumberSuiteCommonPreferencesNode.js';

export default class ReadAloudToggleSwitch<T extends NumberSuiteCommonPreferences> extends PreferencesToggleSwitch<boolean> {

  public constructor( preferences: T, screens: number[] ) {

    super( preferences.readAloudProperty, false, true, {
      labelNode: new Text( NumberPlayStrings.readAloudStringProperty, NumberSuiteCommonPreferencesNode.CONTROL_TEXT_BOLD_OPTIONS ),
      descriptionNode: new Text( NumberPlayStrings.readAloudDescriptionStringProperty,
        NumberSuiteCommonPreferencesNode.CONTROL_TEXT_OPTIONS ),
      descriptionSpacing: NumberSuiteCommonPreferencesNode.CONTROL_DESCRIPTION_SPACING
    } );

    if ( QueryStringMachine.containsKey( 'screens' ) ) {
      const includedScreens = phet.chipper.queryParameters.screens;
      this.enabled = _.some( includedScreens, includedScreen => screens.includes( includedScreen ) );
    }
  }
}

numberPlay.register( 'ReadAloudToggleSwitch', ReadAloudToggleSwitch );