// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for the 'Word' accordion box, which is the panel in the upper left corner of the sim that displays a written
 * representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Font, Text } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberPlayAccordionBox, { NumberPlayAccordionBoxOptions } from '../../../../number-suite-common/js/common/view/NumberPlayAccordionBox.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import numberPlayPreferences from '../model/numberPlayPreferences.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';

// types
type SelfOptions = {
  textOffsetX: number;
  font: Font;
};
export type WordAccordionBoxOptions = SelfOptions &
  StrictOmit<NumberPlayAccordionBoxOptions, 'titleStringProperty' | 'titleMaxWidth'>;

// constants
const TEXT_MARGIN = 5;

// how much to change the height by when the localeSwitch is shown or hidden
const HEIGHT_ADJUSTMENT = 24;

class WordAccordionBox extends NumberPlayAccordionBox {

  public constructor( currentNumberProperty: TReadOnlyProperty<number>, isPrimaryLocaleProperty: BooleanProperty,
                      height: number, options: WordAccordionBoxOptions ) {

    const titleNode = new Text( NumberPlayStrings.word, {
      font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: NumberPlayConstants.UPPER_OUTER_AB_TITLE_MAX_WIDTH
    } );

    // if the locale switch is included, specify the current language in the title of the accordion box so that users
    // can see the content is changing when the accordion box is closed
    Multilink.multilink( [ phet.joist.localeProperty, numberPlayPreferences.secondLocaleStringsProperty, isPrimaryLocaleProperty ],
      ( ( locale, secondLocaleStrings, isPrimaryLocale ) => {
        // TODO: Duplicated from LocaleSwitch
        const secondLanguageStringKey = `${NumberPlayConstants.NUMBER_PLAY_STRING_KEY_PREFIX}language`;
        const secondLanguageString = secondLocaleStrings[ secondLanguageStringKey ];

        const primaryLocaleTitleString = StringUtils.fillIn( NumberPlayStrings.wordStringProperty.value, {
          language: NumberPlayStrings.language
        } );
        const secondaryLocaleTitleString = StringUtils.fillIn( NumberPlayStrings.wordLanguageStringProperty.value, {
          language: secondLanguageString
        } );

        titleNode.text = isPrimaryLocale ? primaryLocaleTitleString : secondaryLocaleTitleString;
      } ) );

    // TODO: This is giving weird results...
    const heightProperty = new DerivedProperty( [ numberPlayPreferences.showSecondLocaleProperty ], showSecondLocale => {
      const shortHeight = height - HEIGHT_ADJUSTMENT;
      return showSecondLocale ? shortHeight : height;
    } );

    super( NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH, heightProperty,
      optionize<WordAccordionBoxOptions, SelfOptions, NumberPlayAccordionBoxOptions>()( {
        titleNode: titleNode,

        // TODO: The following options are not used because of the titleNode above, but are needed because of an
        // order dependency in NumberPlayAccordionBox, and should be fixed
        titleStringProperty: new Property( '' ),
        titleMaxWidth: NumberPlayConstants.UPPER_OUTER_AB_TITLE_MAX_WIDTH
      }, options ) );

    const wordText = new Text( NumberPlayConstants.NUMBER_TO_STRING[ currentNumberProperty.value ], {
      font: options.font,
      maxWidth: this.contentBoundsProperty.value.width - options.textOffsetX - TEXT_MARGIN
    } );
    this.contentNode.addChild( wordText );

    this.contentBoundsProperty.link( contentBounds => {
      wordText.left = contentBounds.left + options.textOffsetX;
      wordText.centerY = contentBounds.centerY;
    } );

    // update the word if the current number or locale changes
    Multilink.lazyMultilink( [ currentNumberProperty, isPrimaryLocaleProperty ],
      ( currentNumber, isPrimaryLocale ) => {
        wordText.text = NumberPlayConstants.numberToString( numberPlayPreferences.secondLocaleStringsProperty.value,
          currentNumber, isPrimaryLocale );
      } );
  }
}

numberPlay.register( 'WordAccordionBox', WordAccordionBox );
export default WordAccordionBox;