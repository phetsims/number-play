// Copyright 2021, University of Colorado Boulder

/**
 * SubitizeGameLevelNode is the class for a 'Subitize' game level view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevelNode from './NumberPlayGameLevelNode.js';

class SubitizeGameLevelNode extends NumberPlayGameLevelNode {

  /**
   * @param {SubitizeGameLevel} level
   * @param {Property.<SubitizeGameLevel>} levelProperty
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty
   */
  constructor( level, levelProperty, layoutBounds, visibleBoundsProperty ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty );

  }
}

numberPlay.register( 'SubitizeGameLevelNode', SubitizeGameLevelNode );
export default SubitizeGameLevelNode;