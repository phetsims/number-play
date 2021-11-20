// Copyright 2021, University of Colorado Boulder

/**
 * NumberPlayGameLevelNode is the base class for a game level view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import InfiniteStatusBar from '../../../../vegas/js/InfiniteStatusBar.js';
import numberPlay from '../../numberPlay.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import NumberPlayQueryParameters from '../../common/NumberPlayQueryParameters.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import CountingGameLevel from '../model/CountingGameLevel.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import NumberPlayGameAnswerButtons from './NumberPlayGameAnswerButtons.js';

// constants
const FACE_DIAMETER = 150;

abstract class NumberPlayGameLevelNode<T extends NumberPlayGameLevel> extends Node {

  public readonly statusBar: InfiniteStatusBar;
  public readonly level: T;
  private readonly layoutBounds: Bounds2;
  private readonly frownyFaceNode: FaceNode;
  private frownyFaceAnimation: Animation | null;
  protected readonly pointsAwardedNodeVisibleProperty: BooleanProperty;
  protected abstract answerButtons: NumberPlayGameAnswerButtons;
  static ANSWER_BUTTONS_MARGIN_Y: number;

  protected constructor( level: T,
                         levelProperty: Property<SubitizeGameLevel | CountingGameLevel | null>,
                         layoutBounds: Bounds2,
                         visibleBoundsProperty: Property<Bounds2>,
                         statusBarColor: string ) {
    super();

    // text displayed in the status bar
    const levelDescriptionText = new RichText( level.statusBarMessage, {
      font: new PhetFont( 21 ),
      maxWidth: 650 // determined empirically
    } );

    // bar across the top of the screen
    // @ts-ignore
    this.statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionText, level.scoreProperty, {
      floatToTop: true,
      spacing: 20,
      barFill: statusBarColor,
      backButtonListener: () => {
        this.interruptSubtreeInput();
        levelProperty.value = null; // back to the level-selection UI
      }
    } );
    // color the back button in the status bar yellow
    // @ts-ignore
    this.statusBar.getChildAt( 1 ).getChildAt( 0 ).baseColor = Color.YELLOW;
    this.addChild( this.statusBar );

    this.level = level;

    this.layoutBounds = layoutBounds;

    // create and add the frowny face node which is visible when an incorrect answer button is pressed
    this.frownyFaceNode = new FaceNode( FACE_DIAMETER, {
      visible: false
    } );
    this.frownyFaceNode.top = 90; // empirically determined
    this.frownyFaceNode.right = layoutBounds.maxX - 45; // empirically determined
    this.frownyFaceNode.frown();
    this.addChild( this.frownyFaceNode );
    this.frownyFaceAnimation = null;

    // create and add the smiley face node which is visible when a challenge is solved, meaning a correct answer button was pressed
    const smileyFaceNode = new FaceNode( FACE_DIAMETER, {
      visibleProperty: level.isSolvedProperty
    } );
    smileyFaceNode.top = this.frownyFaceNode.top;
    smileyFaceNode.centerX = this.frownyFaceNode.centerX;
    this.addChild( smileyFaceNode );

    this.pointsAwardedNodeVisibleProperty = new BooleanProperty( false );

    // create and add the points awarded node which is shown when a correct guess is made on the first answer button press
    const starNode = new StarNode( { value: 1, scale: 3 } );
    starNode.centerX = this.frownyFaceNode.centerX;
    starNode.top = this.frownyFaceNode.bottom + 23; // empirically determined
    const pointsNode = new Text( '+1', { font: new PhetFont( 30 ), fill: 'black' } );
    pointsNode.center = starNode.center;
    pointsNode.centerY += 5;
    const pointsAwardedNode = new Node( {
      children: [ starNode, pointsNode ],
      visibleProperty: this.pointsAwardedNodeVisibleProperty
    } );
    this.addChild( pointsAwardedNode );

    // create and add the new challenge button which is visible when a challenge is solved, meaning a correct answer button was pressed
    const arrowShape = new ArrowShape( 0, 0, 42, 0, {
      tailWidth: 12,
      headWidth: 25,
      headHeight: 23
    } );
    const newChallengeButton = new RectangularPushButton( {
      baseColor: Color.YELLOW,
      xMargin: 27,
      yMargin: 10.9,
      content: new Path( arrowShape, { fill: 'black' } ),
      visibleProperty: level.isSolvedProperty,
      listener: () => this.newChallenge()
    } );
    newChallengeButton.centerX = smileyFaceNode.centerX;
    newChallengeButton.top = starNode.bottom + 24;
    this.addChild( newChallengeButton );
  }

  protected reset() {
    this.pointsAwardedNodeVisibleProperty.reset();
    this.answerButtons.reset();
  }

  /**
   * Sets up a new challenge in the model and in the view.
   */
  protected newChallenge() {
    // @ts-ignore
    this.level.newChallenge();
    this.pointsAwardedNodeVisibleProperty.value = false;
    this.answerButtons.reset();
    if ( NumberPlayQueryParameters.showCorrectAnswer ) {
      this.answerButtons.showCorrectAnswer( this.level.challengeNumberProperty );
    }
  }

  /**
   * Shows or hides a frowny face - if shown, animates it to fade out when the user made an incorrect guess.
   */
  protected setFrownyFaceVisibility( showFrownyFace: boolean ) {
    this.frownyFaceNode.visible = showFrownyFace;

    if ( showFrownyFace ) {

      if ( this.frownyFaceAnimation ) {
        this.frownyFaceAnimation.stop();
        this.frownyFaceAnimation = null;
      }

      // Animate opacity of the frowny face node, fade it out.
      this.frownyFaceNode.opacityProperty.value = 1;
      this.frownyFaceAnimation = new Animation( {
        delay: 1,
        duration: 0.8,
        targets: [ {
          property: this.frownyFaceNode.opacityProperty,
          easing: Easing.LINEAR,
          to: 0
        } ]
      } );

      this.frownyFaceAnimation.finishEmitter.addListener( () => {
        this.frownyFaceNode.visible = false;
        this.frownyFaceAnimation = null;
      } );

      this.frownyFaceAnimation.start();
    }
  }
}

NumberPlayGameLevelNode.ANSWER_BUTTONS_MARGIN_Y = 58;

numberPlay.register( 'NumberPlayGameLevelNode', NumberPlayGameLevelNode );
export default NumberPlayGameLevelNode;