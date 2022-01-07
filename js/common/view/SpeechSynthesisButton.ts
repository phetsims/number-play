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
import { Color, Path, voicingManager } from '../../../../scenery/js/imports.js';
import bullhornSolidShape from '../../../../sherpa/js/fontawesome-5/bullhornSolidShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

// constants
const SIDE_LENGTH = SceneryPhetConstants.DEFAULT_BUTTON_RADIUS * 2; // match the size of the ResetAllButton, in screen coords

class SpeechSynthesisButton extends RectangularPushButton {

  constructor( property: Property<number> | IReadOnlyProperty<string>, readNumber: boolean = false ) {

    // get the locale the sim is running in
    const locale = phet.joist.sim.locale;

    // set the first voice for the desired locale, if available
    const voicesChangedListener = () => {

      // in case we don't have any voices yet, wait until the voicesChangedEmitter sends an event
      if ( voicingManager.voices.length > 0 ) {

        const translatedVoices = _.filter( voicingManager.getPrioritizedVoices(), voice => {
          return voice.lang.includes( locale );
        } );
        if ( translatedVoices.length > 0 ) {
          // @ts-ignore
          voicingManager.voiceProperty.set( translatedVoices[ 0 ] );
        }
        else {
          console.log( `No voices found for locale: ${locale}` );
        }

        voicingManager.voicesChangedEmitter.removeListener( voicesChangedListener );
      }
    };

    // Voices may not be available on load or the list of voices may change - update if we get an indication that
    // the list of available voices has changed
    voicingManager.voicesChangedEmitter.addListener( voicesChangedListener );

    // However, some browsers DO give the voices eagerly and will never emit an event that the list changed so try to
    // set the voice eagerly
    voicesChangedListener();

    const speechUtterance = new Utterance();
    const listener = () => {

      // read out a number by integer => word or just read out a string
      // @ts-ignore
      speechUtterance.alert = readNumber ? NumberPlayConstants.NUMBER_TO_STRING[ property.value ] :
                              property.value;

      voicingManager.speakIgnoringEnabled( speechUtterance );
    };

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