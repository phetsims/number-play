// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for the 'Word' accordion box, which is the panel in the upper left corner of the sim that displays a written
 * representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Font, Text } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import NumberPlayAccordionBox, { NumberPlayAccordionBoxOptions } from './NumberPlayAccordionBox.js';
import optionize from '../../../../phet-core/js/optionize.js';

// types
type WordAccordionBoxSelfOptions = {
  textOffsetX: number;
  font: Font;
};
export type WordAccordionBoxOptions = WordAccordionBoxSelfOptions & NumberPlayAccordionBoxOptions;

// constants
const TEXT_MARGIN = 5;

class WordAccordionBox extends NumberPlayAccordionBox {

  constructor( currentNumberProperty: NumberProperty, isPrimaryLocaleProperty: BooleanProperty, height: number,
               options: WordAccordionBoxOptions ) {

    super( NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH, height,
      optionize<WordAccordionBoxOptions, WordAccordionBoxSelfOptions, NumberPlayAccordionBoxOptions>( {
        titleString: numberPlayStrings.word,
        titleMaxWidth: NumberPlayConstants.UPPER_OUTER_AB_TITLE_MAX_WIDTH
      }, options ) );

    const wordText = new Text( NumberPlayConstants.NUMBER_TO_STRING[ currentNumberProperty.value ], {
      font: options.font,
      maxWidth: this.contentBounds.width - options.textOffsetX - TEXT_MARGIN
    } );
    wordText.left = this.contentBounds.left + options.textOffsetX;
    wordText.centerY = this.contentBounds.centerY;
    this.contentNode.addChild( wordText );

    // update the word if the current number or locale changes
    Property.lazyMultilink( [ currentNumberProperty, isPrimaryLocaleProperty ],
      ( currentNumber: number, isPrimaryLocale: boolean ) => {
        wordText.text = NumberPlayConstants.numberToString( currentNumber, isPrimaryLocale );
      } );
  }
}

numberPlay.register( 'WordAccordionBox', WordAccordionBox );
export default WordAccordionBox;