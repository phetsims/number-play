// Copyright 2019-2025, University of Colorado Boulder

/**
 * Class for the 'Word' accordion box, which is the panel in the upper left corner of the sim that displays a written
 * representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Disposable from '../../../../axon/js/Disposable.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import localeProperty, { Locale } from '../../../../joist/js/i18n/localeProperty.js';
import NumberSuiteCommonConstants from '../../../../number-suite-common/js/common/NumberSuiteCommonConstants.js';
import NumberSuiteCommonAccordionBox, { NumberSuiteCommonAccordionBoxOptions } from '../../../../number-suite-common/js/common/view/NumberSuiteCommonAccordionBox.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Font from '../../../../scenery/js/util/Font.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';
import numberPlayPreferences from '../model/numberPlayPreferences.js';
import NumberPlayConstants from '../NumberPlayConstants.js';

// types
type SelfOptions = {
  textOffsetX: number;
  font: Font;
};
export type WordAccordionBoxOptions = SelfOptions &
  StrictOmit<NumberSuiteCommonAccordionBoxOptions, 'titleStringProperty'>;

// constants
const TEXT_MARGIN = 5;

class WordAccordionBox extends NumberSuiteCommonAccordionBox {

  public constructor( currentNumberProperty: TReadOnlyProperty<number>, heightProperty: TReadOnlyProperty<number>, providedOptions: WordAccordionBoxOptions ) {

    const titleStringProperty = new DerivedProperty(
      [ localeProperty, numberPlayPreferences.secondLocaleProperty, numberPlayPreferences.isPrimaryLocaleProperty,
        NumberPlayStrings.wordStringProperty, NumberPlayStrings.wordLanguageStringProperty ],
      ( primaryLocale: Locale, secondLocale: Locale, isPrimaryLocale ) => {
        const primaryLocaleTitleString = StringUtils.fillIn( NumberPlayStrings.wordStringProperty.value, {
          language: StringUtils.localeToLocalizedName( primaryLocale )
        } );
        const secondaryLocaleTitleString = StringUtils.fillIn( NumberPlayStrings.wordLanguageStringProperty.value, {
          language: StringUtils.localeToLocalizedName( secondLocale )
        } );

        return isPrimaryLocale ? primaryLocaleTitleString : secondaryLocaleTitleString;
      } );

    const options = optionize<WordAccordionBoxOptions, SelfOptions, NumberSuiteCommonAccordionBoxOptions>()( {
      titleStringProperty: titleStringProperty,
      titleTextOptions: {
        maxWidth: NumberPlayConstants.UPPER_OUTER_AB_TITLE_MAX_WIDTH
      }
    }, providedOptions );

    super( NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH, heightProperty, options );

    // The word shown in the accordion box
    const wordStringProperty: TReadOnlyProperty<string> = new DynamicProperty( new DerivedProperty(
      [ currentNumberProperty,
        numberPlayPreferences.isPrimaryLocaleProperty,
        numberPlayPreferences.secondLocaleProperty,
        localeProperty
      ],
      ( currentNumber, isPrimaryLocale, secondLocale ) =>
        NumberSuiteCommonConstants.numberToWordProperty( secondLocale, currentNumber, isPrimaryLocale ) ) );

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
    Disposable.assertNotDisposable();
    super.dispose();
  }
}

numberPlay.register( 'WordAccordionBox', WordAccordionBox );
export default WordAccordionBox;