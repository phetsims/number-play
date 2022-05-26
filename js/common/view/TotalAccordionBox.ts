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
import Range from '../../../../dot/js/Range.js';
import NumberPlayAccordionBox, { NumberPlayAccordionBoxOptions } from './NumberPlayAccordionBox.js';
import optionize from '../../../../phet-core/js/optionize.js';
import OnesPlayArea from '../model/OnesPlayArea.js';

// types
type SelfOptions = {
  font: Font;
  arrowButtonOptions: Object; // TODO-TS: should be ArrowButtonOptions
  arrowButtonSpacing: number;
};
export type TotalAccordionBoxOptions = SelfOptions & NumberPlayAccordionBoxOptions;

class TotalAccordionBox extends NumberPlayAccordionBox {

  constructor( playArea: OnesPlayArea, height: number, options: TotalAccordionBoxOptions ) {

    super( NumberPlayConstants.TOTAL_ACCORDION_BOX_WIDTH, height,
      optionize<TotalAccordionBoxOptions, SelfOptions, NumberPlayAccordionBoxOptions>()( {
        titleString: numberPlayStrings.total,
        titleMaxWidth: 142
      }, options ) );

    // create the NumberDisplay, which is a numerical representation of the current number. always format for numbers
    // up to twenty so the display looks consistent across screens.
    const numberDisplay = new NumberDisplay( playArea.sumProperty, new Range( 0, NumberPlayConstants.TWENTY ), {
      decimalPlaces: 0,
      align: 'right',
      noValueAlign: 'left',
      textOptions: {
        font: options.font
      },
      backgroundFill: null,
      backgroundStroke: null
    } );

    // create the arrow buttons, which add or remove paper numbers
    const upArrowButton = new ArrowButton( 'up', () => {
      playArea.createPaperNumberFromBucket( {
        shouldAnimate: true,
        value: 1
      } );
    }, options.arrowButtonOptions );
    const downArrowButton = new ArrowButton( 'down', () => {
      playArea.returnPaperNumberToBucket();
    }, options.arrowButtonOptions );
    const arrowButtons = new VBox( {
      children: [ upArrowButton, downArrowButton ],
      spacing: options.arrowButtonSpacing
    } );

    // disable the arrow buttons when the currentNumberProperty value is at its min or max range
    const currentNumberPropertyObserver = ( currentNumber: number ) => {
      assert && assert( playArea.sumProperty.range, 'Range is required for sumProperty in play areas' );
      upArrowButton.enabled = currentNumber !== playArea.sumProperty.range!.max;
      downArrowButton.enabled = currentNumber !== playArea.sumProperty.range!.min;
    };
    playArea.sumProperty.link( currentNumberPropertyObserver );

    // arrange and add the number display and arrow buttons
    const numberControl = new HBox( { children: [ numberDisplay, arrowButtons ] } );
    numberControl.center = this.contentBounds.center;
    this.contentNode.addChild( numberControl );
  }
}

numberPlay.register( 'TotalAccordionBox', TotalAccordionBox );
export default TotalAccordionBox;