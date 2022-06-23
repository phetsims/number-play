// Copyright 2021-2022, University of Colorado Boulder

/**
 * Class for a 'Compare Number Line' Node, which creates a number line with two dynamic points that represent the value
 * of the given left and right current numbers.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, Color, IPaint, Node, Path, Text } from '../../../../scenery/js/imports.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import numberPlay from '../../numberPlay.js';
import Range from '../../../../dot/js/Range.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';

// types
type GetNumberLineNodeOptions = {
  includeLabels?: boolean;
  minorLineWidth?: number;
  majorLineWidth?: number;
  minorTickMarkHalfLineLength?: number;
  majorTickMarkHalfLineLength?: number;
};

// constants
const INTEGERS_PER_MAJOR_TICK_MARK = 5; // the number of integers between two major tick marks

class CompareNumberLineNode extends Node {

  constructor( height: number, leftCurrentNumberProperty: IReadOnlyProperty<number>,
               rightCurrentNumberProperty: IReadOnlyProperty<number>, sumRange: Range ) {
    super();

    const pixelsPerTickMark = height / sumRange!.max;

    // create and add the number line
    const numberLineNode = CompareNumberLineNode.getNumberLineNode( pixelsPerTickMark, sumRange );
    this.addChild( numberLineNode );

    // create and add an indicator for the leftCurrentNumberProperty
    const leftCurrentNumberIndicatorNode = CompareNumberLineNode.getCurrentNumberIndicatorNode(
      LeftRightDirection.LEFT,
      NumberPlayColors.purpleHighlightColorProperty
    );
    numberLineNode.addChild( leftCurrentNumberIndicatorNode );

    // create and add an indicator for the rightCurrentNumberProperty
    const rightCurrentNumberIndicatorNode = CompareNumberLineNode.getCurrentNumberIndicatorNode(
      LeftRightDirection.RIGHT,
      NumberPlayColors.orangeHighlightColorProperty
    );
    numberLineNode.addChild( rightCurrentNumberIndicatorNode );

    // update the leftCurrentNumberIndicatorNodes when leftCurrentNumberProperty changes
    leftCurrentNumberProperty.link( leftCurrentNumber => {
      leftCurrentNumberIndicatorNode.centerY = pixelsPerTickMark * -leftCurrentNumber;
    } );

    // update the rightCurrentNumberIndicatorNodes when rightCurrentNumberProperty changes
    rightCurrentNumberProperty.link( rightCurrentNumber => {
      rightCurrentNumberIndicatorNode.centerY = pixelsPerTickMark * -rightCurrentNumber;
    } );
  }

  /**
   * Draws a number line node in a vertical orientation with minor + major tick marks and number labels on the major
   * tick marks.
   *
   * @param pixelsPerTickMark
   * @param range - inclusive
   * @param [providedOptions]
   */
  public static getNumberLineNode( pixelsPerTickMark: number, range: Range,
                                   providedOptions?: GetNumberLineNodeOptions ): Node {

    const options = optionize<GetNumberLineNodeOptions>()( {
      includeLabels: true,
      minorLineWidth: 1,
      majorLineWidth: 2,
      minorTickMarkHalfLineLength: 9,
      majorTickMarkHalfLineLength: 16
    }, providedOptions );
    const numberLineDistance = range.getLength();

    // create the base vertical line
    const numberLineShape = new Shape().moveTo( 0, 0 ).lineTo( 0, -numberLineDistance * pixelsPerTickMark );
    const numberLineNode = new Path( numberLineShape, {
      stroke: Color.BLACK,
      lineWidth: options.minorLineWidth
    } );

    // create tick marks at each integer on the number line, plus labels for the major tick marks
    for ( let i = 0; i <= numberLineDistance; i++ ) {
      const isMajorTickMark = i % INTEGERS_PER_MAJOR_TICK_MARK === 0;
      const tickMarkHalfLength = isMajorTickMark ? options.majorTickMarkHalfLineLength : options.minorTickMarkHalfLineLength;

      // create and add a major or minor tick mark
      const tickMarkShape = new Shape().moveTo( -tickMarkHalfLength, -i * pixelsPerTickMark )
        .lineTo( tickMarkHalfLength, -i * pixelsPerTickMark );
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
  private static getCurrentNumberIndicatorNode( triangleSide: LeftRightDirection, triangleColor: IPaint ): Circle {

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