// Copyright 2022, University of Colorado Boulder

/**
 * A singleton UtteranceQueue that is used for voicing specific to Number Play. This is needed because Number Play
 * doesn't have the Voicing feature, but still needs to use speech synthesis.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import UtteranceQueue from '../../../../utterance-queue/js/UtteranceQueue.js';
import numberPlay from '../../numberPlay.js';
import numberPlaySpeechSynthesisAnnouncer from './numberPlaySpeechSynthesisAnnouncer.js';

const numberPlayUtteranceQueue = new UtteranceQueue( numberPlaySpeechSynthesisAnnouncer );

numberPlay.register( 'numberPlayUtteranceQueue', numberPlayUtteranceQueue );
export default numberPlayUtteranceQueue;
