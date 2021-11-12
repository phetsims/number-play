// Copyright 2021, University of Colorado Boulder

/**
 * SubitizeGameLevelNode is the class for a 'Subitize' game level view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PlayIconShape from '../../../../scenery-phet/js/PlayIconShape.js';
import ResetShape from '../../../../scenery-phet/js/ResetShape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import SpeechSynthesisButton from '../../common/view/SpeechSynthesisButton.js';
import numberPlay from '../../numberPlay.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import NumberPlayGameLevelNode from './NumberPlayGameLevelNode.js';
import SubitizerNode from './SubitizerNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import CardinalityGameLevel from '../model/CardinalityGameLevel.js';
import NumberPlayGameAnswerButtons from './NumberPlayGameAnswerButtons.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import SceneryPhetConstants from '../../../../scenery-phet/js/SceneryPhetConstants.js';

class SubitizeGameLevelNode extends NumberPlayGameLevelNode<SubitizeGameLevel> {

  private textObjectAnimation: Animation | null;
  private readonly startSequenceNode: Node;

  /**
   * @param {SubitizeGameLevel} level
   * @param {Property.<SubitizeGameLevel|null>} levelProperty
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty
   */
  constructor( level: SubitizeGameLevel,
               levelProperty: Property<SubitizeGameLevel | CardinalityGameLevel | null>,
               layoutBounds: Bounds2,
               visibleBoundsProperty: Property<Bounds2> ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty, NumberPlayConstants.SUBITIZE_GAME_COLOR );

    // create and add the answer buttons
    this.answerButtons = new NumberPlayGameAnswerButtons( level, this.pointsAwardedNodeVisibleProperty, () => {
      this.setFrownyFaceVisibility( false );
      level.subitizer.isPlayingProperty.reset();
      level.subitizer.visibleProperty.value = true;
    }, () => {
      this.setFrownyFaceVisibility( true );
    }, {
      buttonSpacing: 40, // empirically determined
      enabledPropertyDependency: level.subitizer.isPlayingProperty
    } );
    this.answerButtons.centerX = layoutBounds.centerX;
    this.answerButtons.bottom = layoutBounds.maxY - 58; // TODO magic number
    this.addChild( this.answerButtons );

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
    const showAgainButtonSideLength = SceneryPhetConstants.DEFAULT_BUTTON_RADIUS * 2;
    const showAgainButtonMargin = 6;
    const showAgainButton = new RectangularPushButton( {
      content: resetIcon,
      xMargin: showAgainButtonMargin,
      yMargin: showAgainButtonMargin,
      size: new Dimension2( showAgainButtonSideLength, showAgainButtonSideLength ),
      baseColor: NumberPlayConstants.SUBITIZE_GAME_COLOR,
      enabledProperty: new DerivedProperty( [ level.isSolvedProperty, level.subitizer.isPlayingProperty, level.subitizer.visibleProperty ],
        ( isSolved: boolean, isPlaying: boolean, subitizerVisible: boolean ) => !isSolved && isPlaying && !subitizerVisible ),
      listener: () => {
        level.subitizer.visibleProperty.value = true;
      }
    } );
    showAgainButton.left = speechSynthesisButton.left;
    showAgainButton.bottom = subitizerNode.bottom;
    this.addChild( showAgainButton );

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
    super.reset();
  }

  protected answerButtons: NumberPlayGameAnswerButtons;

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