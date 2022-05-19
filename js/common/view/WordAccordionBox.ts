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
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

// types
type WordAccordionBoxSelfOptions = {
  textOffsetX: number;
  font: Font;
};
export type WordAccordionBoxOptions = WordAccordionBoxSelfOptions & NumberPlayAccordionBoxOptions;

// constants
const TEXT_MARGIN = 5;

class WordAccordionBox extends NumberPlayAccordionBox {

  constructor( currentNumberProperty: NumberProperty, showLocaleSwitch: boolean, isPrimaryLocaleProperty: BooleanProperty,
               height: number, options: WordAccordionBoxOptions ) {

    const titleNode = new Text( numberPlayStrings.word, {
      font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: NumberPlayConstants.UPPER_OUTER_AB_TITLE_MAX_WIDTH
    } );

    // if the locale switch is included, specify the current language in the title of the accordion box so that users
    // can see the content is changing when the accordion box is closed
    if ( showLocaleSwitch ) {
      // TODO: Duplicated from LocaleSwitch
      const secondLanguageStringKey = `${NumberPlayConstants.NUMBER_PLAY_STRING_KEY_PREFIX}language`;
      const secondLanguageString = phet.numberPlay.secondLocaleStrings[ secondLanguageStringKey ];

      const primaryLocaleTitleString = StringUtils.fillIn( numberPlayStrings.wordLanguage, {
        language: numberPlayStrings.language
      } );
      const secondaryLocaleTitleString = StringUtils.fillIn( numberPlayStrings.wordLanguage, {
        language: secondLanguageString
      } );

      isPrimaryLocaleProperty.link( isPrimaryLocale => {
        titleNode.text = isPrimaryLocale ? primaryLocaleTitleString : secondaryLocaleTitleString;
      } );
    }

    super( NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH, height,
      optionize<WordAccordionBoxOptions, WordAccordionBoxSelfOptions, NumberPlayAccordionBoxOptions>()( {
        titleNode: titleNode,

        // TODO: The following options are not used because of the titleNode above, but are needed because of an
        // order dependency in NumberPlayAccordionBox, and should be fixed
        titleString: '',
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
      ( currentNumber, isPrimaryLocale ) => {
        wordText.text = NumberPlayConstants.numberToString( currentNumber, isPrimaryLocale );
      } );
  }
}

numberPlay.register( 'WordAccordionBox', WordAccordionBox );
export default WordAccordionBox;