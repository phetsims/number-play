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
import { Color, ColorProperty, HBox, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import numberPlay from '../../numberPlay.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CountingGameLevel from '../model/CountingGameLevel.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';

// types
type AnswerButtonsOptions = {
  buttonColor: ColorProperty;
  buttonSpacing: number,
  dependencyEnabledProperty: BooleanProperty
}
type ButtonObject = {
  value: number,
  button: RectangularPushButton,
  rectangle: Rectangle,
  enabledProperty: BooleanProperty
};

// constants
const BUTTON_TEXT_OPTIONS = { font: new PhetFont( 45 ) };
const BUTTON_DIMENSION = new Dimension2( 80, 100 );
const BUTTON_OBJECT_CORNER_RADIUS = 10;

class NumberPlayGameAnswerButtons extends Node {

  private readonly buttonObjects: ButtonObject[];
  private readonly hBox: HBox;
  private readonly buttonListener: ( index: number ) => void;
  public static BUTTON_DIMENSION: Dimension2;

  constructor( level: SubitizeGameLevel | CountingGameLevel,
               pointAwardedNodeVisibleProperty: BooleanProperty,
               rightAnswerCallback: () => void,
               wrongAnswerCallback: () => void,
               providedOptions?: Partial<AnswerButtonsOptions> ) {
    super();

    const options = merge( {
      buttonColor: Color.WHITE,
      buttonSpacing: 18,
      dependencyEnabledProperty: new BooleanProperty( true )
    }, providedOptions ) as AnswerButtonsOptions;

    this.buttonObjects = [];

    /**
     * Listener that is added to every answer button. It disabled selected buttons that are wrong, and turns correct
     * answer buttons green.
     */
    const buttonListener = ( index: number ) => {
      level.numberOfAnswerButtonPressesProperty.value++;
      const buttonObject = this.buttonObjects[ index ];

      // this button is the correct answer button
      if ( level.challengeNumberProperty.value === buttonObject.value ) {
        level.isChallengeSolvedProperty.value = true;
        rightAnswerCallback();

        this.hBox.replaceChild( buttonObject.button, buttonObject.rectangle );

        // if this is the first guess, increase the score
        if ( level.numberOfAnswerButtonPressesProperty.value === 1 ) {
          level.scoreProperty.value++;
          pointAwardedNodeVisibleProperty.value = true;
        }
      }
      else {
        pointAwardedNodeVisibleProperty.value = false;
        wrongAnswerCallback();

        // disable incorrect answer button
        buttonObject.enabledProperty.value = false;
      }
    };

    // create the buttons and green rectangles together
    for ( let i = 0; i < level.challengeRange.getLength() + 1; i++ ) {
      const value = i + level.challengeRange.min;

      // used to disable individual buttons but the true 'enabledProperty' for this button relies on other Properties
      // too, see the DerivedProperty usage below
      const enabledProperty = new BooleanProperty( true );
      const button = new RectangularPushButton( {
        content: new Text( value, BUTTON_TEXT_OPTIONS ),
        baseColor: options.buttonColor,
        size: BUTTON_DIMENSION,
        cornerRadius: BUTTON_OBJECT_CORNER_RADIUS,
        yMargin: 24,
        touchAreaXDilation: NumberPlayConstants.TOUCH_AREA_DILATION,
        touchAreaYDilation: NumberPlayConstants.TOUCH_AREA_DILATION,
        enabledProperty: new DerivedProperty( [ level.isChallengeSolvedProperty, enabledProperty, options.dependencyEnabledProperty ],
          ( isChallengeSolved, enabled, dependencyEnabled ) => !isChallengeSolved && enabled && dependencyEnabled ),
        listener: () => buttonListener( i )
      } );

      // create and replace the correct answer button with a rectangle and the correct number on top
      const rectangle = new Rectangle( 0, 0, BUTTON_DIMENSION.width, BUTTON_DIMENSION.height, {
        fill: Color.GREEN,
        cornerRadius: BUTTON_OBJECT_CORNER_RADIUS,
        lineWidth: 0.5,
        stroke: Color.GRAY
      } );
      const correctAnswerText = new Text( value, BUTTON_TEXT_OPTIONS );
      correctAnswerText.center = rectangle.center;
      rectangle.addChild( correctAnswerText );

      this.buttonObjects.push( {
        value: value,
        button: button,
        rectangle: rectangle,
        enabledProperty: enabledProperty
      } );
    }

    this.hBox = new HBox( {
      children: this.buttonObjects.map( buttonObject => buttonObject.button ),
      spacing: options.buttonSpacing
    } );
    this.addChild( this.hBox );

    this.buttonListener = buttonListener;
  }

  /**
   * Fires the button listener on the correct answer button.
   */
  public showAnswer( challengeNumberProperty: NumberProperty ): void {
    const buttonObjectIndex = challengeNumberProperty.value - challengeNumberProperty.range!.min;
    this.buttonListener( buttonObjectIndex );
  }

  /**
   * Returns everything in the HBox to its original button state.
   */
  public reset(): void {
    this.buttonObjects.forEach( buttonObject => buttonObject.enabledProperty.reset() );
    this.hBox.children = this.buttonObjects.map( buttonObject => buttonObject.button );
  }
}

NumberPlayGameAnswerButtons.BUTTON_DIMENSION = BUTTON_DIMENSION;

numberPlay.register( 'NumberPlayGameAnswerButtons', NumberPlayGameAnswerButtons );
export default NumberPlayGameAnswerButtons;