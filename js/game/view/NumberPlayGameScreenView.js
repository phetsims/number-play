// Copyright 2019-2021, University of Colorado Boulder

/**
 * ScreenView for the 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import Easing from '../../../../twixt/js/Easing.js';
import TransitionNode from '../../../../twixt/js/TransitionNode.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevelSelectionNode from './NumberPlayGameLevelSelectionNode.js';
import SubitizeGameLevelNode from './SubitizeGameLevelNode.js';

// constants
const TRANSITION_OPTIONS = {
  duration: 0.5, // seconds
  targetOptions: {
    easing: Easing.QUADRATIC_IN_OUT
  }
};

class NumberPlayGameScreenView extends ScreenView {

  /**
   * @param {NumberPlayGameModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( {
      tandem: tandem
    } );

    // create the levelSelectionNode
    const levelSelectionNode = new NumberPlayGameLevelSelectionNode( model, this.layoutBounds, {
      resetCallback: () => {
        model.reset();
      }
    } );

    // create the levels for the 'Subitize' game
    const levelNodes = model.levels.map( level =>
      new SubitizeGameLevelNode( level, model.levelProperty, this.layoutBounds, this.visibleBoundsProperty ) );

    // create the transitionNode which handles the animated slide transition between levelSelectionNode and a level
    const transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: levelSelectionNode,
      cachedNodes: [ levelSelectionNode, ...levelNodes ]
    } );

    // Transition between levelSelectionNode and the selected level when the model changes.
    // A null value for levelProperty indicates that no level is selected, and levelSelectionNode should be shown.
    model.levelProperty.lazyLink( level => {
      this.interruptSubtreeInput();

      if ( level ) {

        // Transition to the selected level.
        const selectedLevelNode = _.find( levelNodes, levelNode => ( levelNode.level === level ) );
        transitionNode.slideLeftTo( selectedLevelNode, TRANSITION_OPTIONS );
      }
      else {

        // Selected level was null, so transition to levelSelectionNode.
        transitionNode.slideRightTo( levelSelectionNode, TRANSITION_OPTIONS );
      }
    } );

    this.addChild( transitionNode );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }
}

numberPlay.register( 'NumberPlayGameScreenView', NumberPlayGameScreenView );
export default NumberPlayGameScreenView;