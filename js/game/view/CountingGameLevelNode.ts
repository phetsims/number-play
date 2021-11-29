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
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Panel from '../../../../sun/js/Panel.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';
import TenFrameNode from '../../common/view/TenFrameNode.js';

const WIDTH = 550; // empirically determined, in screen coordinates
const HEIGHT = 325; // empirically determined, in screen coordinates

// TODO: The parts of this file that are used for the play area need to be refactored once the play area is updated.
class CountingGameLevelNode extends NumberPlayGameLevelNode<CountingGameLevel> {

  protected readonly answerButtons: NumberPlayGameAnswerButtons;

  constructor( level: CountingGameLevel,
               levelProperty: Property<SubitizeGameLevel | CountingGameLevel | null>,
               layoutBounds: Bounds2,
               visibleBoundsProperty: Property<Bounds2> ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty, NumberPlayConstants.COUNTING_GAME_COLOR );

    // create and add the answer buttons
    this.answerButtons = new NumberPlayGameAnswerButtons( level, this.pointsAwardedNodeVisibleProperty, () => {
      this.setFrownyFaceVisibility( false );
    }, () => {
      this.setFrownyFaceVisibility( true );
    } );
    this.answerButtons.centerX = layoutBounds.centerX;
    this.answerButtons.bottom = layoutBounds.maxY - NumberPlayGameLevelNode.ANSWER_BUTTONS_MARGIN_Y;
    this.addChild( this.answerButtons );

    const playAreaNode = new Rectangle( {
      rectWidth: WIDTH,
      rectHeight: HEIGHT
    } );

    // create view bounds for the objects play area node
    const objectsPlayAreaViewBounds = new Bounds2(
      playAreaNode.left,
      playAreaNode.top + NumberPlayConstants.PLAY_AREA_Y_MARGIN,
      playAreaNode.right,
      playAreaNode.bottom - NumberPlayConstants.PLAY_AREA_Y_MARGIN
    );

    const objectsPlayAreaNode = new OnesPlayAreaNode(
      level.objectsPlayArea,
      objectsPlayAreaViewBounds, {
        playObjectTypeProperty: level.playObjectTypeProperty,
        // @ts-ignore
        groupingLinkingTypeProperty: new EnumerationProperty( GroupingLinkingType, GroupingLinkingType.NO_GROUPING ),
        includeOnesCreatorPanel: false
      }
    );
    playAreaNode.addChild( objectsPlayAreaNode );

    const panelLineWidth = 2;
    const playAreaPanel = new Panel( playAreaNode, {
      xMargin: 0,
      yMargin: 0,
      fill: NumberPlayConstants.BLUE_BACKGROUND,
      lineWidth: panelLineWidth
    } );
    playAreaPanel.centerX = layoutBounds.centerX;
    playAreaPanel.top = layoutBounds.top + 90; // empirically determined
    this.addChild( playAreaPanel );

    const margin = 10;
    const tenFrameBackgroundNode = new Rectangle( {
      rectWidth: WIDTH - margin * 2,
      rectHeight: HEIGHT - margin * 2,
      fill: NumberPlayConstants.LIGHT_GREEN_BACKGROUND
    } );

    // create and add the ten frame node
    const tenFrameNode = new TenFrameNode( level.challengeNumberProperty );
    tenFrameNode.scale( HEIGHT / tenFrameNode.height / 3.5 );
    tenFrameNode.center = tenFrameBackgroundNode.center;
    tenFrameBackgroundNode.addChild( tenFrameNode );

    // create and add a panel for the ten frame
    const tenFramePanel = new Panel( tenFrameBackgroundNode, {
      xMargin: margin,
      yMargin: margin,
      fill: NumberPlayConstants.LIGHT_GREEN_BACKGROUND,
      lineWidth: panelLineWidth
    } );
    tenFramePanel.centerX = layoutBounds.centerX;
    tenFramePanel.top = layoutBounds.top + 90; // empirically determined
    this.addChild( tenFramePanel );

    // update the visibility of the panels when the representation types change
    level.isObjectsRepresentationProperty.link( isObjects => {
      playAreaPanel.visible = isObjects;
      tenFramePanel.visible = !isObjects;
    } );
  }

  public reset(): void {
    super.reset();
  }
}

numberPlay.register( 'CountingGameLevelNode', CountingGameLevelNode );
export default CountingGameLevelNode;