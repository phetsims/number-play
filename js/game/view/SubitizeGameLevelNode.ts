// Copyright 2021-2024, University of Colorado Boulder

/**
 * SubitizeGameLevelNode is the class for a 'Subitize' game level view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Disposable from '../../../../axon/js/Disposable.js';
import Property from '../../../../axon/js/Property.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import NumberPlayGameAnswerButtons from './NumberPlayGameAnswerButtons.js';
import NumberPlayGameLevelNode from './NumberPlayGameLevelNode.js';
import NumberPlayGameRewardDialog from './NumberPlayGameRewardDialog.js';
import SubitizerNode from './SubitizerNode.js';

class SubitizeGameLevelNode extends NumberPlayGameLevelNode<SubitizeGameLevel> {

  protected readonly answerButtons: NumberPlayGameAnswerButtons;

  public constructor(
    level: SubitizeGameLevel,
    levelProperty: TProperty<NumberPlayGameLevel | null>,
    rewardDialog: NumberPlayGameRewardDialog,
    layoutBounds: Bounds2,
    visibleBoundsProperty: Property<Bounds2> ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty, {
      statusBarOptions: {
        barFill: NumberPlayColors.subitizeGameColorProperty
      }
    } );

    // create and add the answerButtons
    this.answerButtons = new NumberPlayGameAnswerButtons(
      level,
      this.pointAwardedNodeVisibleProperty,
      rewardDialog, () => {
        this.setFrownyFaceVisibility( false );
        level.subitizer.isInputEnabledProperty.value = false;
        level.subitizer.isShapeVisibleProperty.value = true;
      }, () => this.setFrownyFaceVisibility( true ), {
        buttonColor: NumberPlayColors.subitizeGameLightColorProperty,
        buttonSpacing: 40,
        dependencyEnabledProperty: level.subitizer.isInputEnabledProperty
      } );
    this.answerButtons.centerX = layoutBounds.centerX;
    this.answerButtons.bottom = layoutBounds.maxY - NumberPlayGameLevelNode.ANSWER_BUTTONS_BOTTOM_MARGIN_Y;
    this.addChild( this.answerButtons );

    // create and add the subitizerNode
    const subitizerNode = new SubitizerNode(
      level.subitizer,
      level.isChallengeSolvedProperty,
      () => this.newChallenge()
    );
    subitizerNode.centerX = layoutBounds.centerX;
    subitizerNode.bottom = this.answerButtons.top - NumberPlayGameLevelNode.GAME_AREA_NODE_BOTTOM_MARGIN_Y;
    this.addChild( subitizerNode );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }
}

numberPlay.register( 'SubitizeGameLevelNode', SubitizeGameLevelNode );
export default SubitizeGameLevelNode;