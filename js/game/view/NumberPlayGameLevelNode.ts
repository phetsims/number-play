// Copyright 2021-2023, University of Colorado Boulder

/**
 * NumberPlayGameLevelNode is the base class for a game level view which each type of game will extend.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, HBox, Node, Path, RichText, Text } from '../../../../scenery/js/imports.js';
import InfiniteStatusBar, { InfiniteStatusBarOptions } from '../../../../vegas/js/InfiniteStatusBar.js';
import numberPlay from '../../numberPlay.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import NumberPlayGameLevel from '../model/NumberPlayGameLevel.js';
import NumberPlayGameAnswerButtons from './NumberPlayGameAnswerButtons.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import TProperty from '../../../../axon/js/TProperty.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';

// types
type SelfOptions = {
  statusBarOptions?: Pick<InfiniteStatusBarOptions, 'barFill'>;
};
type NumberPlayGameLevelNodeOptions = SelfOptions;

// constants
const FACE_DIAMETER = 150;
const PLUS_ONE_STRING = '+1'; // doesn't need to be translatable

abstract class NumberPlayGameLevelNode<T extends NumberPlayGameLevel> extends Node {

  public readonly level: T;

  // visible when an incorrect answer button is pressed
  private readonly frownyFaceNode: FaceNode;
  private frownyFaceAnimation: Animation | null;

  // whether the pointAwardedNode is visible
  protected readonly pointAwardedNodeVisibleProperty: Property<boolean>;
  protected abstract answerButtons: NumberPlayGameAnswerButtons;
  public static readonly ANSWER_BUTTONS_BOTTOM_MARGIN_Y = 50;
  public static readonly GAME_AREA_NODE_BOTTOM_MARGIN_Y = 40; // distance above answer buttons

  protected constructor( level: T,
                         levelProperty: TProperty<NumberPlayGameLevel | null>,
                         layoutBounds: Bounds2,
                         visibleBoundsProperty: Property<Bounds2>,
                         providedOptions?: NumberPlayGameLevelNodeOptions ) {
    super();

    const options = optionize<NumberPlayGameLevelNodeOptions, StrictOmit<SelfOptions, 'statusBarOptions'>>()( {}, providedOptions );

    // text displayed in the statusBar
    const levelDescriptionText = new RichText( level.gameType.levelDescriptions[ level.levelNumber ], {
      font: new PhetFont( 21 ),
      maxWidth: 650
    } );

    // bar across the top of the screen
    const statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionText, level.scoreProperty,
      combineOptions<InfiniteStatusBarOptions>( {
        floatToTop: true,
        spacing: 20,
        backButtonListener: () => {
          this.interruptSubtreeInput();
          levelProperty.value = null; // back to the level-selection UI
        }
      }, options.statusBarOptions ) );
    this.addChild( statusBar );

    this.level = level;

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
      baseColor: PhetColorScheme.BUTTON_YELLOW,
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

  public reset(): void {
    this.pointAwardedNodeVisibleProperty.reset();
    this.answerButtons.reset();
  }

  /**
   * Sets up a new challenge in the model and in the view.
   */
  public newChallenge(): void {
    this.level.newChallenge();
    this.pointAwardedNodeVisibleProperty.value = false;
    this.answerButtons.reset();
    if ( phet.chipper.queryParameters.showAnswers ) {
      this.answerButtons.showAnswer( this.level.challengeNumberProperty );
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

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'NumberPlayGameLevelNode', NumberPlayGameLevelNode );
export default NumberPlayGameLevelNode;