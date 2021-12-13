// Copyright 2021, University of Colorado Boulder

/**
 * SubitizeLoadingBarNode contains the loading bar animation that happens after the user presses play when they enter
 * the subitize game screen.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Color, Node, Rectangle } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';

// constants
const RECTANGLE_WIDTH = 280;
const RECTANGLE_HEIGHT = 30;
const RECTANGLE_LINE_WIDTH = 2;
const RECTANGLE_OUTER_CORNER_RADIUS = 8;
const RECTANGLE_INNER_CORNER_RADIUS = RECTANGLE_OUTER_CORNER_RADIUS - RECTANGLE_LINE_WIDTH / 2;

class SubitizeLoadingBarNode extends Node {

  private readonly isLoadingBarAnimatingProperty: BooleanProperty;
  private readonly newChallengeCallback: () => void;
  private loadingBarAnimation: Animation | null;
  private readonly loadingBarWidthProperty: NumberProperty;

  constructor( newChallengeCallback: () => void, isLoadingBarAnimatingProperty: BooleanProperty ) {
    super();

    this.newChallengeCallback = newChallengeCallback;
    this.isLoadingBarAnimatingProperty = isLoadingBarAnimatingProperty;

    // the rectangle that is a border to the filled rectangle
    const borderRectangle = new Rectangle( 0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT, RECTANGLE_OUTER_CORNER_RADIUS,
      RECTANGLE_OUTER_CORNER_RADIUS, {
        fill: Color.WHITE,
        stroke: Color.BLACK,
        lineWidth: RECTANGLE_LINE_WIDTH
      } );
    borderRectangle.center = Vector2.ZERO;
    this.addChild( borderRectangle );

    // the rectangle whose width will increase from left to right to 'fill' the border rectangle
    const loadingBarRectangle = new Rectangle( 0, RECTANGLE_LINE_WIDTH / 2, 0, RECTANGLE_HEIGHT - RECTANGLE_LINE_WIDTH,
      RECTANGLE_INNER_CORNER_RADIUS, RECTANGLE_INNER_CORNER_RADIUS, {
        fill: NumberPlayColors.subitizeGameColorProperty
      } );
    loadingBarRectangle.left = borderRectangle.left + RECTANGLE_LINE_WIDTH;
    loadingBarRectangle.centerY = borderRectangle.centerY;
    this.addChild( loadingBarRectangle );

    // the width of the loadingBarRectangle during the animation
    this.loadingBarWidthProperty = new NumberProperty( 0, {
      isValidValue: ( value: number ) => ( value >= 0 ) && ( value <= RECTANGLE_WIDTH - RECTANGLE_LINE_WIDTH )
    } );

    // used to store the animation, null if no animation is in progress
    this.loadingBarAnimation = null;

    this.reset();

    this.loadingBarWidthProperty.link( loadingBarWidth => {
      loadingBarRectangle.setRectWidth( loadingBarWidth );
    } );

    // cancel the animation and hide the loading bar node if isLoadingBarAnimatingProperty is set to false
    isLoadingBarAnimatingProperty.link( loadingBarAnimating => !loadingBarAnimating && this.reset() );
  }

  /**
   * Reset the loading bar by cancelling any existing animation and recreating the animation to fill the rectangle.
   */
  private reset(): void {
    this.visible = false;

    if ( this.loadingBarAnimation ) {
      this.loadingBarAnimation.stop();
      this.loadingBarAnimation = null;
    }

    this.loadingBarWidthProperty.reset();

    this.loadingBarAnimation = new Animation( {
      delay: 0.1,
      duration: 2,
      targets: [ {
        property: this.loadingBarWidthProperty,
        easing: Easing.LINEAR,
        to: RECTANGLE_WIDTH - RECTANGLE_LINE_WIDTH
      } ]
    } );

    this.loadingBarAnimation.finishEmitter.addListener( () => this.end() );
  }

  /**
   * Start the loading bar by making the loading bar node visible and starting the animation.
   */
  public start(): void {
    this.visible = true;
    this.isLoadingBarAnimatingProperty.value = true;
    this.loadingBarAnimation && this.loadingBarAnimation.start();
  }

  /**
   * End the loading bar by starting a new challenge.
   */
  private end(): void {
    this.loadingBarAnimation = null;
    this.newChallengeCallback();
  }
}

numberPlay.register( 'SubitizeLoadingBarNode', SubitizeLoadingBarNode );
export default SubitizeLoadingBarNode;