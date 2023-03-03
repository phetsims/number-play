// Copyright 2023, University of Colorado Boulder

/**
 * NumberPlayGameRewardDialog is the reward dialog in the 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import TProperty from '../../../../axon/js/TProperty.js';
import RewardDialog from '../../../../vegas/js/RewardDialog.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameRewardNode from './NumberPlayGameRewardNode.js';

export default class NumberPlayGameRewardDialog extends RewardDialog {

  public constructor(
    levelProperty: TProperty<NumberPlayGameLevel | null>,
    rewardNode: NumberPlayGameRewardNode,
    rewardScore: number
  ) {

    super( rewardScore, {

      // 'Keep Going' hides the dialog, but doesn't change the current challenge.
      keepGoingButtonListener: () => this.hide(),

      // 'New Level' takes us back to the level-selection interface, and keeps the solved challenge loaded if we return
      // to this level to be consistent with the back button.
      newLevelButtonListener: () => {
        this.hide();
        levelProperty.value = null;
      },

      // When the dialog is shown, show the reward.
      showCallback: () => {
        rewardNode.visible = true;
      },

      // When the dialog is hidden, hide the reward.
      hideCallback: () => {
        rewardNode.visible = false;
      }
    } );
  }
}

numberPlay.register( 'NumberPlayGameRewardDialog', NumberPlayGameRewardDialog );