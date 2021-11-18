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
import CardinalityGameLevelNode from './CardinalityGameLevelNode.js';

// constants
const TRANSITION_OPTIONS = {
  duration: 0.5, // seconds
  targetOptions: {
    easing: Easing.QUADRATIC_IN_OUT
  }
};

class NumberPlayGameScreenView extends ScreenView {

  private readonly levelNodes: Array<SubitizeGameLevelNode | CardinalityGameLevelNode>;

  constructor( model: NumberPlayGameModel, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    // create the level selection node
    const levelSelectionNode = new NumberPlayGameLevelSelectionNode( model, this.layoutBounds, () => {
      model.reset();
      this.reset();
    } );

    // create the level nodes for the 'Cardinality' game
    const cardinalityLevelNodes = model.cardinalityLevels.map( level =>
      new CardinalityGameLevelNode( level, model.levelProperty, this.layoutBounds, this.visibleBoundsProperty ) );

    // create the level nodes for the 'Subitize' game
    const subitizeLevelNodes = model.subitizeLevels.map( level =>
      new SubitizeGameLevelNode( level, model.levelProperty, this.layoutBounds, this.visibleBoundsProperty ) );

    // store all level nodes in one place for easy iteration
    this.levelNodes = [ ...cardinalityLevelNodes, ...subitizeLevelNodes ];

    // create the transitionNode which handles the animated slide transition between levelSelectionNode and a level
    const transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: levelSelectionNode,
      cachedNodes: [ levelSelectionNode, ...this.levelNodes ]
    } );

    // Transition between levelSelectionNode and the selected level when the model changes.
    // A null value for levelProperty indicates that no level is selected, and levelSelectionNode should be shown.
    model.levelProperty.lazyLink( level => {
      this.interruptSubtreeInput();

      if ( level ) {
        // @ts-ignore TODO-TS
        level.resetStartSequence && level.resetStartSequence();

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

  public reset() {
    this.levelNodes.forEach( levelNode => levelNode.reset() );
  }
}

numberPlay.register( 'NumberPlayGameScreenView', NumberPlayGameScreenView );
export default NumberPlayGameScreenView;