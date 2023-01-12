// Copyright 2022-2023, University of Colorado Boulder

/**
 * NumberPlayPreferencesNode is the user interface for sim-specific preferences for Number Play, accessed via the
 * Preferences dialog. These preferences are global, and affect all screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Font, RichText, Text } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import NumberSuiteCommonPreferencesNode from '../../../../number-suite-common/js/common/view/NumberSuiteCommonPreferencesNode.js';
import numberPlayPreferences, { NumberPlayPreferences } from '../model/numberPlayPreferences.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import NumberPlayGameScreen from '../../game/NumberPlayGameScreen.js';
import TenScreen from '../../ten/TenScreen.js';
import TwentyScreen from '../../twenty/TwentyScreen.js';
import LabScreen from '../../../../number-suite-common/js/lab/LabScreen.js';

export default class NumberPlayPreferencesNode extends NumberSuiteCommonPreferencesNode<NumberPlayPreferences> {

  public constructor() {

    const subitizeTimeText = new Text( NumberPlayStrings.subitizeTimeStringProperty,
      PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );
    const subitizeTimeRange = numberPlayPreferences.subitizeTimeShownProperty.rangeProperty.value;

    // TODO: are these the options we would like to use as constants for a preferences number spinner? https://github.com/phetsims/joist/issues/842
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

    const subitizeTimeDescriptionText = new RichText( NumberPlayStrings.subitizeTimeDescriptionStringProperty,
      PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

    const subitizeTimePreferencesControl = new PreferencesControl( {
      labelNode: subitizeTimeText,
      controlNode: subitizeTimeSpinner,
      descriptionNode: subitizeTimeDescriptionText
    } );

    super( numberPlayPreferences, [ subitizeTimePreferencesControl ] );

    // Disable any controls that are not applicable to the current selection of screens.
    if ( QueryStringMachine.containsKey( 'screens' ) ) {

      const screens = phet.joist.sim.screens;

      // Check for the existence of each screen.
      const hasTenScreen = ( _.find( screens, screen => screen instanceof TenScreen ) !== undefined );
      const hasTwentyScreen = ( _.find( screens, screen => screen instanceof TwentyScreen ) !== undefined );
      const hasGameScreen = ( _.find( screens, screen => screen instanceof NumberPlayGameScreen ) !== undefined );
      const hasLabScreen = ( _.find( screens, screen => screen instanceof LabScreen ) !== undefined );

      // Enable controls if a screen that they pertain to is present.
      this.showSecondLocaleControl.enabled = hasTenScreen || hasTwentyScreen;
      subitizeTimePreferencesControl.enabled = hasGameScreen;
      this.showLabOnesControl.enabled = hasLabScreen;
    }
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'NumberPlayPreferencesNode', NumberPlayPreferencesNode );