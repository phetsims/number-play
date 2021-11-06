// Copyright 2021, University of Colorado Boulder

/**
 * NumberPlayGameLevelNode is the base class for a game level view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import InfiniteStatusBar from '../../../../vegas/js/InfiniteStatusBar.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';

class NumberPlayGameLevelNode extends Node {
  statusBar: InfiniteStatusBar;
  level: NumberPlayGameLevel;
  layoutBounds: Bounds2;

  /**
   * @param {NumberPlayGameLevel} level
   * @param {Property.<NumberPlayGameLevel|null>} levelProperty
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty
   */
  constructor( level: NumberPlayGameLevel,
               levelProperty: Property<NumberPlayGameLevel | null>,
               layoutBounds: Bounds2,
               visibleBoundsProperty: Property<Bounds2> ) {
    super();

    // Text displayed in the status bar
    // @ts-ignore TODO-TS, subtype of NumberPlayGameLevel has statusBarMessage??
    const levelDescriptionText = new RichText( level.statusBarMessage, {
      font: new PhetFont( 21 ),
      maxWidth: 650 // determined empirically
    } );

    // @public (read-only) {InfiniteStatusBar} - bar across the top of the screen
    // @ts-ignore
    this.statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionText, level.scoreProperty, {
      floatToTop: false,
      spacing: 20,
      barFill: new Color( 0x8DB3FF ),
      backButtonListener: () => {
        this.interruptSubtreeInput();
        levelProperty.value = null; // back to the level-selection UI
      }
    } );
    // color the back button in the status bar yellow
    // @ts-ignore
    this.statusBar.getChildAt( 1 ).getChildAt( 0 ).baseColor = Color.YELLOW;
    this.addChild( this.statusBar );

    // @public {NumberPlayGameLevel}
    this.level = level;

    // @private {Bounds2}
    this.layoutBounds = layoutBounds;

  }
}

numberPlay.register( 'NumberPlayGameLevelNode', NumberPlayGameLevelNode );
export default NumberPlayGameLevelNode;