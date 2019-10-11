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
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );

  class NumeralAccordionBox extends AccordionBox {

    /**
     * @param {NumberProperty} currentNumberProperty
     * @param {ColorDef} fill - the background fill for this accordion box
     */
    constructor( currentNumberProperty, fill ) {

      const options = merge( {
        fill: fill,
        minWidth: 200
      }, NumberPlayConstants.ACCORDION_BOX_OPTIONS );

      const numberDisplay = new NumberDisplay( currentNumberProperty, currentNumberProperty.range, {
        decimalPlaces: 0,
        align: 'right',
        noValueAlign: 'left',
        font: new PhetFont( 16 ),
        backgroundFill: null,
        backgroundStroke: null,
        maxWidth: 150
      } );

      const contentNode = new HBox( { children: [ numberDisplay ] } );

      super( contentNode, options );
    }
  }

  return numberPlay.register( 'NumeralAccordionBox', NumeralAccordionBox );
} );