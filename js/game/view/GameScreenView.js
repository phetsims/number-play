// Copyright 2019-2020, University of Colorado Boulder

/**
 * ScreenView for the 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import gameScreenPlaceholderImage from '../../../images/game_screen_placeholder_png.js';
import numberPlay from '../../numberPlay.js';

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

numberPlay.register( 'GameScreenView', GameScreenView );
export default GameScreenView;