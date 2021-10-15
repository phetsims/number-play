// Copyright 2021, University of Colorado Boulder

/**
 * SubitizeGameLevelNode is the class for a 'Subitize' game level view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import BackButton from '../../../../scenery-phet/js/buttons/BackButton.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ResetShape from '../../../../scenery-phet/js/ResetShape.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import SpeechSynthesisButton from '../../common/view/SpeechSynthesisButton.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevelNode from './NumberPlayGameLevelNode.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Node from '../../../../scenery/js/nodes/Node.js';

// constants
const SUBITIZE_NODE_WIDTH = 425;
const SUBITIZE_NODE_HEIGHT = 275;
const ANSWER_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 45 ) };

class SubitizeGameLevelNode extends NumberPlayGameLevelNode {

  /**
   * @param {SubitizeGameLevel} level
   * @param {Property.<SubitizeGameLevel>} levelProperty
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty
   */
  constructor( level, levelProperty, layoutBounds, visibleBoundsProperty ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty );

    // number of times any button in answerButtons was pressed
    const numberOfAnswerButtonPressesProperty = new NumberProperty( 0, { numberType: 'Integer' } );

    // create and add the questionText which is the prompt above the subitizerNode box
    const questionText = new Text( level.questionStringProperty.value, {
      font: new PhetFont( 45 )
    } );
    questionText.centerX = layoutBounds.centerX;
    questionText.top = this.statusBar.bottom + 20; // empirically determined
    this.addChild( questionText );

    // create and add the subitizerNode
    //TODO: this is a placeholder, see https://github.com/phetsims/number-play/issues/62
    const subitizerNode = new Rectangle( layoutBounds.centerX - SUBITIZE_NODE_WIDTH / 2, layoutBounds.centerY - SUBITIZE_NODE_HEIGHT / 2, SUBITIZE_NODE_WIDTH, SUBITIZE_NODE_HEIGHT, 10, 10, {
      fill: 'white'
    } );
    subitizerNode.top = questionText.bottom + 15; // empirically determined
    this.addChild( subitizerNode );

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
      baseColor: new Color( 0x8DB3FF )
    } );
    showAgainButton.left = speechSynthesisButton.left;
    showAgainButton.setBottom( subitizerNode.getBottom() );
    this.addChild( showAgainButton );

    let correctAnswerButton; // keep track of the correctAnswerButton to show it again it when resetting for new challenge
    // create and add answerButtons which give the options to select between 1 - 5
    const answerButtons = new HBox( { spacing: 40 } );
    for ( let i = 1; i < 6; i++ ) {
      const thisButton = new RectangularPushButton( {
        content: new Text( i, ANSWER_BUTTON_TEXT_OPTIONS ),
        baseColor: Color.YELLOW,
        size: new Dimension2( 80, 100 ),
        cornerRadius: 10,
        xMargin: 26,
        yMargin: 24,
        listener: () => {
          numberOfAnswerButtonPressesProperty.value++;
          if ( level.subitizeNumber === i ) {
            correctAnswerButton = thisButton;
            level.isSolvedProperty.value = true;
            this.frownyFaceNode.visible = false;

            // create and replace the correct answer button with a rectangle and the correct number on top
            const correctAnswerRectangle = new Rectangle( correctAnswerButton.leftTop.x, correctAnswerButton.leftTop.y, correctAnswerButton.width, correctAnswerButton.height, {
              fill: Color.GREEN,
              cornerRadius: 10
            } );
            const correctAnswerText = new Text( level.subitizeNumber, ANSWER_BUTTON_TEXT_OPTIONS );
            correctAnswerText.center = correctAnswerRectangle.center;
            correctAnswerRectangle.addChild( correctAnswerText );
            answerButtons.replaceChild( correctAnswerButton, correctAnswerRectangle );

            // disable all other buttons that are incorrect and not already disabled
            for ( let j = 0; j < answerButtons.getChildrenCount(); j++ ) {
              if ( ( ( j + 1 ) !== i ) && answerButtons.getChildAt( j ).getEnabledProperty().value ) {
                answerButtons.getChildAt( j ).setEnabled( false );
              }
            }

            if ( numberOfAnswerButtonPressesProperty.value === 1 ) {
              level.scoreProperty.value++;
              pointsAwardedNode.visible = true;
            }
          }
          else {
            level.isSolvedProperty.value = false;
            pointsAwardedNode.visible = false;
            this.showFrownyFace();

            // disable incorrect answer button
            thisButton.setEnabled( false );
          }
        }
      } );
      answerButtons.addChild( thisButton );
    }
    answerButtons.centerX = subitizerNode.centerX;
    answerButtons.top = subitizerNode.bottom + 40; // empirically determined
    this.addChild( answerButtons );

    // create and add subitizeNumberText
    //TODO: this is a placeholder, see https://github.com/phetsims/number-play/issues/62
    const subitizeNumberText = new Text( level.subitizeNumber, {
      font: new PhetFont( 60 )
    } );
    subitizeNumberText.center = subitizerNode.center;
    this.addChild( subitizeNumberText );

    // create and add smileyFaceNode which is visible when a challenge is solved, meaning a correct answer button was pressed
    const smileyFaceNode = new FaceNode( 150 /* headDiameter */, {
      visibleProperty: level.isSolvedProperty
    } );
    smileyFaceNode.top = subitizerNode.top;
    smileyFaceNode.left = answerButtons.right;
    this.addChild( smileyFaceNode );

    // @private {FaceNode} - create and add frownyFaceNode which is visible when an incorrect answer button is pressed
    this.frownyFaceNode = new FaceNode( 150 /* headDiameter */, {
      visible: false
    } );
    this.frownyFaceNode.top = subitizerNode.top;
    this.frownyFaceNode.left = answerButtons.right;
    this.frownyFaceNode.frown();
    this.addChild( this.frownyFaceNode );
    this.frownyFaceAnimation = null; // {Animation|null}

    // create and add poinstAwardedNode which is shown when a correct guess is made on the first answerButtons press
    const starNode = new StarNode( { value: 1, scale: 4 } );
    starNode.centerX = this.frownyFaceNode.centerX;
    starNode.top = this.frownyFaceNode.bottom + 40; // empirically determined
    const pointsNode = new Text( '+1', { font: new PhetFont( 40 ), fill: 'black' } );
    pointsNode.center = starNode.center;
    pointsNode.centerY += 5;
    const pointsAwardedNode = new Node( { children: [ starNode, pointsNode ], visible: false } );
    this.addChild( pointsAwardedNode );

    const newChallenge = () => {
      numberOfAnswerButtonPressesProperty.value = 0;
      level.isSolvedProperty.reset();
      pointsAwardedNode.visible = false;

      // enable answerButtons and replace the corectAnswerRectangle with a correctAnswerButton
      for ( let i = 0; i < answerButtons.getChildrenCount(); i++ ) {
        answerButtons.getChildAt( i ).setEnabled( true );
        if ( ( i + 1 ) === level.subitizeNumber ) {
          answerButtons.replaceChild( answerButtons.getChildAt( i ), correctAnswerButton );
        }
      }

      level.subitizeNumber = dotRandom.nextIntBetween( 1, 5 );
      subitizeNumberText.text = level.subitizeNumber;
    };
    //level.newSubitizeNumberEmitter.addListener(newChallenge); //correctAnswerButton undefined??

    // create and add newChallengeButton which is visible when a challenge is solved, meaning a correct answer button was pressed
    const newChallengeButton = new BackButton( {
      baseColor: Color.YELLOW,
      visibleProperty: level.isSolvedProperty,
      listener: newChallenge
    } );
    newChallengeButton.centerX = smileyFaceNode.centerX;
    newChallengeButton.centerY = answerButtons.centerY;
    newChallengeButton.rotateAround( newChallengeButton.center, 3.14 ); //shadow looks weird?
    this.addChild( newChallengeButton );
  }

  /**
   * Shows a frowny face and animates it to fade out when the user made an incorrect guess.
   * @private
   */
  showFrownyFace() {
    // Animate opacity of frownyFaceNode, fade it out.
    this.frownyFaceNode.visible = true;
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

numberPlay.register( 'SubitizeGameLevelNode', SubitizeGameLevelNode );
export default SubitizeGameLevelNode;