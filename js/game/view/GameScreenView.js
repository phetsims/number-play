// Copyright 2019, University of Colorado Boulder

/**
 * ScreenView for the 'Game' screen.
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
  const gameScreenPlaceholderImage = require( 'image!NUMBER_PLAY/game_screen_placeholder.png' );

  class GameScreenView extends ScreenView {

    /**
     * @param {GameModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super( {
        tandem: tandem
      } );

      // add the screen's placeholder image
      const gameScreenPlaceholderImageNode = new Image( gameScreenPlaceholderImage, {
        maxWidth: this.layoutBounds.width,
        maxHeight: this.layoutBounds.height,
        cursor: 'pointer'
      } );
      gameScreenPlaceholderImageNode.center = this.layoutBounds.center;
      this.addChild( gameScreenPlaceholderImageNode );
    }

    /**
     * Resets the view.
     * @public
     */
    reset() {
      //TODO
    }
  }

  return numberPlay.register( 'GameScreenView', GameScreenView );
} );