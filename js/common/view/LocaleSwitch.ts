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
import NumberPlayConstants from '../NumberPlayConstants.js';

// constants
const AB_SWITCH_OPTIONS = {
  centerOnButton: true,
  xSpacing: 8,
  toggleSwitchOptions: {
    size: new Dimension2( 40, 20 )
  }
};

class LocaleSwitch extends ABSwitch {

  constructor( isPrimaryLocaleProperty: BooleanProperty, maxWidth: number ) {

    // options for the switch text. calculate the maxWidth for each string as half of the available horizontal space
    // without the ToggleSwitch or spacing.
    const switchTextOptions = {
      font: new PhetFont( 14 ),
      maxWidth: ( maxWidth - AB_SWITCH_OPTIONS.toggleSwitchOptions.size.width - AB_SWITCH_OPTIONS.xSpacing * 2 ) * 0.5
    };

    const secondLanguageStringKey = `${NumberPlayConstants.NUMBER_PLAY_STRING_KEY_PREFIX}language`;
    const secondLanguageString = phet.numberPlay.secondLocaleStrings ?
                                 phet.numberPlay.secondLocaleStrings[ secondLanguageStringKey ] : '';

    super( isPrimaryLocaleProperty,
      true, new Text( numberPlayStrings.language, switchTextOptions ),
      false, new Text( secondLanguageString, switchTextOptions ),
      AB_SWITCH_OPTIONS
    );
  }
}

numberPlay.register( 'LocaleSwitch', LocaleSwitch );
export default LocaleSwitch;