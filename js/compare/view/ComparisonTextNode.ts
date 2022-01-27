// Copyright 2021-2022, University of Colorado Boulder

/**
 * Text for displaying a comparison statement for the two current numbers.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

class ComparisonTextNode extends Node {
  public readonly comparisonStringProperty: IReadOnlyProperty<string>

  constructor( leftCurrentNumberProperty: NumberProperty,
               rightCurrentNumberProperty: NumberProperty,
               isPrimaryLocaleProperty: BooleanProperty,
               layoutBounds: Bounds2 ) {
    super();

    // (read-only) - update the comparison string when either current number changes.
    // this string value is stored in a Property (instead of just setting the text directly) so it can be read
    // elsewhere in the screen view.
    this.comparisonStringProperty = new DerivedProperty(
      [ leftCurrentNumberProperty, rightCurrentNumberProperty, isPrimaryLocaleProperty ],
      ( leftCurrentNumber: number, rightCurrentNumber: number, isPrimaryLocale: boolean ) =>
        ComparisonTextNode.getComparisonString( leftCurrentNumber, rightCurrentNumber, isPrimaryLocale ) );

    // create and add the comparison text
    const textNode = new Text(
      this.comparisonStringProperty.value, {
        font: new PhetFont( 16 ),
        maxWidth: layoutBounds.erodedX( NumberPlayConstants.ACCORDION_BOX_MARGIN_X ).width
      } );
    this.addChild( textNode );

    // update the comparison text when the comparison string changes and center our position
    this.comparisonStringProperty.link( comparisonString => {
      textNode.text = comparisonString;
      this.centerX = layoutBounds.centerX;
    } );
  }

  /**
   * Builds the string based on the current numbers. Example format: "Three is less than seven"
   */
  private static getComparisonString( leftCurrentNumber: number, rightCurrentNumber: number,
                                      isPrimaryLocale: boolean ): string {

    let isLessThanString = numberPlayStrings.isLessThan;
    let isMoreThanString = numberPlayStrings.isMoreThan;
    let isEqualToString = numberPlayStrings.isEqualTo;

    const secondLocaleStrings = phet.numberPlay.secondLocaleStrings;
    if ( secondLocaleStrings && !isPrimaryLocale ) {
      const numberPlayPrefix = 'NUMBER_PLAY/';
      isLessThanString = secondLocaleStrings[ `${numberPlayPrefix}isLessThan` ];
      isMoreThanString = secondLocaleStrings[ `${numberPlayPrefix}isMoreThan` ];
      isEqualToString = secondLocaleStrings[ `${numberPlayPrefix}isEqualTo` ];
    }

    const leftNumberString = NumberPlayConstants.numberToString( leftCurrentNumber, isPrimaryLocale );
    const rightNumberString = NumberPlayConstants.numberToString( rightCurrentNumber, isPrimaryLocale );
    let comparisonString;

    if ( leftCurrentNumber < rightCurrentNumber ) {
      comparisonString = StringUtils.fillIn( isLessThanString, {
        smallerNumber: leftNumberString,
        greaterNumber: rightNumberString
      } );
    }
    else if ( leftCurrentNumber > rightCurrentNumber ) {
      comparisonString = StringUtils.fillIn( isMoreThanString, {
        greaterNumber: leftNumberString,
        smallerNumber: rightNumberString
      } );
    }
    else {
      comparisonString = StringUtils.fillIn( isEqualToString, {
        equalNumberLeft: leftNumberString,
        equalNumberRight: rightNumberString
      } );
    }

    // TODO: Fix hidden characters?!? See https://github.com/phetsims/number-play/issues/31
    if ( !assert ) {
      comparisonString = comparisonString.slice( 2 );
    }

    return StringUtils.capitalize( comparisonString );
  }
}

numberPlay.register( 'ComparisonTextNode', ComparisonTextNode );
export default ComparisonTextNode;