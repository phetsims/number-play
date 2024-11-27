// Copyright 2023, University of Colorado Boulder

/**
 * SubitizeTimeControl is the 'Subitize Time' control in the Preferences dialog.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import PreferencesControl, { PreferencesControlOptions } from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import NumberSuiteCommonConstants from '../../../../number-suite-common/js/common/NumberSuiteCommonConstants.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Font, RichText, Text } from '../../../../scenery/js/imports.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';

type SelfOptions = EmptySelfOptions;

type SubitizeTimeControlOptions = SelfOptions &
  StrictOmit<PreferencesControlOptions, 'labelNode' | 'descriptionNode' | 'controlNode'>;

export default class SubitizeTimeControl extends PreferencesControl {

  public constructor( subitizeTimeShownProperty: NumberProperty, providedOptions?: SubitizeTimeControlOptions ) {

    const labelText = new Text( NumberPlayStrings.subitizeTimeStringProperty,
      PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );

    //TODO https://github.com/phetsims/joist/issues/842 Are these the options we would like to use as constants for a preferences number spinner?
    const spinner = new NumberSpinner( subitizeTimeShownProperty, new Property<Range>( subitizeTimeShownProperty.rangeProperty.value ), {
      arrowsPosition: 'leftRight',
      deltaValue: 0.1,
      numberDisplayOptions: {
        valuePattern: '{{value}} s',
        decimalPlaces: 1,
        align: 'center',
        xMargin: 10,
        yMargin: 3,
        textOptions: {
          font: new Font( { size: NumberSuiteCommonConstants.PREFERENCES_FONT_SIZE } )
        }
      }
    } );

    const descriptionText = new RichText( NumberPlayStrings.subitizeTimeDescriptionStringProperty,
      PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

    super( optionize<SubitizeTimeControlOptions, SelfOptions, PreferencesControlOptions>()( {

      // PreferencesControlOptions
      labelNode: labelText,
      controlNode: spinner,
      descriptionNode: descriptionText
    }, providedOptions ) );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }
}

numberPlay.register( 'SubitizeTimeControl', SubitizeTimeControl );