// Copyright 2021, University of Colorado Boulder

import { Color, Node, Rectangle } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// constants
const WIDTH = 280;
const HEIGHT = 30;
const LINE_WIDTH = 2;
const OUTER_CORNER_RADIUS = 8;
const INNER_CORNER_RADIUS = OUTER_CORNER_RADIUS - LINE_WIDTH / 2;

class SubitizeStartSequenceNode extends Node {

  private readonly startSequencePlayingProperty: BooleanProperty;
  private readonly newChallenge: () => void;
  private fillRectangleAnimation: Animation | null;
  private readonly fillRectangleWidthProperty: NumberProperty;

  constructor( newChallenge: () => void, startSequencePlayingProperty: BooleanProperty ) {
    super();

    // for use in end
    this.newChallenge = newChallenge;

    this.startSequencePlayingProperty = startSequencePlayingProperty;

    // the rectangle that is a border to the filled rectangle
    const borderRectangle = new Rectangle( 0, 0, WIDTH, HEIGHT, OUTER_CORNER_RADIUS, OUTER_CORNER_RADIUS, {
      fill: Color.WHITE,
      stroke: Color.BLACK,
      lineWidth: LINE_WIDTH
    } );
    borderRectangle.center = Vector2.ZERO;
    this.addChild( borderRectangle );

    // the rectangle that whose width will increase from left to right to 'fill' the border rectangle
    const fillRectangle = new Rectangle( 0, LINE_WIDTH / 2, 0, HEIGHT - LINE_WIDTH, INNER_CORNER_RADIUS, INNER_CORNER_RADIUS, {
      fill: NumberPlayConstants.SUBITIZE_GAME_COLOR
    } );
    fillRectangle.left = borderRectangle.left + LINE_WIDTH;
    fillRectangle.centerY = borderRectangle.centerY;
    this.addChild( fillRectangle );

    // for use in the animation
    this.fillRectangleWidthProperty = new NumberProperty( 0 );
    this.fillRectangleAnimation = null;

    this.reset();

    this.fillRectangleWidthProperty.link( fillRectangleWidth => {
      fillRectangle.setRectWidth( fillRectangleWidth );
    } );
  }

  /**
   * Reset the start sequence by cancelling any existing animation and recreating the animation to fill the rectangle.
   */
  public reset(): void {
    this.visible = false;

    if ( this.fillRectangleAnimation ) {
      this.fillRectangleAnimation.stop();
      this.fillRectangleAnimation = null;
    }

    this.fillRectangleWidthProperty.reset();

    this.fillRectangleAnimation = new Animation( {
      delay: 0.1,
      duration: 1.2,
      targets: [ {
        property: this.fillRectangleWidthProperty,
        easing: Easing.LINEAR,
        to: WIDTH - LINE_WIDTH
      } ]
    } );

    this.fillRectangleAnimation.finishEmitter.addListener( () => this.end() );
  }

  /**
   * Start the start sequence by making the start sequence node visible and starting the animation.
   */
  public start(): void {
    this.visible = true;
    this.startSequencePlayingProperty.value = true;
    this.fillRectangleAnimation && this.fillRectangleAnimation.start();
  }

  /**
   * End the start sequence by hiding the start sequence node, and starting a new challenge.
   */
  private end(): void {
    this.visible = false;
    this.fillRectangleAnimation = null;
    this.newChallenge();
    this.startSequencePlayingProperty.reset();
  }
}

numberPlay.register( 'SubitizeStartSequenceNode', SubitizeStartSequenceNode );
export default SubitizeStartSequenceNode;