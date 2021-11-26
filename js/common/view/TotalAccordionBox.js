// Copyright 2019-2021, University of Colorado Boulder

/**
 * Class for the 'Total' accordion box, which is the panel in the top center of the sim that displays a numerical
 * representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { HBox } from '../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import { VBox } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';

const totalString = numberPlayStrings.total;

class TotalAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} currentNumberProperty
   * @param {number} height - the height of this accordion box
   * @param {Object} config
   */
  constructor( currentNumberProperty, height, config ) {

    config = merge( {
      titleNode: new Text( totalString, {
        font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: 142 // empirically determined to not shrink accordion box content
      } ),
      minWidth: NumberPlayConstants.TOTAL_ACCORDION_BOX_WIDTH,
      maxWidth: NumberPlayConstants.TOTAL_ACCORDION_BOX_WIDTH,

      font: required( config.font ), // {Font} - font of the displayed string value
      arrowButtonConfig: {
        arrowWidth: required( config.arrowButtonConfig.arrowWidth ), // {number}
        arrowHeight: required( config.arrowButtonConfig.arrowHeight ), // {number}
        spacing: required( config.arrowButtonConfig.spacing ) // {number}
      }
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, config );

    const contentNode = new Rectangle( {
      rectHeight: height
    } );

    // create the NumberDisplay, which is a numerical representation of the current number
    const numberDisplay = new NumberDisplay( currentNumberProperty, currentNumberProperty.range, {
      decimalPlaces: 0,
      align: 'right',
      noValueAlign: 'left',
      textOptions: {
        font: config.font
      },
      backgroundFill: null,
      backgroundStroke: null
    } );

    // create the arrow buttons, which change the value of currentNumberProperty by -1 or +1
    const upArrowButton = new ArrowButton( 'up', () => {
      currentNumberProperty.value = Math.min( currentNumberProperty.range.max, currentNumberProperty.value + 1 );
    }, config.arrowButtonConfig );
    const downArrowButton = new ArrowButton( 'down', () => {
      currentNumberProperty.value = Math.max( currentNumberProperty.range.min, currentNumberProperty.value - 1 );
    }, config.arrowButtonConfig );
    const arrowButtons = new VBox( {
      children: [ upArrowButton, downArrowButton ],
      spacing: config.arrowButtonConfig.spacing
    } );

    // disable the arrow buttons when the currentNumberProperty value is at its min or max range
    const currentNumberPropertyObserver = currentNumber => {
      upArrowButton.enabled = currentNumber !== currentNumberProperty.range.max;
      downArrowButton.enabled = currentNumber !== currentNumberProperty.range.min;
    };
    currentNumberProperty.link( currentNumberPropertyObserver );

    // arrange and add the number display and arrow buttons
    const numberControl = new HBox( { children: [ numberDisplay, arrowButtons ] } );
    numberControl.center = contentNode.center;
    contentNode.addChild( numberControl );

    super( contentNode, config );
  }
}

numberPlay.register( 'TotalAccordionBox', TotalAccordionBox );
export default TotalAccordionBox;