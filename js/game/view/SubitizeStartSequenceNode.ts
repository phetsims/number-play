// Copyright 2021, University of Colorado Boulder

import Node from '../../../../scenery/js/nodes/Node.js';
import numberPlay from '../../numberPlay.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Color from '../../../../scenery/js/util/Color.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// constants
const X_DISTANCE_BETWEEN_CIRCLES = 120; // empirically determined
const NUMBER_OF_CIRCLES = 3;

class SubitizeStartSequenceNode extends Node {

  private readonly layoutBounds: Bounds2;
  private readonly startSequencePlayingProperty: BooleanProperty;
  private secondsSinceFill: number;
  private readonly numberOfCirclesFilledProperty: NumberProperty;
  private readonly newChallenge: () => void;

  constructor( layoutBounds: Bounds2, newChallenge: () => void, startSequencePlayingProperty: BooleanProperty ) {
    super();

    // for use in reset
    this.layoutBounds = layoutBounds;

    // for use in end
    this.newChallenge = () => newChallenge();

    this.startSequencePlayingProperty = startSequencePlayingProperty;
    this.secondsSinceFill = 0;
    this.numberOfCirclesFilledProperty = new NumberProperty( 0 );

    this.reset();
  }

  /**
   * Reset the start sequence by removing all circles and adding 'non-filled' circles (the fill color is the same as the
   * background).
   */
  public reset(): void {
    this.numberOfCirclesFilledProperty.reset();
    this.secondsSinceFill = 0;
    this.removeAllChildren();
    let xStart = this.layoutBounds.centerX - X_DISTANCE_BETWEEN_CIRCLES;
    for ( let i = 0; i < NUMBER_OF_CIRCLES; i++ ) {
      const circle = SubitizeStartSequenceNode.drawCircle();
      circle.centerX = xStart;
      circle.centerY = this.layoutBounds.centerY - 90; // empirically determined
      this.addChild( circle );
      xStart += X_DISTANCE_BETWEEN_CIRCLES;
    }
  }

  /**
   * Draw a non-filled circle as default. Draw a filled circle if an old circle is passed in from fillCircle().
   */
  private static drawCircle( oldCirclePosition?: Vector2 ): Circle {
    const circle = new Circle( 40, {
      stroke: 'purple',
      lineWidth: 5,
      fill: oldCirclePosition ? 'purple' : Color.WHITE
    } );
    if ( oldCirclePosition ) {
      circle.center = oldCirclePosition;
    }
    return circle;
  }

  /**
   * Fill in the circle whose number is the value of this.numberOfCirclesFilledProperty.
   */
  private fillCircle(): void {
    this.numberOfCirclesFilledProperty.value++;
    console.log( 'circles filled = ' + this.numberOfCirclesFilledProperty.value );
    const circle = this.getChildAt( this.numberOfCirclesFilledProperty.value - 1 );
    this.replaceChild( circle, SubitizeStartSequenceNode.drawCircle( circle.center ) );
  }

  public step( dt: number ): void {
    if ( this.startSequencePlayingProperty.value ) {
      this.secondsSinceFill += dt;

      // fill a circle every second until all circles are filled, where the start sequence ends
      if ( this.secondsSinceFill >= 1 ) {
        if ( this.numberOfCirclesFilledProperty.value >= NUMBER_OF_CIRCLES ) {
          this.end();
        }
        else {
          this.fillCircle();
          this.secondsSinceFill = 0;
        }
      }
    }
  }

  /**
   * End the start sequence by hiding the start sequence node, and starting a new challenge.
   */
  private end(): void {
    this.visible = false;
    this.newChallenge();
    this.startSequencePlayingProperty.reset();
  }

  /**
   * Start the start sequence by filling in the first circle.
   */
  public start(): void {
    this.startSequencePlayingProperty.value = true;
    this.fillCircle();
  }
}

numberPlay.register( 'SubitizeStartSequenceNode', SubitizeStartSequenceNode );
export default SubitizeStartSequenceNode;