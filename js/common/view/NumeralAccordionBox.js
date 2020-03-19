// Copyright 2019-2020, University of Colorado Boulder

/**
 * Class for the 'Numeral' accordion box, which is the panel in the top center of the sim that displays a numerical
 * representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import numberPlayStrings from '../../number-play-strings.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';

const numeralString = numberPlayStrings.numeral;

class NumeralAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} currentNumberProperty
   * @param {number} height - the height of this accordion box
   * @param {Object} config
   */
  constructor( currentNumberProperty, height, config ) {

    config = merge( {
      titleNode: new Text( numeralString, { font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT } ),
      minWidth: NumberPlayConstants.NUMERAL_ACCORDION_BOX_WIDTH,
      maxWidth: NumberPlayConstants.NUMERAL_ACCORDION_BOX_WIDTH,

      font: null, // {Font} @required - font of the displayed string value
      arrowButtonConfig: {
        arrowWidth: null, // {number} @required
        arrowHeight: null, // {number} @required
        spacing: null // {number} @required
      }
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, config );

    assert && assert( config.font, 'font is required' );
    assert && assert( config.arrowButtonConfig.arrowWidth, 'arrowWidth is required' );
    assert && assert( config.arrowButtonConfig.arrowHeight, 'arrowHeight is required' );
    assert && assert( config.arrowButtonConfig.spacing, 'spacing is required' );

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

numberPlay.register( 'NumeralAccordionBox', NumeralAccordionBox );
export default NumeralAccordionBox;