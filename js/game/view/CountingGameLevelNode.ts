// Copyright 2021, University of Colorado Boulder

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
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import NumberPlayGameAnswerButtons from './NumberPlayGameAnswerButtons.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import OnesPlayAreaNode from '../../common/view/OnesPlayAreaNode.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';
import TenFrameNode from '../../common/view/TenFrameNode.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';

// constants
const RECTANGLE_WIDTH = 550;
const RECTANGLE_HEIGHT = 325;

// TODO: The parts of this file that are used for the play area need to be refactored once the play area is updated.
class CountingGameLevelNode extends NumberPlayGameLevelNode<CountingGameLevel> {

  protected readonly answerButtons: NumberPlayGameAnswerButtons;

  constructor( level: CountingGameLevel,
               levelProperty: Property<SubitizeGameLevel | CountingGameLevel | null>,
               layoutBounds: Bounds2,
               visibleBoundsProperty: Property<Bounds2> ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty, {
      statusBarFill: NumberPlayColors.countingGameColorProperty
    } );

    // create and add the answerButtons
    this.answerButtons = new NumberPlayGameAnswerButtons( level, this.pointsAwardedNodeVisibleProperty, () => {
        this.setFrownyFaceVisibility( false );
      }, () => {
        this.setFrownyFaceVisibility( true );
      }, {
        buttonColor: NumberPlayColors.countingGameLightColorProperty
      }
    );
    this.answerButtons.centerX = layoutBounds.centerX;
    this.answerButtons.bottom = layoutBounds.maxY - NumberPlayGameLevelNode.ANSWER_BUTTONS_BOTTOM_MARGIN_Y;
    this.addChild( this.answerButtons );

    const playAreaNode = new Rectangle( {
      rectWidth: RECTANGLE_WIDTH,
      rectHeight: RECTANGLE_HEIGHT
    } );

    // create view bounds for the objectsPlayAreaNode
    const objectsPlayAreaViewBounds = new Bounds2(
      playAreaNode.left,
      playAreaNode.top + NumberPlayConstants.PLAY_AREA_Y_MARGIN,
      playAreaNode.right,
      playAreaNode.bottom - NumberPlayConstants.PLAY_AREA_Y_MARGIN
    );

    // create and add the objectsPlayAreaNode
    const objectsPlayAreaNode = new OnesPlayAreaNode(
      level.objectsPlayArea,
      objectsPlayAreaViewBounds, {
        playObjectTypeProperty: level.playObjectTypeProperty,
        groupingLinkingTypeProperty: level.groupObjects ?
          // @ts-ignore
          new EnumerationProperty( GroupingLinkingType, GroupingLinkingType.GROUPING ) :
          // @ts-ignore
          new EnumerationProperty( GroupingLinkingType, GroupingLinkingType.NO_GROUPING ),
        includeOnesCreatorPanel: false
      }
    );
    playAreaNode.addChild( objectsPlayAreaNode );

    // create and add the playAreaPanel, a panel for the play area
    const panelLineWidth = 2;
    const playAreaPanel = new Panel( playAreaNode, {
      xMargin: 0,
      yMargin: 0,
      fill: NumberPlayColors.blueBackgroundColorProperty,
      lineWidth: panelLineWidth
    } );
    playAreaPanel.centerX = layoutBounds.centerX;
    playAreaPanel.bottom = this.answerButtons.top - NumberPlayGameLevelNode.GAME_AREA_NODE_BOTTOM_MARGIN_Y;
    this.addChild( playAreaPanel );

    const margin = 10;
    const tenFrameBackgroundNode = new Rectangle( {
      rectWidth: RECTANGLE_WIDTH - margin * 2,
      rectHeight: RECTANGLE_HEIGHT - margin * 2,
      fill: NumberPlayColors.lightGreenBackgroundColorProperty
    } );

    // create and add the tenFrameNode
    const tenFrameNode = new TenFrameNode( level.challengeNumberProperty );
    tenFrameNode.scale( RECTANGLE_HEIGHT / tenFrameNode.height / 3.5 );
    tenFrameNode.center = tenFrameBackgroundNode.center;
    tenFrameBackgroundNode.addChild( tenFrameNode );

    // create and add the tenFramePanel, a panel for the ten frame
    const tenFramePanel = new Panel( tenFrameBackgroundNode, {
      xMargin: margin,
      yMargin: margin,
      fill: NumberPlayColors.lightGreenBackgroundColorProperty,
      lineWidth: panelLineWidth
    } );
    tenFramePanel.centerX = layoutBounds.centerX;
    tenFramePanel.bottom = this.answerButtons.top - NumberPlayGameLevelNode.GAME_AREA_NODE_BOTTOM_MARGIN_Y;
    this.addChild( tenFramePanel );

    // update the visibility of the panels when the representation types change
    level.isObjectsRepresentationProperty.link( isObjects => {
      playAreaPanel.visible = isObjects;
      tenFramePanel.visible = !isObjects;
    } );

    // start a new challenge
    super.newChallenge();
  }

  public reset(): void {
    super.reset();
  }
}

numberPlay.register( 'CountingGameLevelNode', CountingGameLevelNode );
export default CountingGameLevelNode;