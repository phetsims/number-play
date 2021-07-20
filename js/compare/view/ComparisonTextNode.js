// Copyright 2021, University of Colorado Boulder

/**
 * Text for displaying a comparison statement for the two current numbers.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
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
      const leftNumberText = _.capitalize( NumberPlayConstants.NUMBER_TO_STRING[ leftCurrentNumber ] );
      const comparisonText = leftCurrentNumber < rightCurrentNumber ? isLessThanString :
                             leftCurrentNumber > rightCurrentNumber ? isMoreThanString : isEqualToString;
      const rightNumberText = NumberPlayConstants.NUMBER_TO_STRING[ rightCurrentNumber ];
      return `${leftNumberText} ${comparisonText} ${rightNumberText}`;
    };

    // create and add the comparison text
    const textNode = new Text(
      getComparisonString( leftCurrentNumberProperty.value, rightCurrentNumberProperty.value ), {
        font: new PhetFont( 16 )
      } );
    this.addChild( textNode );

    // update the comparison text when either current number changes
    Property.multilink( [ leftCurrentNumberProperty, rightCurrentNumberProperty ],
      ( leftCurrentNumber, rightCurrentNumber ) => {
        textNode.text = getComparisonString( leftCurrentNumber, rightCurrentNumber );
        this.centerX = layoutBounds.centerX;
      } );
  }
}

numberPlay.register( 'ComparisonTextNode', ComparisonTextNode );
export default ComparisonTextNode;