// Copyright 2021, University of Colorado Boulder

/**
 * SubitizeGameLevelNode is the class for a 'Subitize' game level view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import numberPlay from '../../numberPlay.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import NumberPlayGameLevelNode from './NumberPlayGameLevelNode.js';
import SubitizerNode from './SubitizerNode.js';
import CountingGameLevel from '../model/CountingGameLevel.js';
import NumberPlayGameAnswerButtons from './NumberPlayGameAnswerButtons.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import SubitizeRevealButton from './SubitizeRevealButton.js';

// constants
const REVEAL_BUTTON_MARGIN = 12; // empirically determined

class SubitizeGameLevelNode extends NumberPlayGameLevelNode<SubitizeGameLevel> {

  protected readonly answerButtons: NumberPlayGameAnswerButtons;

  constructor( level: SubitizeGameLevel,
               levelProperty: Property<SubitizeGameLevel | CountingGameLevel | null>,
               layoutBounds: Bounds2,
               visibleBoundsProperty: Property<Bounds2> ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty, NumberPlayConstants.SUBITIZE_GAME_COLOR );

    // create and add the answer buttons
    this.answerButtons = new NumberPlayGameAnswerButtons( level, this.pointsAwardedNodeVisibleProperty, () => {
        this.setFrownyFaceVisibility( false );
        level.subitizer.inputEnabledProperty.reset();
        level.subitizer.visibleProperty.value = true;
      }, () => {
        this.setFrownyFaceVisibility( true );
      },
      NumberPlayConstants.SUBITIZE_GAME_COLOR_LIGHT, {
        buttonSpacing: 40, // empirically determined
        dependencyEnabledProperty: level.subitizer.inputEnabledProperty
      } );
    this.answerButtons.centerX = layoutBounds.centerX;
    this.answerButtons.bottom = layoutBounds.maxY - NumberPlayGameLevelNode.ANSWER_BUTTONS_BOTTOM_MARGIN_Y;
    this.addChild( this.answerButtons );

    // create and add the subitizer node
    const subitizerNode = new SubitizerNode(
      level.subitizer,
      level.startSequencePlayingProperty,
      level.playButtonVisibleProperty,
      () => this.newChallenge()
    );
    subitizerNode.centerX = layoutBounds.centerX;
    subitizerNode.bottom = this.answerButtons.top - NumberPlayGameLevelNode.GAME_AREA_NODE_BOTTOM_MARGIN_Y; // empirically determined
    this.addChild( subitizerNode );

    // create and add the reveal button
    const revealButton = new SubitizeRevealButton(
      level.isChallengeSolvedProperty,
      level.subitizer.inputEnabledProperty,
      level.subitizer.visibleProperty
    );
    revealButton.right = subitizerNode.right - REVEAL_BUTTON_MARGIN;
    revealButton.bottom = subitizerNode.bottom - REVEAL_BUTTON_MARGIN;
    this.addChild( revealButton );
  }

  public reset(): void {
    super.reset();
  }
}

numberPlay.register( 'SubitizeGameLevelNode', SubitizeGameLevelNode );
export default SubitizeGameLevelNode;