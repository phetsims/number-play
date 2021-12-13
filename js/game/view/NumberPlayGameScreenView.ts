// Copyright 2021, University of Colorado Boulder

/**
 * ScreenView for the 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Easing from '../../../../twixt/js/Easing.js';
import TransitionNode from '../../../../twixt/js/TransitionNode.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameModel from '../model/NumberPlayGameModel.js';
import NumberPlayGameLevelSelectionNode from './NumberPlayGameLevelSelectionNode.js';
import SubitizeGameLevelNode from './SubitizeGameLevelNode.js';
import CountingGameLevelNode from './CountingGameLevelNode.js';

// constants
const TRANSITION_OPTIONS = {
  duration: 0.5, // seconds
  targetOptions: {
    easing: Easing.QUADRATIC_IN_OUT
  }
};

class NumberPlayGameScreenView extends ScreenView {

  private readonly levelNodes: Array<SubitizeGameLevelNode | CountingGameLevelNode>;

  constructor( model: NumberPlayGameModel, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    // create the level selection node
    const levelSelectionNode = new NumberPlayGameLevelSelectionNode( model, this.layoutBounds, () => {
      model.reset();
      this.reset();
    } );

    // create the level nodes for the 'Counting' game
    const countingLevelNodes = model.countingLevels.map( level =>
      new CountingGameLevelNode( level, model.levelProperty, this.layoutBounds, this.visibleBoundsProperty ) );

    // create the level nodes for the 'Subitize' game
    const subitizeLevelNodes = model.subitizeLevels.map( level =>
      new SubitizeGameLevelNode( level, model.levelProperty, this.layoutBounds, this.visibleBoundsProperty ) );

    // store all level nodes in one place for easy iteration
    this.levelNodes = [ ...countingLevelNodes, ...subitizeLevelNodes ];

    // create the transitionNode which handles the animated slide transition between levelSelectionNode and a level
    const transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: levelSelectionNode,
      cachedNodes: [ levelSelectionNode, ...this.levelNodes ]
    } );

    // Transition between the levelSelectionNode and the selected level when the model changes.
    // if levelProperty has a null value, then no level is selected and levelSelectionNode will be displayed.
    model.levelProperty.lazyLink( level => {
      this.interruptSubtreeInput();

      if ( level ) {
        // @ts-ignore TODO-TS See https://github.com/phetsims/number-play/issues/81.
        level.subitizer && level.subitizer.resetStartSequence();

        // Transition to the selected level.
        const selectedLevelNode = _.find( this.levelNodes, levelNode => ( levelNode.level === level ) );
        // @ts-ignore
        transitionNode.slideLeftTo( selectedLevelNode, TRANSITION_OPTIONS );
      }
      else {

        // Selected level was null, so transition to levelSelectionNode.
        transitionNode.slideRightTo( levelSelectionNode, TRANSITION_OPTIONS );
      }
    } );

    this.addChild( transitionNode );
  }

  public reset(): void {
    this.levelNodes.forEach( levelNode => levelNode.reset() );
  }
}

numberPlay.register( 'NumberPlayGameScreenView', NumberPlayGameScreenView );
export default NumberPlayGameScreenView;