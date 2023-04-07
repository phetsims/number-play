// Copyright 2021-2023, University of Colorado Boulder

/**
 * CountingGameLevelNode is the class for a 'Counting' game level view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberPlayGameLevelNode from './NumberPlayGameLevelNode.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CountingGameLevel from '../model/CountingGameLevel.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameAnswerButtons from './NumberPlayGameAnswerButtons.js';
import CountingAreaNode from '../../../../number-suite-common/js/common/view/CountingAreaNode.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import TenFrameNode from '../../../../number-suite-common/js/common/view/TenFrameNode.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import TProperty from '../../../../axon/js/TProperty.js';
import NumberSuiteCommonColors from '../../../../number-suite-common/js/common/NumberSuiteCommonColors.js';
import NumberPlayGameRewardDialog from './NumberPlayGameRewardDialog.js';

// constants
const BACKGROUND_WIDTH = 550;
const BACKGROUND_HEIGHT = 325;
const PANEL_LINE_WIDTH = 2;
const TEN_FRAME_MARGIN = 10;

class CountingGameLevelNode extends NumberPlayGameLevelNode<CountingGameLevel> {

  protected readonly answerButtons: NumberPlayGameAnswerButtons;

  public constructor( level: CountingGameLevel,
                      levelProperty: TProperty<NumberPlayGameLevel | null>,
                      rewardDialog: NumberPlayGameRewardDialog,
                      layoutBounds: Bounds2,
                      visibleBoundsProperty: Property<Bounds2> ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty, {
      statusBarOptions: {
        barFill: NumberPlayColors.countingGameColorProperty
      }
    } );

    // create and add the answerButtons
    this.answerButtons = new NumberPlayGameAnswerButtons(
      level,
      this.pointAwardedNodeVisibleProperty,
      rewardDialog,
      () => this.setFrownyFaceVisibility( false ),
      () => this.setFrownyFaceVisibility( true ), {
        buttonColor: NumberPlayColors.countingGameLightColorProperty
      }
    );
    this.answerButtons.centerX = layoutBounds.centerX;
    this.answerButtons.bottom = layoutBounds.maxY - NumberPlayGameLevelNode.ANSWER_BUTTONS_BOTTOM_MARGIN_Y;
    this.addChild( this.answerButtons );

    // create and add the objectsCountingAreaNode
    const objectsCountingAreaNode = new CountingAreaNode(
      level.objectsCountingArea,
      level.countingObjectTypeProperty,
      new Property( new Bounds2( 0, 0, BACKGROUND_WIDTH, BACKGROUND_HEIGHT ) ), {
        includeCountingObjectCreatorPanel: false
      }
    );

    // Override the localBounds so they don't change.
    objectsCountingAreaNode.localBounds = objectsCountingAreaNode.localBounds.copy();

    // create and add the countingAreaPanel, a panel for the countingArea
    const countingAreaPanel = new Panel( objectsCountingAreaNode, {
      xMargin: 0,
      yMargin: 0,
      fill: NumberPlayColors.blueBackgroundColorProperty,
      lineWidth: PANEL_LINE_WIDTH
    } );
    countingAreaPanel.centerX = layoutBounds.centerX;
    countingAreaPanel.bottom = this.answerButtons.top - NumberPlayGameLevelNode.GAME_AREA_NODE_BOTTOM_MARGIN_Y;
    this.addChild( countingAreaPanel );

    const tenFrameBackgroundNode = new Rectangle( {
      rectWidth: BACKGROUND_WIDTH - TEN_FRAME_MARGIN * 2,
      rectHeight: BACKGROUND_HEIGHT - TEN_FRAME_MARGIN * 2,
      fill: NumberSuiteCommonColors.lightPurpleBackgroundColorProperty
    } );

    // create and add the tenFrameNode
    const tenFrameNode = new TenFrameNode( level.challengeNumberProperty, level.challengeRange );
    tenFrameNode.scale( BACKGROUND_HEIGHT / tenFrameNode.height / 3.5 );
    tenFrameNode.center = tenFrameBackgroundNode.center;
    tenFrameBackgroundNode.addChild( tenFrameNode );

    // create and add the tenFramePanel, a panel for the ten frame
    const tenFramePanel = new Panel( tenFrameBackgroundNode, {
      xMargin: TEN_FRAME_MARGIN,
      yMargin: TEN_FRAME_MARGIN,
      fill: NumberSuiteCommonColors.lightPurpleBackgroundColorProperty,
      lineWidth: PANEL_LINE_WIDTH
    } );
    tenFramePanel.centerX = layoutBounds.centerX;
    tenFramePanel.bottom = this.answerButtons.top - NumberPlayGameLevelNode.GAME_AREA_NODE_BOTTOM_MARGIN_Y;
    this.addChild( tenFramePanel );

    // update the visibility of the panels when the representation types change
    level.isObjectsRepresentationProperty.link( isObjects => {
      countingAreaPanel.visible = isObjects;
      tenFramePanel.visible = !isObjects;
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'CountingGameLevelNode', CountingGameLevelNode );
export default CountingGameLevelNode;