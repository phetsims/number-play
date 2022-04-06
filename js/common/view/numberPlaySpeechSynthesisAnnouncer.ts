// Copyright 2022, University of Colorado Boulder

/**
 * An Announcer for speech synthesis that can be used with an UtteranceQueue. Used in number-play
 * to support speaking numbers either when a "speak" button is pressed or when a value changes
 * with the ?readAloud query parameter.
 *
 * Not usable until initialized after the sim is created. See number-play-main.ts.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import SpeechSynthesisAnnouncer from '../../../../utterance-queue/js/SpeechSynthesisAnnouncer.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayQueryParameters from '../NumberPlayQueryParameters.js';
import Emitter from '../../../../axon/js/Emitter.js';

class NumberPlaySpeechSynthesisAnnouncer extends SpeechSynthesisAnnouncer {

  private primaryLocale: string | null;
  private secondaryLocale: string | null;
  private updateVoiceListener: ( () => void ) | null;

  constructor() {
    super();

    this.primaryLocale = null;
    this.secondaryLocale = null;
    this.updateVoiceListener = null;
  }

  override initialize( userGestureEmitter: Emitter, options: Object ): void {
    super.initialize( userGestureEmitter, options );

    // get the locale the sim is running in
    this.primaryLocale = phet.joist.sim.locale!;
    this.secondaryLocale = NumberPlayQueryParameters.secondLocale;

    // Voices may not be available on load or the list of voices may change - update if we get an indication that
    // the list of available voices has changed.
    this.updateVoiceListener = this.updateVoice.bind( this );
    this.voicesChangedEmitter.addListener( this.updateVoiceListener );
  }

  updateVoice( isPrimaryLocale: boolean = true ): void {
    assert && assert( this.initialized, 'must be initialized before updating voice' );

    const locale = isPrimaryLocale ? this.primaryLocale : this.secondaryLocale;
    assert && assert( locale, `locale does not exist: ${locale}` );

    // in case we don't have any voices yet, wait until the voicesChangedEmitter sends an event
    if ( this.voices.length > 0 ) {

      const translatedVoices = _.filter( this.getPrioritizedVoices(), voice => {
        return voice.lang.includes( locale! );
      } );
      if ( translatedVoices.length ) {
        const translatedVoice = translatedVoices[ 0 ];

        // @ts-ignore TODO-TS
        this.voiceProperty.set( translatedVoice );
      }
      else {
        console.log( `No voices found for locale: ${locale}` );
      }

      if ( this.voicesChangedEmitter.hasListener( this.updateVoiceListener! ) ) {
        this.voicesChangedEmitter.removeListener( this.updateVoiceListener! );
      }
    }
  }
}

const numberPlaySpeechSynthesisAnnouncer = new NumberPlaySpeechSynthesisAnnouncer();

numberPlay.register( 'numberPlaySpeechSynthesisAnnouncer', numberPlaySpeechSynthesisAnnouncer );
export default numberPlaySpeechSynthesisAnnouncer;
