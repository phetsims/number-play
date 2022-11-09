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
import NumberPlayStrings from '../../NumberPlayStrings.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';

// constants
const AB_SWITCH_OPTIONS = {
  centerOnSwitch: true,
  spacing: 8,
  toggleSwitchOptions: {
    size: new Dimension2( 40, 20 )
  }
};

class LocaleSwitch extends ABSwitch<boolean> {

  public constructor( isPrimaryLocaleProperty: BooleanProperty, showSecondLocaleProperty: TReadOnlyProperty<boolean>,
                      secondLocaleStringsProperty: TReadOnlyProperty<IntentionalAny>, maxWidth: number ) {

    // options for the switch text. calculate the maxWidth for each string as half of the available horizontal space
    // without the ToggleSwitch or spacing.
    const switchTextOptions = {
      font: new PhetFont( 14 ),
      maxWidth: ( maxWidth - AB_SWITCH_OPTIONS.toggleSwitchOptions.size.width - AB_SWITCH_OPTIONS.spacing * 2 ) * 0.5
    };

    const secondLanguageStringKey = `${NumberPlayConstants.NUMBER_PLAY_STRING_KEY_PREFIX}language`;
    const secondLanguageText = new Text( '', switchTextOptions );

    secondLocaleStringsProperty.link( secondLocaleStrings => {
      secondLanguageText.setText( secondLocaleStrings[ secondLanguageStringKey ] );
    } );

    super( isPrimaryLocaleProperty,
      true, new Text( NumberPlayStrings.languageStringProperty, switchTextOptions ),
      false, secondLanguageText,
      AB_SWITCH_OPTIONS
    );

    showSecondLocaleProperty.link( showSecondLocale => {
      this.visible = showSecondLocale;
      if ( !showSecondLocale ) {
        isPrimaryLocaleProperty.value = true;
      }
    } );
  }
}

numberPlay.register( 'LocaleSwitch', LocaleSwitch );
export default LocaleSwitch;