// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for the 'Word' accordion box, which is the panel in the upper left corner of the sim that displays a written
 * representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Font, Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayConstants, { AccordionBoxOptions } from '../NumberPlayConstants.js';
import LocaleSwitch from './LocaleSwitch.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';

// types
export type WordAccordionBoxOptions = {
  textOffset: Vector2,
  localeSwitchOffset: Vector2,
  font: Font
};
type WordAccordionBoxImplementationOptions = AccordionBoxOptions & WordAccordionBoxOptions;

// constants
const CONTENT_MAX_WIDTH = 260; // empirically determined to not shrink the accordion box content

// strings
const wordString = numberPlayStrings.word;

class WordAccordionBox extends AccordionBox {

  constructor( currentNumberProperty: NumberProperty, isPrimaryLocaleProperty: BooleanProperty, height: number,
               providedOptions: WordAccordionBoxOptions ) {

    const options = merge( {
      titleNode: new Text( wordString, {
        font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: NumberPlayConstants.UPPER_OUTER_AB_TITLE_MAX_WIDTH
      } ),
      minWidth: NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH,
      maxWidth: NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, providedOptions ) as WordAccordionBoxImplementationOptions;

    const contentNode = new Rectangle( {
      rectHeight: height,
      rectWidth: CONTENT_MAX_WIDTH
    } );

    const wordText = new Text( NumberPlayConstants.NUMBER_TO_STRING[ currentNumberProperty.value ], {
      font: options.font,
      maxWidth: CONTENT_MAX_WIDTH - options.textOffset.x
    } );
    wordText.left = contentNode.left + options.textOffset.x;
    wordText.centerY = contentNode.centerY + options.textOffset.y;
    contentNode.addChild( wordText );

    // make sure the offset doesn't cause the LocaleSwitch to poke out of either end of the content node when at its max width
    const localeSwitchMaxWidth = CONTENT_MAX_WIDTH - Math.abs( options.localeSwitchOffset.x ) * 2;

    // create and add the LocaleSwitch
    const localeSwitch = new LocaleSwitch( isPrimaryLocaleProperty, localeSwitchMaxWidth );
    localeSwitch.centerX = contentNode.centerX + options.localeSwitchOffset.x;
    localeSwitch.bottom = contentNode.bottom + options.localeSwitchOffset.y;
    localeSwitch.visible = !!phet.numberPlay.secondLocaleStrings;
    contentNode.addChild( localeSwitch );

    super( contentNode, options );

    // update the word if the current number or locale changes
    Property.lazyMultilink( [ currentNumberProperty, isPrimaryLocaleProperty ],
      ( currentNumber: number, isPrimaryLocale: boolean ) => {
        wordText.text = NumberPlayConstants.numberToString( currentNumber, isPrimaryLocale );
      } );
  }
}

numberPlay.register( 'WordAccordionBox', WordAccordionBox );
export default WordAccordionBox;