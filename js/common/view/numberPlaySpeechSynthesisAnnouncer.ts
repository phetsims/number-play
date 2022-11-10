// Copyright 2022, University of Colorado Boulder

/**
 * An Announcer for speech synthesis that can be used with an UtteranceQueue. Used in Number Play, see
 * NumberSuiteCommonSpeechSynthesisAnnouncer for implementation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import numberPlay from '../../numberPlay.js';
import NumberSuiteCommonSpeechSynthesisAnnouncer from './NumberSuiteCommonSpeechSynthesisAnnouncer.js';
import numberPlayPreferences from '../model/numberPlayPreferences.js';

const numberPlaySpeechSynthesisAnnouncer =
  new NumberSuiteCommonSpeechSynthesisAnnouncer( numberPlayPreferences.secondLocaleProperty );

numberPlay.register( 'numberPlaySpeechSynthesisAnnouncer', numberPlaySpeechSynthesisAnnouncer );
export default numberPlaySpeechSynthesisAnnouncer;