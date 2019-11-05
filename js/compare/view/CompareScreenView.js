// Copyright 2019, University of Colorado Boulder

/**
 * ScreenView for the 'Compare' screen.
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
  const compareScreenPlaceholderImage = require( 'image!NUMBER_PLAY/compare_screen_placeholder.png' );

  class CompareScreenView extends ScreenView {

    /**
     * @param {CompareModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super( {
        tandem: tandem
      } );

      // add the screen's placeholder image
      const compareScreenPlaceholderImageNode = new Image( compareScreenPlaceholderImage, {
        maxWidth: this.layoutBounds.width,
        maxHeight: this.layoutBounds.height,
        cursor: 'pointer'
      } );
      compareScreenPlaceholderImageNode.center = this.layoutBounds.center;
      this.addChild( compareScreenPlaceholderImageNode );
    }

    /**
     * Resets the view.
     * @public
     */
    reset() {
      //TODO
    }
  }

  return numberPlay.register( 'CompareScreenView', CompareScreenView );
} );