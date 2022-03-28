// Copyright 2021-2022, University of Colorado Boulder

/**
 * RectangularRadioButtonGroup for selecting the CompareCountingType on the 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Range from '../../../../dot/js/Range.js';
import { Path } from '../../../../scenery/js/imports.js';
import { Color } from '../../../../scenery/js/imports.js';
import eyeSlashSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSlashSolidShape.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import numberPlay from '../../numberPlay.js';
import CompareCountingType from '../model/CompareCountingType.js';
import BlockValuesNode from './BlockValuesNode.js';
import CompareNumberLineNode from './CompareNumberLineNode.js';

// constants
const ICON_SIZE = 32; // the width and height of the icons used for the buttons, in screen coordinates
const BUTTON_X_MARGIN = 7; // in screen coordinates

class CompareCountingTypeRadioButtonGroup extends RectangularRadioButtonGroup<CompareCountingType> {

  constructor( countingTypeProperty: EnumerationProperty<CompareCountingType> ) {

    // create a map from each CompareCountingType to a corresponding icon
    const countingTypeToNode = {};
    // @ts-ignore TODO-TS: How to index objects with new enum patter?
    countingTypeToNode[ CompareCountingType.BLOCKS ] = BlockValuesNode.getBlockValuesNode( 1, 2 );
    // @ts-ignore
    countingTypeToNode[ CompareCountingType.NUMBER_LINE ] = CompareNumberLineNode.getNumberLineNode(
      20,
      new Range( 0, 5 ), {
        includeLabels: false,
        minorLineWidth: 2, // empirically determined
        majorLineWidth: 4, // empirically determined
        minorTickMarkHalfLineLength: 11, // empirically determined
        majorTickMarkHalfLineLength: 32 // empirically determined
      } );
    // @ts-ignore
    countingTypeToNode[ CompareCountingType.NONE ] = new Path( eyeSlashSolidShape, { fill: Color.BLACK } );

    // create an icon for each value of CompareCountingType
    const countingTypeRadioButtons = CompareCountingType.enumeration.values.map( countingType => {
      // @ts-ignore
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