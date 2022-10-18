// Copyright 2022, University of Colorado Boulder

/**
 * NumberSuiteCommonPreferencesNode is the user interface for sim-specific preferences for all Number suite sims,
 * accessed via the Preferences dialog. These preferences are global, and affect all screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { HBox, Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import numberPlay from '../../numberPlay.js';
import NumberSuiteCommonPreferences from '../model/NumberSuiteCommonPreferences.js';
import PreferencesToggleSwitch from '../../../../joist/js/preferences/PreferencesToggleSwitch.js';
import SecondLocaleSelectorCarousel from './SecondLocaleSelectorCarousel.js';

// constants
const FONT_SIZE = 16;

export default abstract class NumberSuiteCommonPreferencesNode<T extends NumberSuiteCommonPreferences> extends HBox {
  public static readonly FONT_SIZE = FONT_SIZE;

  protected constructor( preferences: T, additionalControls: Node[] ) {

    super( {
      spacing: 40,
      align: 'top'
    } );

    const vBoxOptions: VBoxOptions = {
      align: 'left',
      spacing: 15
    };

    const generalText = new Text( 'General', {
      fontSize: FONT_SIZE,
      fontWeight: 'bold'
    } );
    const readAloudToggleSwitch = new PreferencesToggleSwitch( preferences.readAloudProperty, false, true, {
      leftValueLabel: new Text( 'Read Aloud', {
        fontSize: FONT_SIZE
      } )
    } );
    const showSecondLocaleProperty = new PreferencesToggleSwitch( preferences.showSecondLocaleProperty, false, true, {
      leftValueLabel: new Text( 'Second Language', {
        fontSize: FONT_SIZE
      } )
    } );
    const generalControls = new VBox( {
      children: [ readAloudToggleSwitch, showSecondLocaleProperty ],
      align: 'left',
      spacing: 5
    } );

    const secondLocaleSelectorNode = new SecondLocaleSelectorCarousel();
    preferences.showSecondLocaleProperty.link( showSecondLocale => {
      secondLocaleSelectorNode.visible = showSecondLocale;
    } );

    const leftVBox = new VBox( combineOptions<VBoxOptions>( vBoxOptions, {
      excludeInvisibleChildrenFromBounds: false
    } ) );
    leftVBox.children = [ generalText, generalControls, secondLocaleSelectorNode ];

    const labScreenText = new Text( 'Lab Screen', {
      fontWeight: 'bold',
      fontSize: FONT_SIZE
    } );
    const showLabOnesToggleSwitch = new PreferencesToggleSwitch( preferences.showLabOnesProperty, false, true, {
      leftValueLabel: new Text( 'Show Ones', {
        fontSize: FONT_SIZE
      } )
    } );
    const rightVBox = new VBox( vBoxOptions );
    rightVBox.children = [ ...additionalControls, labScreenText, showLabOnesToggleSwitch ];

    this.children = [ leftVBox, rightVBox ];
  }
}

numberPlay.register( 'NumberSuiteCommonPreferencesNode', NumberSuiteCommonPreferencesNode );