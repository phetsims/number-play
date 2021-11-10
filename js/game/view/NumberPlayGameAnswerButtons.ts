// Copyright 2021, University of Colorado Boulder

/**
 * NumberPlayGameAnswerButtons are buttons that can be selected to input an answer to a game.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import numberPlay from '../../numberPlay.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CardinalityGameLevel from '../model/CardinalityGameLevel.js';

// types
type ButtonObject = {
  value: number,
  button: RectangularPushButton,
  rectangle: Rectangle,
  enabledProperty: BooleanProperty
};

// constants
const ANSWER_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 45 ) };
const BUTTON_DIMENSION = new Dimension2( 80, 100 );

class NumberPlayGameAnswerButtons extends Node {
  private readonly buttonObjects: ButtonObject[];
  private level: SubitizeGameLevel | CardinalityGameLevel;
  private readonly hBox: HBox;
  private readonly buttonListener: ( index: number ) => void;

  /**
   * @param {SubitizeGameLevel} level
   * @param {BooleanProperty} pointsAwardedNodeVisibleProperty
   * @param {function(boolean)} setFrownyFaceVisibilityCallback
   */
  constructor( level: SubitizeGameLevel | CardinalityGameLevel,
               pointsAwardedNodeVisibleProperty: BooleanProperty,
               rightAnswerCallback: () => void,
               wrongAnswerCallback: () => void,
               enabledPropertyDependency: BooleanProperty = new BooleanProperty( true ) ) {
    super();

    // @private {Object[]}
    this.buttonObjects = [];

    // @private {SubitizeGameLevel}
    this.level = level;

    /**
     * Listener that is added to every answer button. It disabled selected buttons that are wrong, and turns correct
     * answer buttons green.
     *
     * @param {number} index - the index of the button in the group
     */
    const buttonListener = ( index: number ) => {
      level.numberOfAnswerButtonPressesProperty.value++;
      const buttonObject = this.buttonObjects[ index ];

      // this button is the correct answer button
      if ( level.challengeNumberProperty.value === buttonObject.value ) {
        level.isSolvedProperty.value = true;
        rightAnswerCallback();

        this.hBox.replaceChild( buttonObject.button, buttonObject.rectangle );

        // if this is the first guess, increase the score
        if ( level.numberOfAnswerButtonPressesProperty.value === 1 ) {
          level.scoreProperty.value++;
          pointsAwardedNodeVisibleProperty.value = true;
        }
      }
      else {
        pointsAwardedNodeVisibleProperty.value = false;
        wrongAnswerCallback();

        // disable incorrect answer button
        buttonObject.enabledProperty.value = false;
      }
    };

    // create the buttons and green rectangles together
    for ( let i = 0; i < level.challengeRange.getLength() + 1; i++ ) {
      const value = i + level.challengeRange.min;

      // used to disable individual buttons but the true 'enabledProperty' for this button relies on other properties too,
      // see the derived property usage below
      const enabledProperty = new BooleanProperty( true );
      const button = new RectangularPushButton( {
        content: new Text( value, ANSWER_BUTTON_TEXT_OPTIONS ),
        baseColor: Color.YELLOW,
        size: BUTTON_DIMENSION,
        cornerRadius: 10,
        yMargin: 24,
        enabledProperty: new DerivedProperty( [ level.isSolvedProperty, enabledProperty, enabledPropertyDependency ],
          ( isSolved: boolean, isPlaying: boolean, enabled: boolean ) => !isSolved && isPlaying && enabled ),
        listener: () => buttonListener( i )
      } );

      // create and replace the correct answer button with a rectangle and the correct number on top
      const rectangle = new Rectangle( 0, 0, BUTTON_DIMENSION.width, BUTTON_DIMENSION.height, {
        fill: Color.GREEN,
        cornerRadius: 10
      } );
      const correctAnswerText = new Text( value, ANSWER_BUTTON_TEXT_OPTIONS );
      correctAnswerText.center = rectangle.center;
      rectangle.addChild( correctAnswerText );

      this.buttonObjects.push( {
        value: value,
        button: button,
        rectangle: rectangle,
        enabledProperty: enabledProperty
      } );
    }

    // @private {HBox}
    this.hBox = new HBox( {
      children: this.buttonObjects.map( buttonObject => buttonObject.button ),
      spacing: 40
    } );
    this.addChild( this.hBox );

    // @private - for use in showCorrectAnswer
    this.buttonListener = buttonListener;
  }

  /**
   * Fires button listener on the correct answer button.
   *
   * @param {NumberProperty} challengeNumberProperty
   */
  public showCorrectAnswer( challengeNumberProperty: NumberProperty ) {
    const index = challengeNumberProperty.value - challengeNumberProperty.range!.min;
    this.buttonListener( index );
  }

  /**
   * Returns everything in the HBox to its original button state.
   */
  public reset() {
    this.buttonObjects.forEach( object => object.enabledProperty.reset() );
    this.hBox.children = this.buttonObjects.map( object => object.button );
  }
}

numberPlay.register( 'NumberPlayGameAnswerButtons', NumberPlayGameAnswerButtons );
export default NumberPlayGameAnswerButtons;