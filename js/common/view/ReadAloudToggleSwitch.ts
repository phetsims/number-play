// Copyright 2022, University of Colorado Boulder

/**
 * A toggle switch in the Preferences Dialog that controls whether the sim automatically reads the current total out loud
 * when it changes.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import NumberSuiteCommonPreferences from '../model/NumberSuiteCommonPreferences.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';
import NumberSuiteCommonPreferencesNode from './NumberSuiteCommonPreferencesNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';

export default class ReadAloudToggleSwitch<T extends NumberSuiteCommonPreferences> extends Node {

  public constructor( preferences: T, screens: number[], labelProperty: TReadOnlyProperty<string> ) {

    super();

    const toggleSwitch = new ToggleSwitch( preferences.readAloudProperty, false, true, PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS );
    const control = new PreferencesControl( {
      labelNode: new Text( labelProperty, NumberSuiteCommonPreferencesNode.CONTROL_TEXT_BOLD_OPTIONS ),
      descriptionNode: new Text( NumberPlayStrings.readAloudDescriptionStringProperty,
        NumberSuiteCommonPreferencesNode.CONTROL_TEXT_OPTIONS ),
      descriptionSpacing: NumberSuiteCommonPreferencesNode.CONTROL_DESCRIPTION_SPACING,
      controlNode: toggleSwitch
    } );
    this.addChild( control );

    // TODO: Remove this space and convert this class back to a PreferencesToggleSwitch once spacing in the audio tab
    // is supported or the sounds
    const spacerSize = 40;
    const spacer = new Rectangle( 0, 0, spacerSize, spacerSize );
    spacer.left = control.right;
    this.addChild( spacer );

    if ( QueryStringMachine.containsKey( 'screens' ) ) {
      const includedScreens = phet.chipper.queryParameters.screens;
      control.enabled = _.some( includedScreens, includedScreen => screens.includes( includedScreen ) );
    }
  }
}

numberPlay.register( 'ReadAloudToggleSwitch', ReadAloudToggleSwitch );