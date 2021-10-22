// Copyright 2021, University of Colorado Boulder

/**
 * SubitizeGameLevelNode is the class for a 'Subitize' game level view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ResetShape from '../../../../scenery-phet/js/ResetShape.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import SpeechSynthesisButton from '../../common/view/SpeechSynthesisButton.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameAnswerButtons from './NumberPlayGameAnswerButtons.js';
import NumberPlayGameLevelNode from './NumberPlayGameLevelNode.js';
import SubitizerView from './SubitizerView.js';

class SubitizeGameLevelNode extends NumberPlayGameLevelNode {

  /**
   * @param {SubitizeGameLevel} level
   * @param {Property.<SubitizeGameLevel>} levelProperty
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty
   */
  constructor( level, levelProperty, layoutBounds, visibleBoundsProperty ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty );

    // create and add the questionText which is the prompt above the subitizerNode box
    const questionText = new Text( level.questionStringProperty.value, {
      font: new PhetFont( 45 )
    } );
    questionText.centerX = layoutBounds.centerX;
    questionText.top = this.statusBar.bottom + 20; // empirically determined
    this.addChild( questionText );

    // create and add the subitizerView
    const subitizerView = new SubitizerView( level.subitizerModel );
    subitizerView.centerX = layoutBounds.centerX;
    subitizerView.top = questionText.bottom + 15; // empirically determined
    this.addChild( subitizerView );

    // create and add the speechSynthesisButton
    const speechSynthesisButton = new SpeechSynthesisButton( level.questionStringProperty );
    speechSynthesisButton.setLeftCenter( questionText.getRightCenter() );
    speechSynthesisButton.left = subitizerView.right + 10; // empirically determined
    this.addChild( speechSynthesisButton );

    // create and add the showAgainButton which flashes the content in the subitizerView again
    const resetIcon = new Path( new ResetShape( 16 ), { fill: Color.BLACK } );
    const showAgainButton = new RectangularPushButton( {
      content: resetIcon,
      xMargin: 6,
      yMargin: 6,
      baseColor: new Color( 0x8DB3FF )
    } );
    showAgainButton.left = speechSynthesisButton.left;
    showAgainButton.setBottom( subitizerView.getBottom() );
    this.addChild( showAgainButton );

    // @private {FaceNode} - create and add frownyFaceNode which is visible when an incorrect answer button is pressed
    this.frownyFaceNode = new FaceNode( 160 /* headDiameter */, {
      visible: false
    } );
    this.frownyFaceNode.top = subitizerView.top;
    this.frownyFaceNode.right = layoutBounds.maxX - 45; // empirically determined
    this.frownyFaceNode.frown();
    this.addChild( this.frownyFaceNode );
    this.frownyFaceAnimation = null; // {Animation|null}

    // create and add smileyFaceNode which is visible when a challenge is solved, meaning a correct answer button was pressed
    const smileyFaceNode = new FaceNode( 160 /* headDiameter */, {
      visibleProperty: level.isSolvedProperty
    } );
    smileyFaceNode.top = subitizerView.top;
    smileyFaceNode.centerX = this.frownyFaceNode.centerX;
    this.addChild( smileyFaceNode );

    // create and add pointsAwardedNode which is shown when a correct guess is made on the first answerButtons press
    const pointsAwardedNodeVisibleProperty = new BooleanProperty( false );
    const starNode = new StarNode( { value: 1, scale: 3 } );
    starNode.centerX = this.frownyFaceNode.centerX;
    starNode.top = this.frownyFaceNode.bottom + 40; // empirically determined
    const pointsNode = new Text( '+1', { font: new PhetFont( 30 ), fill: 'black' } );
    pointsNode.center = starNode.center;
    pointsNode.centerY += 5;
    const pointsAwardedNode = new Node( {
      children: [ starNode, pointsNode ],
      visibleProperty: pointsAwardedNodeVisibleProperty
    } );
    this.addChild( pointsAwardedNode );

    // create and add the answerButtons
    const answerButtons = new NumberPlayGameAnswerButtons( level,
      pointsAwardedNodeVisibleProperty, showFrownyFace => this.toggleFrownyFaceVisibility( showFrownyFace ) );
    answerButtons.centerX = subitizerView.centerX;
    answerButtons.top = subitizerView.bottom + 40; // empirically determined
    this.addChild( answerButtons );

    // listener for the next button and for resetting the level
    const newChallenge = () => {
      level.isSolvedProperty.reset();
      pointsAwardedNode.visible = false;
      answerButtons.reset();
      level.subitizeNumberProperty.value = dotRandom.nextIntBetween( 1, 5 );
    };
    level.newSubitizeNumberEmitter.addListener( newChallenge );

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
      listener: newChallenge
    } );
    newChallengeButton.centerX = smileyFaceNode.centerX;
    newChallengeButton.centerY = answerButtons.centerY;
    this.addChild( newChallengeButton );
  }

  /**
   * Shows or hides a frowny face - if shown, animates it to fade out when the user made an incorrect guess.
   *
   * @param {boolean} showFrownyFace
   * @private
   */
  toggleFrownyFaceVisibility( showFrownyFace ) {

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
}

numberPlay.register( 'SubitizeGameLevelNode', SubitizeGameLevelNode );
export default SubitizeGameLevelNode;