// Copyright 2021-2022, University of Colorado Boulder

/**
 * A button that speaks out the value of the provided Property. It can read a string or interpret an integer and read
 * the corresponding word.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import SceneryPhetConstants from '../../../../scenery-phet/js/SceneryPhetConstants.js';
import { Color, Path } from '../../../../scenery/js/imports.js';
import bullhornSolidShape from '../../../../sherpa/js/fontawesome-5/bullhornSolidShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import NumberPlayQueryParameters from '../NumberPlayQueryParameters.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import numberPlayUtteranceQueue from './numberPlayUtteranceQueue.js';
import numberPlaySpeechSynthesisAnnouncer from './numberPlaySpeechSynthesisAnnouncer.js';

// constants
const SIDE_LENGTH = SceneryPhetConstants.DEFAULT_BUTTON_RADIUS * 2; // match the size of the ResetAllButton, in screen coords

class SpeechSynthesisButton extends RectangularPushButton {

  constructor( textProperty: Property<number> | IReadOnlyProperty<string>,
               isPrimaryLocaleProperty: BooleanProperty,
               readNumber: boolean = false ) {

    // get the locale the sim is running in
    const primaryLocale = phet.joist.sim.locale;
    const secondaryLocale = NumberPlayQueryParameters.secondLocale;

    // set the first voice for the desired locale, if available
    const voicesChangedListener = ( isPrimaryLocale: boolean = true ) => {
      const locale = isPrimaryLocale ? primaryLocale : secondaryLocale;
      assert && assert( locale, `locale does not exist: ${locale}` );

      // in case we don't have any voices yet, wait until the voicesChangedEmitter sends an event
      if ( numberPlaySpeechSynthesisAnnouncer.voices.length > 0 ) {

        const translatedVoices = _.filter( numberPlaySpeechSynthesisAnnouncer.getPrioritizedVoices(), voice => {
          return voice.lang.includes( locale );
        } );
        if ( translatedVoices.length ) {
          const translatedVoice = translatedVoices[ 0 ];

          // @ts-ignore
          numberPlaySpeechSynthesisAnnouncer.voiceProperty.set( translatedVoice );
        }
        else {
          console.log( `No voices found for locale: ${locale}` );
        }

        if ( numberPlaySpeechSynthesisAnnouncer.voicesChangedEmitter.hasListener( voicesChangedListener ) ) {
          numberPlaySpeechSynthesisAnnouncer.voicesChangedEmitter.removeListener( voicesChangedListener );
        }
      }
    };

    // Voices may not be available on load or the list of voices may change - update if we get an indication that
    // the list of available voices has changed
    numberPlaySpeechSynthesisAnnouncer.voicesChangedEmitter.addListener( voicesChangedListener );

    // However, some browsers DO give the voices eagerly and will never emit an event that the list changed so try to
    // set the voice eagerly. Also set up a link so that the voice is changed when the locale changes.
    isPrimaryLocaleProperty.link( isPrimaryLocale => {
      voicesChangedListener( isPrimaryLocale );
    } );

    const speechUtterance = new Utterance();
    const listener = () => {

      // read out a number by integer => word or just read out a string
      // @ts-ignore
      speechUtterance.alert = readNumber ? NumberPlayConstants.numberToString( textProperty.value, isPrimaryLocaleProperty.value ) :
                              textProperty.value;

      numberPlaySpeechSynthesisAnnouncer.cancelUtterance( speechUtterance );

      numberPlayUtteranceQueue.addToBack( speechUtterance );
    };

    // read numeric numbers aloud if the current number changes
    // TODO: Consider moving this elsewhere by factoring out the voicing parts of this file.
    if ( NumberPlayQueryParameters.countAloud && readNumber ) {
      textProperty.lazyLink( () => {
        listener();
      } );
    }

    super( {
      content: new Path( bullhornSolidShape, {
        fill: Color.BLACK
      } ),
      size: new Dimension2( SIDE_LENGTH, SIDE_LENGTH ),
      baseColor: Color.YELLOW,
      listener: listener
    } );
  }
}

numberPlay.register( 'SpeechSynthesisButton', SpeechSynthesisButton );
export default SpeechSynthesisButton;