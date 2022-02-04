// Copyright 2022, University of Colorado Boulder

/**
 * A singleton UtteranceQueue that is used for voicing specific to Number Play. This is needed because Number Play
 * doesn't have the Voicing feature, but still needs to use speech synthesis.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import UtteranceQueue from '../../../../utterance-queue/js/UtteranceQueue.js';
import { voicingManager } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';

const numberPlayUtteranceQueue = new UtteranceQueue( voicingManager );
// TODO: Use a manager just specific to speech synthesis, not the whole voicingManager, see https://github.com/phetsims/utterance-queue/issues/34
voicingManager.enabledProperty.value = true;

numberPlay.register( 'numberPlayUtteranceQueue', numberPlayUtteranceQueue );
export default numberPlayUtteranceQueue;
