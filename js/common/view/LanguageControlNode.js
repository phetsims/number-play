// Copyright 2021, University of Colorado Boulder

/**
 * A toggle switch with labels for either state for choosing one locale or another.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import OnOffSwitch from '../../../../sun/js/OnOffSwitch.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';

// strings
const englishString = numberPlayStrings.english;
const spanishString = numberPlayStrings.spanish;

class LanguageControlNode extends Node {

  /**
   */
  constructor() {
    super();

    // TODO: this will likely eventually be moved out of this type once it is in use, see https://github.com/phetsims/number-play/issues/31
    const secondLocaleProperty = new BooleanProperty( phet.joist.sim.locale === 'es' );

    // create and add the toggle switch
    const onOffSwitch = new OnOffSwitch( secondLocaleProperty, {
      size: new Dimension2( 40, 20 ),
      trackFillLeft: 'lightgray',
      trackFillRight: 'lightgray',
      center: Vector2.ZERO
    } );
    this.addChild( onOffSwitch );

    // create the labels for the toggle switch
    const labelOptions = { font: new PhetFont( 14 ) };
    const englishText = new Text( englishString, labelOptions );
    const spanishText = new Text( spanishString, labelOptions );

    // position and add the labels
    const labelXMargin = 8;
    englishText.right = onOffSwitch.left - labelXMargin;
    englishText.centerY = onOffSwitch.centerY;
    spanishText.left = onOffSwitch.right + labelXMargin;
    spanishText.centerY = englishText.centerY;
    this.addChild( englishText );
    this.addChild( spanishText );
  }
}

numberPlay.register( 'LanguageControlNode', LanguageControlNode );
export default LanguageControlNode;