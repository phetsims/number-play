// Copyright 2019-2023, University of Colorado Boulder

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
import NumberSuiteCommonAccordionBox, { NumberSuiteCommonAccordionBoxOptions } from '../../../../number-suite-common/js/common/view/NumberSuiteCommonAccordionBox.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import numberPlayPreferences from '../model/numberPlayPreferences.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import NumberSuiteCommonConstants from '../../../../number-suite-common/js/common/NumberSuiteCommonConstants.js';
import localeInfoModule from '../../../../chipper/js/data/localeInfoModule.js';
import { Locale } from '../../../../joist/js/i18n/localeProperty.js';

// types
type SelfOptions = {
  textOffsetX: number;
  font: Font;
};
export type WordAccordionBoxOptions = SelfOptions &
  StrictOmit<NumberSuiteCommonAccordionBoxOptions, 'titleStringProperty'>;

// constants
const TEXT_MARGIN = 5;

// how much to change the height by when the localeSwitch is shown or hidden
const HEIGHT_ADJUSTMENT = 24;

class WordAccordionBox extends NumberSuiteCommonAccordionBox {

  public constructor( currentNumberProperty: TReadOnlyProperty<number>, isPrimaryLocaleProperty: Property<boolean>,
                      secondLocaleProperty: TReadOnlyProperty<Locale>, height: number, providedOptions: WordAccordionBoxOptions ) {

    const titleStringProperty = new DerivedProperty(
      [ phet.joist.localeProperty, secondLocaleProperty, isPrimaryLocaleProperty,
        NumberPlayStrings.wordStringProperty, NumberPlayStrings.wordLanguageStringProperty ],
      ( primaryLocale: Locale, secondLocale: Locale, isPrimaryLocale ) => {
        const primaryLocaleTitleString = StringUtils.fillIn( NumberPlayStrings.wordStringProperty.value, {
          language: localeInfoModule[ primaryLocale ].localizedName
        } );
        const secondaryLocaleTitleString = StringUtils.fillIn( NumberPlayStrings.wordLanguageStringProperty.value, {
          language: localeInfoModule[ secondLocale ].localizedName
        } );

        return isPrimaryLocale ? primaryLocaleTitleString : secondaryLocaleTitleString;
      } );

    const options = optionize<WordAccordionBoxOptions, SelfOptions, NumberSuiteCommonAccordionBoxOptions>()( {
      titleStringProperty: titleStringProperty,
      titleTextOptions: {
        maxWidth: NumberPlayConstants.UPPER_OUTER_AB_TITLE_MAX_WIDTH
      }
    }, providedOptions );

    // TODO: This is giving weird results... https://github.com/phetsims/number-play/issues/200
    const heightProperty = new DerivedProperty( [ numberPlayPreferences.showSecondLocaleProperty ], showSecondLocale => {
      const shortHeight = height - HEIGHT_ADJUSTMENT;
      return showSecondLocale ? shortHeight : height;
    } );

    super( NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH, heightProperty, options );

    // The word shown in the accordion box
    const wordStringProperty = new DerivedProperty(
      [ currentNumberProperty, isPrimaryLocaleProperty, numberPlayPreferences.secondLocaleStringsProperty ],
      ( currentNumber, isPrimaryLocale, secondLocaleStrings ) =>
        NumberSuiteCommonConstants.numberToWord( secondLocaleStrings, currentNumber, isPrimaryLocale )
    );

    // initialize as blank, updated in link below
    const wordText = new Text( wordStringProperty, {
      font: options.font,
      maxWidth: this.contentBoundsProperty.value.width - options.textOffsetX - TEXT_MARGIN
    } );
    this.contentNode.addChild( wordText );

    this.contentBoundsProperty.link( contentBounds => {
      wordText.left = contentBounds.left + options.textOffsetX;
      wordText.centerY = contentBounds.centerY;
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'WordAccordionBox', WordAccordionBox );
export default WordAccordionBox;