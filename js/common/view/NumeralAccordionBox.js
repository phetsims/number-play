// Copyright 2019, University of Colorado Boulder

/**
 * Class for the 'Numeral' accordion box, which is the panel in the top center of the sim that displays a numerical
 * representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const numeralString = require( 'string!NUMBER_PLAY/numeral' );

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
        font: config.font,
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

  return numberPlay.register( 'NumeralAccordionBox', NumeralAccordionBox );
} );