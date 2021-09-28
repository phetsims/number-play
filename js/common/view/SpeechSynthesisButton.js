// Copyright 2021, University of Colorado Boulder

/**
 * A button that speaks out the value of the provided Property. It can read a string or interpret an integer and read
 * the corresponding word.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import SceneryPhetConstants from '../../../../scenery-phet/js/SceneryPhetConstants.js';
import voicingManager from '../../../../scenery/js/accessibility/voicing/voicingManager.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import bullhornSolidShape from '../../../../sherpa/js/fontawesome-5/bullhornSolidShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';

// constants
const SIDE_LENGTH = SceneryPhetConstants.DEFAULT_BUTTON_RADIUS * 2; // match the size of the ResetAllButton, in screen coords

class SpeechSynthesisButton extends RectangularPushButton {

  /**
   * @param {Property.<String|Number>} property
   * @param {Object} [options]
   */
  constructor( property, options ) {

    options = merge( {
      readNumber: false
    }, options );

    // get the locale the sim is running in
    const locale = phet.joist.sim.locale;

    // set the first voice for the desired locale, if available
    const translatedVoices = _.filter( voicingManager.getPrioritizedVoices(), voice => {
      return voice.lang.includes( locale );
    } );
    if ( translatedVoices.length > 0 ) {
      voicingManager.voiceProperty.set( translatedVoices[ 0 ] );
    }
    else {
      console.log( `No voices found for locale: ${locale}` );
    }

    const speechUtterance = new Utterance();
    const listener = () => {

      // read out a number by integer => word or just read out a string
      speechUtterance.alert = options.readNumber ? NumberPlayConstants.NUMBER_TO_STRING[ property.value ] :
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