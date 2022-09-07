// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for the 'Total' accordion box, which is the panel in the top center of the sim that displays a numerical
 * representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { HBox, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import ArrowButton, { ArrowButtonOptions } from '../../../../sun/js/buttons/ArrowButton.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import Range from '../../../../dot/js/Range.js';
import NumberPlayAccordionBox, { NumberPlayAccordionBoxOptions } from './NumberPlayAccordionBox.js';
import optionize from '../../../../phet-core/js/optionize.js';
import OnesPlayArea from '../model/OnesPlayArea.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

// types
type SelfOptions = {
  arrowButtonOptions: ArrowButtonOptions;
  arrowButtonSpacing: number;
} & PickRequired<TextOptions, 'font'>;
export type TotalAccordionBoxOptions =
  SelfOptions
  & StrictOmit<NumberPlayAccordionBoxOptions, 'titleString' | 'titleMaxWidth'>;

class TotalAccordionBox extends NumberPlayAccordionBox {

  public constructor( playArea: OnesPlayArea, height: number, options: TotalAccordionBoxOptions ) {

    super( NumberPlayConstants.TOTAL_ACCORDION_BOX_WIDTH, height,
      optionize<TotalAccordionBoxOptions, SelfOptions, NumberPlayAccordionBoxOptions>()( {
        titleString: NumberPlayStrings.total,
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
      // console.log( 'about to add 1 with up arrow in in total accordion box' );
      playArea.createPaperNumberFromBucket( {
        shouldAnimate: true,
        value: 1
      } );
    }, options.arrowButtonOptions );
    const downArrowButton = new ArrowButton( 'down', () => {
      // console.log( 'about to remove 1 with up arrow in in total accordion box' );
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