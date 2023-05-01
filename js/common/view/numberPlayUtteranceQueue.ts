// Copyright 2022-2023, University of Colorado Boulder

/**
 * A singleton UtteranceQueue that is used for voicing specific to Number Play. This is needed because Number Play
 * doesn't have the Voicing feature, but still needs to use speech synthesis.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import numberPlay from '../../numberPlay.js';
import numberPlaySpeechSynthesisAnnouncer from './numberPlaySpeechSynthesisAnnouncer.js';
import NumberSuiteCommonUtteranceQueue from '../../../../number-suite-common/js/common/view/NumberSuiteCommonUtteranceQueue.js';
import TenScreen from '../../ten/TenScreen.js';
import TwentyScreen from '../../twenty/TwentyScreen.js';
import numberPlayPreferences from '../model/numberPlayPreferences.js';
import TProperty from '../../../../axon/js/TProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { AnyScreen } from '../../../../joist/js/Screen.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';

class NumberPlayUtteranceQueue extends NumberSuiteCommonUtteranceQueue {

  // Data from the 'Ten' screen that can be spoken to the user. Should be updated in the screen's model.
  public readonly tenScreenSpeechDataProperty: TProperty<string>;

  // Data from the 'Twenty' screen that can be spoken to the user. Should be updated in the screen's model.
  public readonly twentyScreenSpeechDataProperty: TProperty<string>;

  public constructor() {
    super(
      numberPlaySpeechSynthesisAnnouncer,
      numberPlayPreferences.isPrimaryLocaleProperty,
      numberPlayPreferences.primaryVoiceProperty,
      numberPlayPreferences.secondVoiceProperty,
      numberPlayPreferences.autoHearEnabledProperty
    );

    this.tenScreenSpeechDataProperty = new StringProperty( '' );
    this.twentyScreenSpeechDataProperty = new StringProperty( '' );
  }

  /**
   * Starts the initialization process by using the provided selectedScreenProperty to determine which speechData
   * to use for a given screen that the user is viewing. This is needed because selectedScreenProperty doesn't exist
   * yet during the creation of this singleton.
   */
  public initialize( selectedScreenProperty: TReadOnlyProperty<AnyScreen> ): void {

    const speechDataProperty = new DerivedProperty(
      [ this.tenScreenSpeechDataProperty, this.twentyScreenSpeechDataProperty, selectedScreenProperty ],
      ( tenScreenSpeechData, twentyScreenSpeechData, selectedScreen ) => {

        // We want the speech data to reflect the selected screen. Returns null for screens that do not support speech
        // synthesis.
        return selectedScreen instanceof TenScreen ? tenScreenSpeechData :
               selectedScreen instanceof TwentyScreen ? twentyScreenSpeechData : null;
      } );

    // Notify listeners on speechDataProperty so if autoHear is turned on, the data is spoken whenever the selected
    // screen changes. The DerivedProperty above covers most, but not all, cases when changing screens. See https://github.com/phetsims/number-play/issues/217.
    selectedScreenProperty.lazyLink( () => {
      speechDataProperty.value && speechDataProperty.notifyListenersStatic();
    } );

    this.initializeNumberSuiteCommonUtteranceQueue( speechDataProperty );
  }
}

const numberPlayUtteranceQueue = new NumberPlayUtteranceQueue();

numberPlay.register( 'numberPlayUtteranceQueue', numberPlayUtteranceQueue );
export default numberPlayUtteranceQueue;
