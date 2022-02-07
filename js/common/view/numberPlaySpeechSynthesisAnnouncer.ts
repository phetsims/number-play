// Copyright 2022, University of Colorado Boulder

/**
 * An Announcer for speech synthesis that can be used with an UtteranceQueue. Used in number-play
 * to support speaking numbers either when a "speak" button is pressed or when a value changes
 * with the ?countAloud query parameter.
 *
 * Not usable until initialized after the sim is created. See number-play-main.ts.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import SpeechSynthesisAnnouncer from '../../../../utterance-queue/js/SpeechSynthesisAnnouncer.js';
import numberPlay from '../../numberPlay.js';

class NumberPlaySpeechSynthesisAnnouncer extends SpeechSynthesisAnnouncer {
  constructor() {
    super();
  }
}

const numberPlaySpeechSynthesisAnnouncer = new NumberPlaySpeechSynthesisAnnouncer();

numberPlay.register( 'numberPlaySpeechSynthesisAnnouncer', numberPlaySpeechSynthesisAnnouncer );
export default numberPlaySpeechSynthesisAnnouncer;
