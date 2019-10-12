// Copyright 2019, University of Colorado Boulder

/**
 * Class for the 'Ones' accordion box, which is the panel in the lower left corner of the sim that displays an
 * environment for counting with ones.
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
  const onesString = require( 'string!NUMBER_PLAY/ones' );

  class OnesAccordionBox extends AccordionBox {

    /**
     * @param {NumberProperty} currentNumberProperty
     * @param {number} height - the height of this accordion box
     * @param {Object} [options]
     */
    constructor( currentNumberProperty, height, options ) {

      options = merge( {
        titleNode: new Text( onesString, { font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT } ),
        fill: NumberPlayConstants.PURPLE_BACKGROUND
      }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, options );

      const contentNode = new Rectangle( { rectHeight: height } );

      super( contentNode, options );
    }
  }

  return numberPlay.register( 'OnesAccordionBox', OnesAccordionBox );
} );