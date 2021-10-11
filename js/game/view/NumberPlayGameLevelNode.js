// Copyright 2021, University of Colorado Boulder

/**
 * NumberPlayGameLevelNode is the base class for a game level view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import InfiniteStatusBar from '../../../../vegas/js/InfiniteStatusBar.js';
import numberPlay from '../../numberPlay.js';

class NumberPlayGameLevelNode extends Node {

  /**
   * @param {NumberPlayGameLevel} level
   * @param {Property.<NumberPlayGameLevel>} levelProperty
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty
   */
  constructor( level, levelProperty, layoutBounds, visibleBoundsProperty ) {

    super();

    // Text displayed in the status bar
    const levelDescriptionText = new RichText( level.statusBarMessage, {
      font: new PhetFont( 16 ),
      maxWidth: 650 // determined empirically
    } );

    // Bar across the top of the screen
    const statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionText, level.scoreProperty, {
      floatToTop: false,
      spacing: 20,
      backButtonListener: () => {
        this.interruptSubtreeInput();
        levelProperty.value = null; // back to the level-selection UI
      }
    } );
    this.addChild( statusBar );

    // @public {NumberPlayGameLevel}
    this.level = level;

    // @private {Bounds2}
    this.layoutBounds = layoutBounds;

  }
}

numberPlay.register( 'NumberPlayGameLevelNode', NumberPlayGameLevelNode );
export default NumberPlayGameLevelNode;