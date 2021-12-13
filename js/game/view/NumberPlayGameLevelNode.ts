// Copyright 2021, University of Colorado Boulder

/**
 * NumberPlayGameLevelNode is the base class for a game level view which each type of game will extend.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, ColorProperty, HBox, Node, Path, RichText, Text } from '../../../../scenery/js/imports.js';
import InfiniteStatusBar from '../../../../vegas/js/InfiniteStatusBar.js';
import numberPlay from '../../numberPlay.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import NumberPlayQueryParameters from '../../common/NumberPlayQueryParameters.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import CountingGameLevel from '../model/CountingGameLevel.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import NumberPlayGameAnswerButtons from './NumberPlayGameAnswerButtons.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import merge from '../../../../phet-core/js/merge.js';

// types
type StatusBarOptions = {
  statusBarFill: ColorProperty
}

// constants
const FACE_DIAMETER = 150;
const PLUS_ONE_STRING = '+1'; // doesn't need to be translatable

abstract class NumberPlayGameLevelNode<T extends NumberPlayGameLevel> extends Node {

  public readonly level: T;
  private readonly frownyFaceNode: FaceNode;
  private frownyFaceAnimation: Animation | null;
  protected readonly pointAwardedNodeVisibleProperty: BooleanProperty;
  protected abstract answerButtons: NumberPlayGameAnswerButtons;
  public static ANSWER_BUTTONS_BOTTOM_MARGIN_Y: number;
  public static GAME_AREA_NODE_BOTTOM_MARGIN_Y: number;

  protected constructor( level: T,
                         levelProperty: Property<SubitizeGameLevel | CountingGameLevel | null>,
                         layoutBounds: Bounds2,
                         visibleBoundsProperty: Property<Bounds2>,
                         providedOptions?: StatusBarOptions ) {
    super();

    const options = merge( {
      statusBarFill: Color.WHITE
    }, providedOptions ) as StatusBarOptions;

    // text displayed in the statusBar
    const levelDescriptionText = new RichText( StringUtils.fillIn( numberPlayStrings.gameNameLevelNumberPattern, {
      gameName: level.gameName,
      levelNumber: level.levelNumber
    } ), {
      font: new PhetFont( 21 ),
      maxWidth: 650
    } );

    // bar across the top of the screen
    // @ts-ignore
    const statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionText, level.scoreProperty, {
      floatToTop: true,
      spacing: 20,
      barFill: options.statusBarFill,
      backButtonListener: () => {
        this.interruptSubtreeInput();
        levelProperty.value = null; // back to the level-selection UI
      }
    } );
    // color the backButton in the statusBar yellow and increase its touch area
    const backButton = statusBar.children[ 1 ].children[ 0 ];
    // @ts-ignore
    backButton.baseColor = Color.YELLOW;
    backButton.touchArea = backButton.bounds.dilated( NumberPlayConstants.TOUCH_AREA_DILATION );
    this.addChild( statusBar );

    this.level = level;

    // create and add the frownyFaceNode which is visible when an incorrect answer button is pressed
    this.frownyFaceNode = new FaceNode( FACE_DIAMETER, {
      visible: false
    } );
    this.frownyFaceNode.top = 98; // empirically determined to top-align with the main game node
    this.frownyFaceNode.right = layoutBounds.maxX - 45; // empirically determined
    this.frownyFaceNode.frown();
    this.addChild( this.frownyFaceNode );
    this.frownyFaceAnimation = null;

    // create and add the smileyFaceNode which is visible when a challenge is solved, meaning a correct answer button was pressed
    const smileyFaceNode = new FaceNode( FACE_DIAMETER, {
      visibleProperty: level.isChallengeSolvedProperty
    } );
    smileyFaceNode.top = this.frownyFaceNode.top;
    smileyFaceNode.centerX = this.frownyFaceNode.centerX;
    this.addChild( smileyFaceNode );

    // whether the pointAwardedNode is visible
    this.pointAwardedNodeVisibleProperty = new BooleanProperty( false );

    // create and add the pointAwardedNode which is shown when a correct guess is made on the first answer button press
    const starNode = new StarNode( { value: 1, scale: 1.5 } );
    const plusOneNode = new Text( PLUS_ONE_STRING, { font: new PhetFont( 44 ), fill: Color.BLACK } );
    const pointAwardedNode = new HBox( {
      children: [ plusOneNode, starNode ],
      spacing: 10,
      visibleProperty: this.pointAwardedNodeVisibleProperty
    } );
    pointAwardedNode.centerX = smileyFaceNode.centerX - 2; // empirically determined tweak to look centered
    pointAwardedNode.top = smileyFaceNode.bottom + 20; // empirically determined
    this.addChild( pointAwardedNode );

    // create and add the newChallengeButton which is visible when a challenge is solved, meaning a correct answer button was pressed
    const rightArrowShape = new ArrowShape( 0, 0, 42, 0, {
      tailWidth: 12,
      headWidth: 25,
      headHeight: 23
    } );
    const newChallengeButton = new RectangularPushButton( {
      baseColor: Color.YELLOW,
      xMargin: 27,
      yMargin: 10.9,
      touchAreaXDilation: NumberPlayConstants.TOUCH_AREA_DILATION,
      touchAreaYDilation: NumberPlayConstants.TOUCH_AREA_DILATION,
      content: new Path( rightArrowShape, { fill: Color.BLACK } ),
      visibleProperty: level.isChallengeSolvedProperty,
      listener: () => this.newChallenge()
    } );
    newChallengeButton.centerX = smileyFaceNode.centerX;
    newChallengeButton.bottom = layoutBounds.maxY -
                                NumberPlayGameLevelNode.ANSWER_BUTTONS_BOTTOM_MARGIN_Y -
                                NumberPlayGameAnswerButtons.BUTTON_DIMENSION.height -
                                NumberPlayGameLevelNode.GAME_AREA_NODE_BOTTOM_MARGIN_Y;
    this.addChild( newChallengeButton );
  }

  protected reset(): void {
    this.pointAwardedNodeVisibleProperty.reset();
    this.answerButtons.reset();
  }

  /**
   * Sets up a new challenge in the model and in the view.
   */
  protected newChallenge(): void {
    this.level.newChallenge();
    this.pointAwardedNodeVisibleProperty.value = false;
    this.answerButtons.reset();
    if ( NumberPlayQueryParameters.showCorrectAnswer ) {
      this.answerButtons.showCorrectAnswer( this.level.challengeNumberProperty );
    }
  }

  /**
   * Shows or hides a frowny face - if shown, animates it to fade out when the user made an incorrect guess.
   */
  protected setFrownyFaceVisibility( showFrownyFace: boolean ): void {
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

NumberPlayGameLevelNode.ANSWER_BUTTONS_BOTTOM_MARGIN_Y = 50;
NumberPlayGameLevelNode.GAME_AREA_NODE_BOTTOM_MARGIN_Y = 40; // distance above answer buttons

numberPlay.register( 'NumberPlayGameLevelNode', NumberPlayGameLevelNode );
export default NumberPlayGameLevelNode;