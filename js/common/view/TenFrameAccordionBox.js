// Copyright 2019, University of Colorado Boulder

/**
 * Class for the 'Ten Frame' accordion box, which is the panel in the upper right corner of the sim that displays a
 * dot-grid representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const merge = require( 'PHET_CORE/merge' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const tenFrameString = require( 'string!NUMBER_PLAY/tenFrame' );

  class TenFrameAccordionBox extends AccordionBox {

    /**
     * @param {NumberProperty} currentNumberProperty
     * @param {ColorDef} fill - the background fill of this accordion box
     */
    constructor( currentNumberProperty, fill ) {

      const options = merge( {
        titleNode: new Text( tenFrameString ),
        fill: fill,
        minWidth: NumberPlayConstants.UPPER_OUTER_PANEL_WIDTH,
        maxWidth: NumberPlayConstants.UPPER_OUTER_PANEL_WIDTH
      }, NumberPlayConstants.ACCORDION_BOX_OPTIONS );

      super( new Text( 'grid dots' ), options );
    }
  }

  return numberPlay.register( 'TenFrameAccordionBox', TenFrameAccordionBox );
} );