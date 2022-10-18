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

import SpeechSynthesisAnnouncer, { SpeechSynthesisInitializeOptions } from '../../../../utterance-queue/js/SpeechSynthesisAnnouncer.js';
import numberPlay from '../../numberPlay.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import numberPlayPreferences from '../model/numberPlayPreferences.js';

type NumberPlaySpeechSynthesisInitializeOptions = SpeechSynthesisInitializeOptions;

class NumberPlaySpeechSynthesisAnnouncer extends SpeechSynthesisAnnouncer {

  private updateVoiceListener: ( () => void ) | null;

  public constructor() {
    super();

    this.updateVoiceListener = null;
  }

  public override initialize( userGestureEmitter: TEmitter, options: NumberPlaySpeechSynthesisInitializeOptions ): void {
    super.initialize( userGestureEmitter, options );

    // Voices may not be available on load or the list of voices may change - update if we get an indication that
    // the list of available voices has changed.
    this.updateVoiceListener = this.updateVoice.bind( this );
    this.voicesChangedEmitter.addListener( this.updateVoiceListener );
  }

  public updateVoice( isPrimaryLocale = true ): void {
    assert && assert( this.initialized, 'must be initialized before updating voice' );

    const locale = isPrimaryLocale ? phet.joist.localeProperty.value : numberPlayPreferences.secondLocaleProperty.value;
    assert && assert( locale, `locale does not exist: ${locale}` );

    // in case we don't have any voices yet, wait until the voicesChangedEmitter sends an event
    if ( this.voices.length > 0 ) {

      const translatedVoices = _.filter( this.getPrioritizedVoices(), voice => {
        return voice.lang.includes( locale );
      } );
      if ( translatedVoices.length ) {
        const translatedVoice = translatedVoices[ 0 ];
        this.voiceProperty.set( translatedVoice );
      }
      else {
        // console.log( `No voices found for locale: ${locale}` );
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
