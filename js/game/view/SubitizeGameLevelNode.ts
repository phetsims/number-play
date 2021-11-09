// Copyright 2021, University of Colorado Boulder

/**
 * SubitizeGameLevelNode is the class for a 'Subitize' game level view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PlayIconShape from '../../../../scenery-phet/js/PlayIconShape.js';
import ResetShape from '../../../../scenery-phet/js/ResetShape.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import NumberPlayQueryParameters from '../../common/NumberPlayQueryParameters.js';
import SpeechSynthesisButton from '../../common/view/SpeechSynthesisButton.js';
import numberPlay from '../../numberPlay.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import NumberPlayGameAnswerButtons from './NumberPlayGameAnswerButtons.js';
import NumberPlayGameLevelNode from './NumberPlayGameLevelNode.js';
import SubitizerNode from './SubitizerNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import numberPlayStrings from '../../numberPlayStrings.js';

class SubitizeGameLevelNode extends NumberPlayGameLevelNode {
  private readonly frownyFaceNode: FaceNode;
  private frownyFaceAnimation: Animation | null;
  private readonly pointsAwardedNodeVisibleProperty: BooleanProperty;
  private readonly answerButtons: NumberPlayGameAnswerButtons;
  private textObjectAnimation: Animation | null;
  private readonly startSequenceNode: Node;

  /**
   * @param {SubitizeGameLevel} level
   * @param {Property.<SubitizeGameLevel|null>} levelProperty
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty
   */
  constructor( level: SubitizeGameLevel,
               levelProperty: Property<SubitizeGameLevel | null>,
               layoutBounds: Bounds2,
               visibleBoundsProperty: Property<Bounds2>
  ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty );

    // create and add the questionText which is the prompt above the subitizerNode box
    const questionText = new Text( level.questionStringProperty.value, {
      font: new PhetFont( 45 )
    } );
    questionText.centerX = layoutBounds.centerX;
    questionText.top = this.statusBar.bottom + 20; // empirically determined
    this.addChild( questionText );

    // create and add the subitizerNode
    const subitizerNode = new SubitizerNode( level.subitizer );
    subitizerNode.centerX = layoutBounds.centerX;
    subitizerNode.top = questionText.bottom + 15; // empirically determined
    this.addChild( subitizerNode );

    // create and add playButton
    const playButton = new RectangularPushButton( {
      baseColor: Color.YELLOW,
      content: new Path( new PlayIconShape( 36, 45 ), {
        fill: 'black',
        centerX: 1.4,
        centerY: 0
      } ),
      xMargin: 25,
      yMargin: 19,
      visibleProperty: level.playButtonVisibleProperty,
      listener: () => {
        playButton.visibleProperty.value = false;
        this.setTextObjectVisibility( [ '3', '2', '1', numberPlayStrings.go ], subitizerNode.center );
      }
    } );
    playButton.center = subitizerNode.center;
    this.addChild( playButton );

    // create and add the speechSynthesisButton
    const speechSynthesisButton = new SpeechSynthesisButton( level.questionStringProperty );
    speechSynthesisButton.setLeftCenter( questionText.getRightCenter() );
    speechSynthesisButton.left = subitizerNode.right + 10; // empirically determined
    this.addChild( speechSynthesisButton );

    // create and add the showAgainButton which flashes the content in the subitizerNode again
    const resetIcon = new Path( new ResetShape( 16 ), { fill: Color.BLACK } );
    const showAgainButton = new RectangularPushButton( {
      content: resetIcon,
      xMargin: 6,
      yMargin: 6,
      baseColor: new Color( 0x8DB3FF ),
      enabledProperty: new DerivedProperty( [ level.isSolvedProperty, level.subitizer.isPlayingProperty, level.subitizer.visibleProperty ],
        ( isSolved: boolean, isPlaying: boolean, subitizerVisible: boolean ) => !isSolved && isPlaying && !subitizerVisible ),
      listener: () => {
        level.subitizer.visibleProperty.value = true;
      }
    } );
    showAgainButton.left = speechSynthesisButton.left;
    showAgainButton.setBottom( subitizerNode.getBottom() );
    this.addChild( showAgainButton );

    // @private {FaceNode} - create and add frownyFaceNode which is visible when an incorrect answer button is pressed
    this.frownyFaceNode = new FaceNode( 160 /* headDiameter */, {
      visible: false
    } );
    this.frownyFaceNode.top = subitizerNode.top;
    this.frownyFaceNode.right = layoutBounds.maxX - 45; // empirically determined
    this.frownyFaceNode.frown();
    this.addChild( this.frownyFaceNode );
    this.frownyFaceAnimation = null;

    // create and add smileyFaceNode which is visible when a challenge is solved, meaning a correct answer button was pressed
    const smileyFaceNode = new FaceNode( 160 /* headDiameter */, {
      visibleProperty: level.isSolvedProperty
    } );
    smileyFaceNode.top = subitizerNode.top;
    smileyFaceNode.centerX = this.frownyFaceNode.centerX;
    this.addChild( smileyFaceNode );

    // @private {BooleanProperty}
    this.pointsAwardedNodeVisibleProperty = new BooleanProperty( false );

    // create and add pointsAwardedNode which is shown when a correct guess is made on the first answerButtons press
    const starNode = new StarNode( { value: 1, scale: 3 } );
    starNode.centerX = this.frownyFaceNode.centerX;
    starNode.top = this.frownyFaceNode.bottom + 40; // empirically determined
    const pointsNode = new Text( '+1', { font: new PhetFont( 30 ), fill: 'black' } );
    pointsNode.center = starNode.center;
    pointsNode.centerY += 5;
    const pointsAwardedNode = new Node( {
      children: [ starNode, pointsNode ],
      visibleProperty: this.pointsAwardedNodeVisibleProperty
    } );
    this.addChild( pointsAwardedNode );

    // @private {NumberPlayGameAnswerButtons} - create and add the answerButtons
    this.answerButtons = new NumberPlayGameAnswerButtons( level,
      this.pointsAwardedNodeVisibleProperty, showFrownyFace => this.setFrownyFaceVisibility( showFrownyFace ) );
    this.answerButtons.centerX = subitizerNode.centerX;
    this.answerButtons.top = subitizerNode.bottom + 40; // empirically determined
    this.addChild( this.answerButtons );

    // create and add newChallengeButton which is visible when a challenge is solved, meaning a correct answer button was pressed
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
    newChallengeButton.centerY = this.answerButtons.centerY;
    this.addChild( newChallengeButton );

    // create and add startSequenceNode, which is where the text objects in the start sequence are added
    this.textObjectAnimation = null;
    this.startSequenceNode = new Node();
    this.addChild( this.startSequenceNode );

    // cancel the animation and hide the startSequenceNode if the startSequencePlayingProperty is set to false
    this.level.startSequencePlayingProperty.link( startSequencePlaying => {
      if ( !startSequencePlaying && this.textObjectAnimation ) {
        this.textObjectAnimation.stop();
        this.textObjectAnimation = null;
        this.startSequenceNode.visible = false;
        this.startSequenceNode.removeAllChildren();
      }
    } );
  }

  public reset() {
    this.pointsAwardedNodeVisibleProperty.reset();
    this.answerButtons.reset();
  }

  /**
   * Sets up a new challenge in the model and in the view.
   */
  private newChallenge() {
    // @ts-ignore TODO-TS
    this.level.newChallenge();
    this.pointsAwardedNodeVisibleProperty.value = false;
    this.answerButtons.reset();
    if ( NumberPlayQueryParameters.showCorrectAnswer ) {
      // @ts-ignore TODO-TS
      this.answerButtons.showCorrectAnswer( this.level.challengeNumberProperty );
    }
  }

  /**
   * Shows or hides a frowny face - if shown, animates it to fade out when the user made an incorrect guess.
   *
   * @param {boolean} showFrownyFace
   */
  private setFrownyFaceVisibility( showFrownyFace: boolean ) {

    this.frownyFaceNode.visible = showFrownyFace;

    if ( showFrownyFace ) {

      // Animate opacity of frownyFaceNode, fade it out.
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

  /**
   * Animates an object in the start sequence to fade out
   * @param {Array} startSequenceText - array of the text that will make the start sequence
   * @param {Vector2} centerPosition
   */
  private setTextObjectVisibility( startSequenceText: string[], centerPosition: Vector2 ) {
    this.level.startSequencePlayingProperty.value = true;

    // create and add textObject
    const textObject = new Text( startSequenceText[ 0 ], {
      font: new PhetFont( 55 )
    } );
    textObject.center = centerPosition;
    this.startSequenceNode.addChild( textObject );
    this.startSequenceNode.visible = true;

    // Animate opacity of textObject, fade it out.
    textObject.opacityProperty.value = 1;
    this.textObjectAnimation = new Animation( {
      delay: 0.5,
      duration: 0.5,
      targets: [ {
        property: textObject.opacityProperty,
        easing: Easing.LINEAR,
        to: 0
      } ]
    } );

    this.textObjectAnimation.finishEmitter.addListener( () => {
      this.startSequenceNode.visible = false;
      this.textObjectAnimation = null;
      startSequenceText.shift();
      // animate the remaining objects in the start sequence if there are any remaining or start the game
      if ( startSequenceText.length > 0 ) {
        this.setTextObjectVisibility( startSequenceText, textObject.center );
      }
      else {
        this.level.startSequencePlayingProperty.reset();
        this.newChallenge();
      }
    } );

    this.textObjectAnimation.start();
  }
}

numberPlay.register( 'SubitizeGameLevelNode', SubitizeGameLevelNode );
export default SubitizeGameLevelNode;