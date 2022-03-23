// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for the 'Total' accordion box, which is the panel in the top center of the sim that displays a numerical
 * representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { Font, HBox, VBox } from '../../../../scenery/js/imports.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import NumberPlayAccordionBox, { NumberPlayAccordionBoxOptions } from './NumberPlayAccordionBox.js';
import optionize from '../../../../phet-core/js/optionize.js';

// types
type TotalAccordionBoxSelfOptions = {
  font: Font;
  arrowButtonOptions: Object; // TODO-TS: should be ArrowButtonOptions
  arrowButtonSpacing: number;
};
export type TotalAccordionBoxOptions = TotalAccordionBoxSelfOptions & NumberPlayAccordionBoxOptions;

class TotalAccordionBox extends NumberPlayAccordionBox {

  constructor( currentNumberProperty: NumberProperty, height: number, options: TotalAccordionBoxOptions ) {

    super( NumberPlayConstants.TOTAL_ACCORDION_BOX_WIDTH, height,
      optionize<TotalAccordionBoxOptions, TotalAccordionBoxSelfOptions, NumberPlayAccordionBoxOptions>( {
        titleString: numberPlayStrings.total,
        titleMaxWidth: 142
      }, options ) );

    // create the NumberDisplay, which is a numerical representation of the current number. always format for numbers
    // up to twenty so the display looks consistent across screens.
    const numberDisplay = new NumberDisplay( currentNumberProperty, new Range( 0, NumberPlayConstants.TWENTY ), {
      decimalPlaces: 0,
      align: 'right',
      noValueAlign: 'left',
      textOptions: {
        font: options.font
      },
      backgroundFill: null,
      backgroundStroke: null
    } );

    // create the arrow buttons, which change the value of currentNumberProperty by -1 or +1
    const upArrowButton = new ArrowButton( 'up', () => {
      currentNumberProperty.value = Math.min( currentNumberProperty.range!.max, currentNumberProperty.value + 1 );
    }, options.arrowButtonOptions );
    const downArrowButton = new ArrowButton( 'down', () => {
      currentNumberProperty.value = Math.max( currentNumberProperty.range!.min, currentNumberProperty.value - 1 );
    }, options.arrowButtonOptions );
    const arrowButtons = new VBox( {
      children: [ upArrowButton, downArrowButton ],
      spacing: options.arrowButtonSpacing
    } );

    // disable the arrow buttons when the currentNumberProperty value is at its min or max range
    const currentNumberPropertyObserver = ( currentNumber: number ) => {
      upArrowButton.enabled = currentNumber !== currentNumberProperty.range!.max;
      downArrowButton.enabled = currentNumber !== currentNumberProperty.range!.min;
    };
    currentNumberProperty.link( currentNumberPropertyObserver );

    // arrange and add the number display and arrow buttons
    const numberControl = new HBox( { children: [ numberDisplay, arrowButtons ] } );
    numberControl.center = this.contentBounds.center;
    this.contentNode.addChild( numberControl );
  }
}

numberPlay.register( 'TotalAccordionBox', TotalAccordionBox );
export default TotalAccordionBox;