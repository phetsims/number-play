// Copyright 2021, University of Colorado Boulder

/**
 * Text for displaying a comparison statement for the two current numbers.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';

// strings
const isLessThanString = numberPlayStrings.isLessThan;
const isMoreThanString = numberPlayStrings.isMoreThan;
const isEqualToString = numberPlayStrings.isEqualTo;

class ComparisonTextNode extends Node {

  /**
   * @param {NumberProperty} leftCurrentNumberProperty
   * @param {NumberProperty} rightCurrentNumberProperty
   * @param {Bounds2} layoutBounds
   */
  constructor( leftCurrentNumberProperty, rightCurrentNumberProperty, layoutBounds ) {
    super();

    /**
     * Concatenates the string based on the current numbers. Example format: "Three is less than seven"
     *
     * @param {number} leftCurrentNumber
     * @param {number} rightCurrentNumber
     * @private
     */
    const getComparisonString = ( leftCurrentNumber, rightCurrentNumber ) => {
      const leftNumberString = _.capitalize( NumberPlayConstants.NUMBER_TO_STRING[ leftCurrentNumber ] );
      const comparisonString = leftCurrentNumber < rightCurrentNumber ? isLessThanString :
                               leftCurrentNumber > rightCurrentNumber ? isMoreThanString : isEqualToString;
      const rightNumberString = NumberPlayConstants.NUMBER_TO_STRING[ rightCurrentNumber ];
      return `${leftNumberString} ${comparisonString} ${rightNumberString}.`;
    };

    // @public (read-only) {DerivedProperty.<string>} - update the comparison string when either current number changes.
    // this string value is stored in a Property (instead of just setting the text directly) so it can be read
    // elsewhere in the screen view.
    this.comparisonStringProperty = new DerivedProperty( [ leftCurrentNumberProperty, rightCurrentNumberProperty ],
      ( leftCurrentNumber, rightCurrentNumber ) => getComparisonString( leftCurrentNumber, rightCurrentNumber ) );

    // create and add the comparison text
    const textNode = new Text(
      this.comparisonStringProperty.value, {
        font: new PhetFont( 16 ),
        maxWidth: layoutBounds.erodedX( NumberPlayConstants.ACCORDION_BOX_X_MARGIN ).width
      } );
    this.addChild( textNode );

    // update the comparison text when the comparison string changes and center our position
    this.comparisonStringProperty.link( comparisonString => {
      textNode.text = comparisonString;
      this.centerX = layoutBounds.centerX;
    } );
  }
}

numberPlay.register( 'ComparisonTextNode', ComparisonTextNode );
export default ComparisonTextNode;