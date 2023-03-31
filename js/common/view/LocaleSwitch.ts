// Copyright 2021-2023, University of Colorado Boulder

/**
 * An ABSwitch for choosing the primary or secondary locale.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../scenery/js/imports.js';
import ABSwitch from '../../../../sun/js/ABSwitch.js';
import localeProperty from '../../../../joist/js/i18n/localeProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberSuiteCommonPreferences from '../../../../number-suite-common/js/common/model/NumberSuiteCommonPreferences.js';
import NumberSuiteCommonUtteranceQueue from '../../../../number-suite-common/js/common/view/NumberSuiteCommonUtteranceQueue.js';
import numberPlay from '../../numberPlay.js';

// constants
const TOGGLE_SWITCH_SIZE = new Dimension2( 40, 20 );
const SPACING = 8;
const TEXT_OPTIONS = {
  font: new PhetFont( 14 )
};

export default class LocaleSwitch extends ABSwitch<boolean> {

  public constructor(
    preferences: NumberSuiteCommonPreferences,
    utteranceQueue: NumberSuiteCommonUtteranceQueue,
    maxWidth: number
  ) {

    const firstLanguageStringProperty = new DerivedProperty( [ localeProperty ], StringUtils.localeToLocalizedName );

    const secondLanguageStringProperty = new DerivedProperty( [ preferences.secondLocaleProperty ],
      StringUtils.localeToLocalizedName );

    const firstLanguageText = new Text( firstLanguageStringProperty, TEXT_OPTIONS );
    const secondLanguageText = new Text( secondLanguageStringProperty, TEXT_OPTIONS );

    super( preferences.isPrimaryLocaleProperty,
      true, firstLanguageText,
      false, secondLanguageText, {
        spacing: SPACING,
        toggleSwitchOptions: {
          size: TOGGLE_SWITCH_SIZE
        },
        visibleProperty: new DerivedProperty( [ preferences.showSecondLocaleProperty ], showSecondLocale => showSecondLocale )
      }
    );

    // Speak speechData if readAloud is turned on.
    this.onInputEmitter.addListener( () => preferences.readAloudProperty.value && utteranceQueue.speakSpeechData() );

    const availableTextSpace = maxWidth - TOGGLE_SWITCH_SIZE.width - SPACING * 2;
    let isAdjusting = false; // to prevent recursion that will exceed maximum call stack size
    this.boundsProperty.link( () => {
      if ( !isAdjusting ) {
        isAdjusting = true;

        // Assume that neither label needs to be scaled.
        firstLanguageText.maxWidth = null;
        secondLanguageText.maxWidth = null;

        // If there's not enough space for both full-size labels, give each Text label half of the available space.
        if ( firstLanguageText.width + secondLanguageText.width > availableTextSpace ) {
          firstLanguageText.maxWidth = availableTextSpace / 2;
          secondLanguageText.maxWidth = availableTextSpace / 2;
        }
        isAdjusting = false;
      }
    } );
  }
}

numberPlay.register( 'LocaleSwitch', LocaleSwitch );