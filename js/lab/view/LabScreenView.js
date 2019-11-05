// Copyright 2019, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const ScreenView = require( 'JOIST/ScreenView' );

  // images
  const labScreenPlaceholderImage = require( 'image!NUMBER_PLAY/lab_screen_placeholder.png' );

  class LabScreenView extends ScreenView {

    /**
     * @param {LabModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super( {
        tandem: tandem
      } );

      // add the screen's placeholder image
      const labScreenPlaceholderImageNode = new Image( labScreenPlaceholderImage, {
        maxWidth: this.layoutBounds.width,
        maxHeight: this.layoutBounds.height,
        cursor: 'pointer'
      } );
      labScreenPlaceholderImageNode.center = this.layoutBounds.center;
      this.addChild( labScreenPlaceholderImageNode );
    }

    /**
     * Resets the view.
     * @public
     */
    reset() {
      //TODO
    }
  }

  return numberPlay.register( 'LabScreenView', LabScreenView );
} );