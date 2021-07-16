// Copyright 2021, University of Colorado Boulder

/**
 * Class for a 'Compare Number Line' Node, which creates a number line with two dynamic points that represent the value
 * of the given left and right current numbers.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Shape from '../../../../kite/js/Shape.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import numberPlay from '../../numberPlay.js';

// constants
const PIXELS_PER_MINOR_TICK_MARK = 20;

// colors
const GREEN = '#96e2a8';
const ORANGE = '#f7d19f';

class CompareNumberLineNode extends Node {

  /**
   * @param {NumberProperty} leftCurrentNumberProperty
   * @param {NumberProperty} rightCurrentNumberProperty
   */
  constructor( leftCurrentNumberProperty, rightCurrentNumberProperty ) {
    super();

    const numberLineNode = CompareNumberLineNode.getNumberLineNode( leftCurrentNumberProperty.range, true );
    this.addChild( numberLineNode );

    const leftCurrentNumberIndicatorNode = getCurrentNumberIndicatorNode( LeftRightDirection.LEFT, GREEN );
    numberLineNode.addChild( leftCurrentNumberIndicatorNode );

    const rightCurrentNumberIndicatorNode = getCurrentNumberIndicatorNode( LeftRightDirection.RIGHT, ORANGE );
    numberLineNode.addChild( rightCurrentNumberIndicatorNode );

    // update the leftCurrentNumberIndicatorNodes when leftCurrentNumberProperty changes
    leftCurrentNumberProperty.link( leftCurrentNumber => {
      leftCurrentNumberIndicatorNode.centerY = PIXELS_PER_MINOR_TICK_MARK * -leftCurrentNumber;
    } );

    // update the rightCurrentNumberIndicatorNodes when rightCurrentNumberProperty changes
    rightCurrentNumberProperty.link( rightCurrentNumber => {
      rightCurrentNumberIndicatorNode.centerY = PIXELS_PER_MINOR_TICK_MARK * -rightCurrentNumber;
    } );
  }

  /**
   * Draws a number line node in a vertical orientation. Major tick marks are wider, have a heavier stroke, and include
   * a number label if specified.
   *
   * @param {Range} range (inclusive)
   * @param {boolean} includeLabels
   * @returns {Node}
   * @public
   */
  static getNumberLineNode( range, includeLabels ) {
    const minorTickMarksPerMajorTickMark = 4;
    const minorLineWidth = 1;
    const majorLineWidth = 2;
    const minorTickMarkHalfLineLength = 9;
    const majorTickMarkHalfLineLength = 14;

    const numberLineDistance = range.max - range.min;

    // create the base vertical line
    const numberLineShape = new Shape().moveTo( 0, 0 ).lineTo( 0, -numberLineDistance * PIXELS_PER_MINOR_TICK_MARK );
    const numberLineNode = new Path( numberLineShape, {
      stroke: Color.BLACK,
      lineWidth: minorLineWidth
    } );

    // add the minor and major tick marks
    for ( let i = 0; i <= numberLineDistance; i++ ) {
      const isMajorTickMark = i % ( minorTickMarksPerMajorTickMark + 1 ) === 0;
      const tickMarkHalfLength = isMajorTickMark ? majorTickMarkHalfLineLength : minorTickMarkHalfLineLength;

      const tickMarkShape = new Shape().moveTo( -tickMarkHalfLength, -i * PIXELS_PER_MINOR_TICK_MARK )
        .lineTo( tickMarkHalfLength, -i * PIXELS_PER_MINOR_TICK_MARK );
      const tickMarkNode = new Path( tickMarkShape, {
        stroke: Color.BLACK,
        lineWidth: isMajorTickMark ? majorLineWidth : minorLineWidth
      } );

      numberLineNode.addChild( tickMarkNode );
    }

    return numberLineNode;
  }
}

/**
 * Creates an indicator for the number line, which consists of a point with a triangle attached to it.
 * @param {LeftRightDirection} triangleSide
 * @param {string} triangleColor
 * @private
 */
const getCurrentNumberIndicatorNode = ( triangleSide, triangleColor ) => {
  const circle = new Circle( 5, { fill: Color.BLACK } );
  return circle;
};

const LeftRightDirection = Enumeration.byKeys( [ 'LEFT', 'RIGHT' ] );

numberPlay.register( 'CompareNumberLineNode', CompareNumberLineNode );
export default CompareNumberLineNode;