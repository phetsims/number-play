// Copyright 2023-2025, University of Colorado Boulder

/**
 * NumberPlayGameRewardDialog is the reward dialog in the 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import RewardDialog from '../../../../vegas/js/RewardDialog.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import NumberPlayGameRewardNode from './NumberPlayGameRewardNode.js';

export default class NumberPlayGameRewardDialog extends RewardDialog {

  public constructor(
    levelProperty: TProperty<NumberPlayGameLevel | null>,
    rewardNode: NumberPlayGameRewardNode,
    rewardScore: number
  ) {

    // A 1-indexed level number for the reward dialog to display the current level. If there isn't one, just use zero.
    const levelNumberProperty = new DerivedProperty( [ levelProperty ], level => {
      return level ? level.levelNumber : 0;
    } );

    super( levelNumberProperty, rewardScore, {

      // 'Keep Going' hides the dialog, but doesn't change the current challenge.
      dismissListener: () => this.hide(),

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

    this.addDisposable( levelNumberProperty );
  }
}

numberPlay.register( 'NumberPlayGameRewardDialog', NumberPlayGameRewardDialog );