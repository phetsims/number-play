// Copyright 2022-2023, University of Colorado Boulder

/**
 * An Announcer for speech synthesis that can be used with an UtteranceQueue. Used in Number Play, see
 * NumberSuiteCommonSpeechSynthesisAnnouncer for implementation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import numberPlay from '../../numberPlay.js';
import NumberSuiteCommonSpeechSynthesisAnnouncer from '../../../../number-suite-common/js/common/view/NumberSuiteCommonSpeechSynthesisAnnouncer.js';
import numberPlayPreferences from '../model/numberPlayPreferences.js';

const numberPlaySpeechSynthesisAnnouncer = new NumberSuiteCommonSpeechSynthesisAnnouncer(
  numberPlayPreferences.isPrimaryLocaleProperty,
  numberPlayPreferences.secondLocaleProperty,
  numberPlayPreferences.primaryVoiceProperty,
  numberPlayPreferences.secondVoiceProperty
);

numberPlay.register( 'numberPlaySpeechSynthesisAnnouncer', numberPlaySpeechSynthesisAnnouncer );
export default numberPlaySpeechSynthesisAnnouncer;