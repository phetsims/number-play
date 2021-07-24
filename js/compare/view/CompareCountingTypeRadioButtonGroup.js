// Copyright 2021, University of Colorado Boulder

/**
 * RectangularRadioButtonGroup for selecting the CompareCountingType on the 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import eyeSlashSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSlashSolidShape.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import numberPlay from '../../numberPlay.js';
import CompareCountingType from '../model/CompareCountingType.js';
import BlockValuesNode from './BlockValuesNode.js';
import CompareNumberLineNode from './CompareNumberLineNode.js';

// constants
const ICON_SIZE = 32; // the width and height of the icons used for the buttons, in screen coordinates
const BUTTON_X_MARGIN = 7; // in screen coordinates

class CompareCountingTypeRadioButtonGroup extends RectangularRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<CompareCountingType>}
   */
  constructor( countingTypeProperty ) {

    // create a map from each CompareCountingType to a corresponding icon
    const countingTypeToNode = {};
    countingTypeToNode[ CompareCountingType.BLOCKS ] = BlockValuesNode.getBlockValuesNode( 1, 2, false );
    countingTypeToNode[ CompareCountingType.NUMBER_LINE ] = CompareNumberLineNode.getNumberLineNode(
      new Range( 0, 5 ), {
        includeLabels: false,
        minorLineWidth: 2, // empirically determined
        majorLineWidth: 4, // empirically determined
        minorTickMarkHalfLineLength: 11, // empirically determined
        majorTickMarkHalfLineLength: 32 // empirically determined
      } );
    countingTypeToNode[ CompareCountingType.NONE ] = new Path( eyeSlashSolidShape, { fill: Color.BLACK } );

    // create an icon for each value of CompareCountingType
    const countingTypeRadioButtons = CompareCountingType.VALUES.map( countingType => {
      const iconNode = countingTypeToNode[ countingType ];
      iconNode.maxWidth = ICON_SIZE;
      iconNode.maxHeight = ICON_SIZE;

      return {
        value: countingType,
        node: iconNode
      };
    } );

    super( countingTypeProperty, countingTypeRadioButtons, {
      orientation: 'horizontal',
      baseColor: Color.WHITE,
      buttonContentXMargin: BUTTON_X_MARGIN,
      buttonContentYMargin: BUTTON_X_MARGIN
    } );
  }
}

numberPlay.register( 'CompareCountingTypeRadioButtonGroup', CompareCountingTypeRadioButtonGroup );
export default CompareCountingTypeRadioButtonGroup;