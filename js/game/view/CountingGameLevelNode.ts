// Copyright 2021-2022, University of Colorado Boulder

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
import CountingPlayAreaNode from '../../../../number-suite-common/js/common/view/CountingPlayAreaNode.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import TenFrameNode from '../../../../number-suite-common/js/common/view/TenFrameNode.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import TProperty from '../../../../axon/js/TProperty.js';
import NumberSuiteCommonColors from '../../../../number-suite-common/js/common/NumberSuiteCommonColors.js';

// constants
const RECTANGLE_WIDTH = 550;
const RECTANGLE_HEIGHT = 325;
const PANEL_LINE_WIDTH = 2;
const TEN_FRAME_MARGIN = 10;

class CountingGameLevelNode extends NumberPlayGameLevelNode<CountingGameLevel> {

  protected readonly answerButtons: NumberPlayGameAnswerButtons;

  public constructor( level: CountingGameLevel,
                      levelProperty: TProperty<NumberPlayGameLevel | null>,
                      layoutBounds: Bounds2,
                      visibleBoundsProperty: Property<Bounds2> ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty, {
      statusBarOptions: {
        barFill: NumberPlayColors.countingGameColorProperty
      }
    } );

    // create and add the answerButtons
    this.answerButtons = new NumberPlayGameAnswerButtons( level, this.pointAwardedNodeVisibleProperty,
      () => this.setFrownyFaceVisibility( false ),
      () => this.setFrownyFaceVisibility( true ), {
        buttonColor: NumberPlayColors.countingGameLightColorProperty
      }
    );
    this.answerButtons.centerX = layoutBounds.centerX;
    this.answerButtons.bottom = layoutBounds.maxY - NumberPlayGameLevelNode.ANSWER_BUTTONS_BOTTOM_MARGIN_Y;
    this.addChild( this.answerButtons );

    // TODO: The parts of this file that are used for the play area node need to be refactored once the play area is updated.
    // See https://github.com/phetsims/number-play/issues/82
    const playAreaNode = new Rectangle( {
      rectWidth: RECTANGLE_WIDTH,
      rectHeight: RECTANGLE_HEIGHT
    } );

    // create view bounds for the objectsPlayAreaNode
    const objectsPlayAreaViewBounds = new Bounds2(
      playAreaNode.left,
      playAreaNode.top,
      playAreaNode.right,
      playAreaNode.bottom
    );

    // set the local bounds so they don't change
    playAreaNode.localBounds = objectsPlayAreaViewBounds;

    // create and add the objectsPlayAreaNode
    const objectsPlayAreaNode = new CountingPlayAreaNode(
      level.objectsPlayArea,
      level.countingObjectTypeProperty,
      new Property( objectsPlayAreaViewBounds ), {
        includeCountingObjectCreatorPanel: false
      }
    );
    playAreaNode.addChild( objectsPlayAreaNode );

    // create and add the playAreaPanel, a panel for the play area
    const playAreaPanel = new Panel( playAreaNode, {
      xMargin: 0,
      yMargin: 0,
      fill: NumberPlayColors.blueBackgroundColorProperty,
      lineWidth: PANEL_LINE_WIDTH
    } );
    playAreaPanel.centerX = layoutBounds.centerX;
    playAreaPanel.bottom = this.answerButtons.top - NumberPlayGameLevelNode.GAME_AREA_NODE_BOTTOM_MARGIN_Y;
    this.addChild( playAreaPanel );

    const tenFrameBackgroundNode = new Rectangle( {
      rectWidth: RECTANGLE_WIDTH - TEN_FRAME_MARGIN * 2,
      rectHeight: RECTANGLE_HEIGHT - TEN_FRAME_MARGIN * 2,
      fill: NumberSuiteCommonColors.lightPurpleBackgroundColorProperty
    } );

    // create and add the tenFrameNode
    const tenFrameNode = new TenFrameNode( level.challengeNumberProperty, level.challengeRange );
    tenFrameNode.scale( RECTANGLE_HEIGHT / tenFrameNode.height / 3.5 );
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
      playAreaPanel.visible = isObjects;
      tenFramePanel.visible = !isObjects;
    } );
  }
}

numberPlay.register( 'CountingGameLevelNode', CountingGameLevelNode );
export default CountingGameLevelNode;