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
import PreferencesToggleSwitch from '../../../../joist/js/preferences/PreferencesToggleSwitch.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';
import NumberSuiteCommonPreferencesNode from './NumberSuiteCommonPreferencesNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

export default class ReadAloudToggleSwitch<T extends NumberSuiteCommonPreferences> extends Node {

  public constructor( preferences: T, screens: number[], labelProperty: TReadOnlyProperty<string> ) {

    super();

    const toggleSwitch = new PreferencesToggleSwitch( preferences.readAloudProperty, false, true, {
      labelNode: new Text( labelProperty, NumberSuiteCommonPreferencesNode.CONTROL_TEXT_BOLD_OPTIONS ),
      descriptionNode: new Text( NumberPlayStrings.readAloudDescriptionStringProperty,
        NumberSuiteCommonPreferencesNode.CONTROL_TEXT_OPTIONS ),
      descriptionSpacing: NumberSuiteCommonPreferencesNode.CONTROL_DESCRIPTION_SPACING
    } );
    this.addChild( toggleSwitch );

    // TODO: Remove this space and convert this class back to a PreferencesToggleSwitch once spacing in the audio tab
    // is supported or the sounds
    const spacerSize = 40;
    const spacer = new Rectangle( 0, 0, spacerSize, spacerSize );
    spacer.left = toggleSwitch.right;
    this.addChild( spacer );

    if ( QueryStringMachine.containsKey( 'screens' ) ) {
      const includedScreens = phet.chipper.queryParameters.screens;
      toggleSwitch.enabled = _.some( includedScreens, includedScreen => screens.includes( includedScreen ) );
    }
  }
}

numberPlay.register( 'ReadAloudToggleSwitch', ReadAloudToggleSwitch );