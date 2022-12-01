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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

class NumberSuiteCommonSpeechSynthesisAnnouncer extends SpeechSynthesisAnnouncer {

  private readonly updateVoiceListener: ( () => void ) | null;
  private readonly secondLocaleProperty: TReadOnlyProperty<string>;
  public readonly primaryLocaleVoiceEnabledProperty: TReadOnlyProperty<boolean>;
  public readonly secondaryLocaleVoiceEnabledProperty: TReadOnlyProperty<boolean>;

  public constructor( secondLocaleProperty: TReadOnlyProperty<string> ) {
    super();

    this.updateVoiceListener = () => this.updateVoice();
    this.secondLocaleProperty = secondLocaleProperty;

    this.primaryLocaleVoiceEnabledProperty = new DerivedProperty( [ phet.joist.localeProperty, this.voiceProperty ],
      ( locale: string ) => this.testVoiceForLocale( locale ) );

    this.secondaryLocaleVoiceEnabledProperty = new DerivedProperty( [ secondLocaleProperty, this.voiceProperty ],
      locale => this.testVoiceForLocale( locale ) );

    // Voices may not be available on load or the list of voices may change - update if we get an indication that
    // the list of available voices has changed.
    this.voicesProperty.lazyLink( this.updateVoiceListener );
  }

  /**
   * Given if we should use the primary or secondary locale, set the voice of that locale.
   */
  public updateVoice( isPrimaryLocale = true ): void {

    const locale = isPrimaryLocale ? phet.joist.localeProperty.value : this.secondLocaleProperty.value;
    assert && assert( locale, `locale does not exist: ${locale}` );

    // in case we don't have any voices yet, wait until the voicesProperty is populated
    if ( this.voicesProperty.value.length > 0 ) {

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
    }
  }

  /**
   * Given a locale, see if a voice is available for speech synthesis in the same locale.
   */
  public testVoiceForLocale( locale: string ): boolean {
    let isVoiceFound = false;

    if ( this.voicesProperty.value.length > 0 ) {

      const translatedVoices = _.filter( this.getPrioritizedVoices(), voice => {
        return voice.lang.includes( locale );
      } );
      if ( translatedVoices.length ) {
        isVoiceFound = true;
      }
    }

    return isVoiceFound;
  }
}

numberPlay.register( 'NumberSuiteCommonSpeechSynthesisAnnouncer', NumberSuiteCommonSpeechSynthesisAnnouncer );
export default NumberSuiteCommonSpeechSynthesisAnnouncer;
