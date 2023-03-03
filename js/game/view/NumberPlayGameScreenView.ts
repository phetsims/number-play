// Copyright 2021-2023, University of Colorado Boulder

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
import NumberPlayGameLevelNode from './NumberPlayGameLevelNode.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import NumberPlayGameRewardNode from './NumberPlayGameRewardNode.js';
import NumberPlayGameRewardDialog from './NumberPlayGameRewardDialog.js';

// constants
const TRANSITION_OPTIONS = {
  duration: 0.5, // seconds
  targetOptions: {
    easing: Easing.QUADRATIC_IN_OUT
  }
};

class NumberPlayGameScreenView extends ScreenView {

  // store all level nodes in one place for easy iteration
  private readonly levelNodes: Array<NumberPlayGameLevelNode<NumberPlayGameLevel>>;

  private readonly rewardNode: NumberPlayGameRewardNode;

  public constructor( model: NumberPlayGameModel, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    // create the level selection node
    const levelSelectionNode = new NumberPlayGameLevelSelectionNode( model, this.layoutBounds, () => {
      model.reset();
      this.reset();
    } );

    this.rewardNode = new NumberPlayGameRewardNode();

    // Dialog that is displayed when the score reaches the reward value.
    const rewardDialog = new NumberPlayGameRewardDialog( model.levelProperty, this.rewardNode, NumberPlayGameLevel.REWARD_SCORE );

    // create the level nodes for the 'Counting' game
    const countingLevelNodes = model.countingLevels.map( level =>
      new CountingGameLevelNode( level, model.levelProperty, rewardDialog, this.layoutBounds, this.visibleBoundsProperty ) );

    // create the level nodes for the 'Subitize' game
    const subitizeLevelNodes = model.subitizeLevels.map( level =>
      new SubitizeGameLevelNode( level, model.levelProperty, rewardDialog, this.layoutBounds, this.visibleBoundsProperty ) );

    this.levelNodes = [ ...countingLevelNodes, ...subitizeLevelNodes ];

    // create the transitionNode which handles the animated slide transition between levelSelectionNode and a level
    const transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: levelSelectionNode,
      cachedNodes: [ levelSelectionNode, ...this.levelNodes ]
    } );

    // transition between the levelSelectionNode and the selected level when the model changes. if levelProperty has a
    // null value, then no level is selected and levelSelectionNode will be displayed.
    model.levelProperty.lazyLink( level => {
      this.interruptSubtreeInput();

      if ( level ) {
        const selectedLevelNode = _.find( this.levelNodes, levelNode => ( levelNode.level === level ) )!;

        // if navigating to a level that's in an unsolved state, load a new challenge
        if ( !level.isChallengeSolvedProperty.value ) {

          // if the selected level is for the subitize game, load a new challenge by resetting the start sequence
          if ( level instanceof SubitizeGameLevel ) {
            level.subitizer.resetStartSequence();
          }
          else {

            // otherwise load a new challenge the standard way (new challenge directly, with no start sequence)
            selectedLevelNode.newChallenge();
          }
        }

        // transition to the selected level
        transitionNode.slideLeftTo( selectedLevelNode, TRANSITION_OPTIONS );
      }
      else {

        // selected level was null, so transition to levelSelectionNode
        transitionNode.slideRightTo( levelSelectionNode, TRANSITION_OPTIONS );
      }
    } );

    this.addChild( transitionNode );
    this.addChild( this.rewardNode );
  }

  public override step( dt: number ): void {
    this.rewardNode.visible && this.rewardNode.step( dt );
  }

  public reset(): void {
    this.levelNodes.forEach( levelNode => levelNode.reset() );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'NumberPlayGameScreenView', NumberPlayGameScreenView );
export default NumberPlayGameScreenView;