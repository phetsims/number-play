// Copyright 2021-2022, University of Colorado Boulder

/**
 * Class for a 'Compare Number Line' Node, which creates a number line with two dynamic points that represent the value
 * of the given left and right current numbers.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, Color, Node, Path, Text } from '../../../../scenery/js/imports.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import numberPlay from '../../numberPlay.js';
import Range from '../../../../dot/js/Range.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';

// types
type GetNumberLineNodeOptions = {
  includeLabels: boolean,
  minorLineWidth: number,
  majorLineWidth: number,
  minorTickMarkHalfLineLength: number,
  majorTickMarkHalfLineLength: number
};

// constants
const PIXELS_PER_TICK_MARK = 20; // the number of pixels between the center of two tick marks, in screen coordinates
const INTEGERS_PER_MAJOR_TICK_MARK = 5; // the number of integers between two major tick marks

class CompareNumberLineNode extends Node {

  constructor( leftCurrentNumberProperty: NumberProperty, rightCurrentNumberProperty: NumberProperty ) {
    super();

    // create and add the number line
    const numberLineNode = CompareNumberLineNode.getNumberLineNode( leftCurrentNumberProperty.range! );
    this.addChild( numberLineNode );

    // create and add an indicator for the leftCurrentNumberProperty
    const leftCurrentNumberIndicatorNode = CompareNumberLineNode.getCurrentNumberIndicatorNode(
      LeftRightDirection.LEFT,
      NumberPlayColors.mediumGreenBackgroundColorProperty
    );
    numberLineNode.addChild( leftCurrentNumberIndicatorNode );

    // create and add an indicator for the rightCurrentNumberProperty
    const rightCurrentNumberIndicatorNode = CompareNumberLineNode.getCurrentNumberIndicatorNode(
      LeftRightDirection.RIGHT,
      NumberPlayColors.mediumOrangeBackgroundColorProperty
    );
    numberLineNode.addChild( rightCurrentNumberIndicatorNode );

    // update the leftCurrentNumberIndicatorNodes when leftCurrentNumberProperty changes
    leftCurrentNumberProperty.link( leftCurrentNumber => {
      leftCurrentNumberIndicatorNode.centerY = PIXELS_PER_TICK_MARK * -leftCurrentNumber;
    } );

    // update the rightCurrentNumberIndicatorNodes when rightCurrentNumberProperty changes
    rightCurrentNumberProperty.link( rightCurrentNumber => {
      rightCurrentNumberIndicatorNode.centerY = PIXELS_PER_TICK_MARK * -rightCurrentNumber;
    } );
  }

  /**
   * Draws a number line node in a vertical orientation with minor + major tick marks and number labels on the major
   * tick marks.
   *
   * @param range - inclusive
   * @param [providedOptions]
   */
  public static getNumberLineNode( range: Range, providedOptions?: Partial<GetNumberLineNodeOptions> ): Node {

    const options = merge( {
      includeLabels: true,
      minorLineWidth: 1,
      majorLineWidth: 2,
      minorTickMarkHalfLineLength: 9,
      majorTickMarkHalfLineLength: 16
    }, providedOptions ) as GetNumberLineNodeOptions;
    const numberLineDistance = range.getLength();

    // create the base vertical line
    const numberLineShape = new Shape().moveTo( 0, 0 ).lineTo( 0, -numberLineDistance * PIXELS_PER_TICK_MARK );
    const numberLineNode = new Path( numberLineShape, {
      stroke: Color.BLACK,
      lineWidth: options.minorLineWidth
    } );

    // create tick marks at each integer on the number line, plus labels for the major tick marks
    for ( let i = 0; i <= numberLineDistance; i++ ) {
      const isMajorTickMark = i % INTEGERS_PER_MAJOR_TICK_MARK === 0;
      const tickMarkHalfLength = isMajorTickMark ? options.majorTickMarkHalfLineLength : options.minorTickMarkHalfLineLength;

      // create and add a major or minor tick mark
      const tickMarkShape = new Shape().moveTo( -tickMarkHalfLength, -i * PIXELS_PER_TICK_MARK )
        .lineTo( tickMarkHalfLength, -i * PIXELS_PER_TICK_MARK );
      const tickMarkNode = new Path( tickMarkShape, {
        stroke: Color.BLACK,
        lineWidth: isMajorTickMark ? options.majorLineWidth : options.minorLineWidth
      } );
      numberLineNode.addChild( tickMarkNode );

      // create and add a label for a major tick mark
      if ( options.includeLabels && isMajorTickMark ) {
        const tickMarkLabel = new Text( i, { font: new PhetFont( 12 ) } );
        tickMarkLabel.right = tickMarkNode.left - 8;
        tickMarkLabel.centerY = tickMarkNode.centerY;
        numberLineNode.addChild( tickMarkLabel );
      }
    }

    return numberLineNode;
  }

  /**
   * Creates an indicator for the number line, which consists of a point with a triangle attached to it on the left or
   * right side.
   */
  private static getCurrentNumberIndicatorNode( triangleSide: LeftRightDirection, triangleColor: PaintDef ) {

    // create the center point
    const pointRadius = 5;
    const pointNode = new Circle( pointRadius, { fill: Color.BLACK } );

    // create and add the triangle on the left or right side
    const sign = triangleSide === LeftRightDirection.LEFT ? -1 : 1;
    const triangleOrigin = new Vector2( sign * ( pointRadius - 1 ), 0 ); // empirically determined
    const triangleLongerSideLength = 20; // empirically determined
    const triangleShorterSideLength = triangleLongerSideLength * 0.8; // empirically determined
    const triangleShape = new Shape()
      .moveToPoint( triangleOrigin )
      .lineToRelative( sign * triangleLongerSideLength / Math.sqrt( 2 ), -triangleShorterSideLength / 2 )
      .lineToRelative( 0, triangleShorterSideLength )
      .lineToPoint( triangleOrigin ).close();
    const triangleNode = new Path( triangleShape, {
      fill: triangleColor
    } );
    pointNode.addChild( triangleNode );

    return pointNode;
  }
}

/**
 * Enumeration for specifying which side the triangle should go on for the indicator node above.
 */
class LeftRightDirection extends EnumerationValue {
  static LEFT = new LeftRightDirection();
  static RIGHT = new LeftRightDirection();

  static enumeration = new Enumeration( LeftRightDirection );
}

numberPlay.register( 'CompareNumberLineNode', CompareNumberLineNode );
export default CompareNumberLineNode;