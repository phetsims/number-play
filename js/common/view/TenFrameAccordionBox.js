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
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const tenFrameString = require( 'string!NUMBER_PLAY/tenFrame' );

  class TenFrameAccordionBox extends AccordionBox {

    /**
     * @param {NumberProperty} currentNumberProperty
     * @param {number} height - the height of this accordion box
     * @param {Object} [options]
     */
    constructor( currentNumberProperty, height, options ) {

      options = merge( {
        titleNode: new Text( tenFrameString, { font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT } ),
        minWidth: NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH,
        maxWidth: NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH
      }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, options );

      const contentNode = new Rectangle( { rectHeight: height } );

      super( contentNode, options );
    }
  }

  return numberPlay.register( 'TenFrameAccordionBox', TenFrameAccordionBox );
} );