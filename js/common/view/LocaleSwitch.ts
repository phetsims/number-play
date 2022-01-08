// Copyright 2021-2022, University of Colorado Boulder

/**
 * An ABSwitch for choosing the primary or secondary locale.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../scenery/js/imports.js';
import ABSwitch from '../../../../sun/js/ABSwitch.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';

// constants
const AB_SWITCH_OPTIONS = {
  centerOnButton: true,
  enabled: false, // disabled until further design is complete, see https://github.com/phetsims/number-play/issues/31
  xSpacing: 8,
  toggleSwitchOptions: {
    size: new Dimension2( 40, 20 )
  }
};

// strings
const englishString = numberPlayStrings.english;
const spanishString = numberPlayStrings.spanish;

class LocaleSwitch extends ABSwitch {

  constructor( maxWidth: number ) {

    // TODO: this will likely be moved out of this type once it is in use, see https://github.com/phetsims/number-play/issues/31
    const secondLocaleProperty = new BooleanProperty( phet.joist.sim.locale === 'es' );

    // options for the switch text. calculate the maxWidth for each string as half of the available horizontal space
    // without the ToggleSwitch or spacing.
    const switchTextOptions = {
      font: new PhetFont( 14 ),
      maxWidth: ( maxWidth - AB_SWITCH_OPTIONS.toggleSwitchOptions.size.width - AB_SWITCH_OPTIONS.xSpacing * 2 ) * 0.5
    };

    super( secondLocaleProperty,
      false, new Text( englishString, switchTextOptions ),
      true, new Text( spanishString, switchTextOptions ),
      AB_SWITCH_OPTIONS
    );
  }
}

numberPlay.register( 'LocaleSwitch', LocaleSwitch );
export default LocaleSwitch;