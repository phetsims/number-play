// Copyright 2021-2022, University of Colorado Boulder

/**
 * A button that speaks out the value of the provided Property. It can read a string or interpret an integer and read
 * the corresponding word.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import SceneryPhetConstants from '../../../../scenery-phet/js/SceneryPhetConstants.js';
import { Color, Path } from '../../../../scenery/js/imports.js';
import bullhornSolidShape from '../../../../sherpa/js/fontawesome-5/bullhornSolidShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import numberPlayUtteranceQueue from './numberPlayUtteranceQueue.js';
import numberPlaySpeechSynthesisAnnouncer from './numberPlaySpeechSynthesisAnnouncer.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberSuiteCommonPreferences from '../model/NumberSuiteCommonPreferences.js';

type SelfOptions = {
  stringProperty?: TReadOnlyProperty<string> | null;

  // Properties to listen to for when to read aloud. On the 'Compare' screen, we can't just listen to the
  // stringProperty, because when the language changes, the stringProperty updates, but shouldn't be read aloud,
  // see https://github.com/phetsims/number-play/issues/157
  numberProperty: TReadOnlyProperty<number>;
  secondNumberProperty?: TReadOnlyProperty<number>;
};
type SpeechSynthesisButtonOptions = SelfOptions;

// constants
const SIDE_LENGTH = SceneryPhetConstants.DEFAULT_BUTTON_RADIUS * 2; // match the size of the ResetAllButton, in screen coords

class SpeechSynthesisButton<T extends NumberSuiteCommonPreferences> extends RectangularPushButton {

  public constructor( isPrimaryLocaleProperty: BooleanProperty, preferences: T, providedOptions?: SpeechSynthesisButtonOptions ) {

    const options = optionize<SpeechSynthesisButtonOptions, SelfOptions>()( {
      stringProperty: null,
      secondNumberProperty: new NumberProperty( 0 )
    }, providedOptions );

    // However, some browsers DO give the voices eagerly and will never emit an event that the list changed so try to
    // set the voice eagerly. Also set up a link so that the voice is changed when the locale changes.
    isPrimaryLocaleProperty.link( isPrimaryLocale => {
      numberPlaySpeechSynthesisAnnouncer.updateVoice( isPrimaryLocale );
    } );

    const speechUtterance = new Utterance();
    const listener = () => {

      // read out a number by integer => word or just read out a string
      speechUtterance.alert = options.stringProperty ? options.stringProperty.value :
                              NumberPlayConstants.numberToString( preferences.secondLocaleStringsProperty.value,
                                options.numberProperty.value, isPrimaryLocaleProperty.value );

      numberPlaySpeechSynthesisAnnouncer.cancelUtterance( speechUtterance );
      numberPlayUtteranceQueue.addToBack( speechUtterance );
    };

    // read numeric numbers aloud if the current number changes (or the second number, on the 'Compare' screen)
    Multilink.lazyMultilink( [ options.numberProperty, options.secondNumberProperty ], () => {
      if ( preferences.readAloudProperty.value ) {
        listener();
      }
    } );

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