// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for a 'Ten Frame' Node, which creates ten frames (5x2 grid of squares) and fills them with dots by listening
 * to the provided Property. It supports any NumberProperty with a maximum range that is a multiple of ten.
 *
 * The static methods can be used to draw simple ten frame nodes and provide positions for the centers of their squares.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Circle, HBox, Node, PaintableOptions, Path } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';

// types
type GetSpotCentersOptions = {
  numberOfTenFrames?: number;
  sideLength?: number;
  lineWidth?: number;
};
type GetTenFramePathOptions = {
  sideLength?: number;
} & Pick<PaintableOptions, 'fill'> & Pick<PaintableOptions, 'lineWidth'>;

// constants - all are used for both drawing the ten frame shape and positioning the dots within the ten frame shape
const NUMBER_OF_X_SQUARES = 5; // a ten frame is this many squares wide
const NUMBER_OF_Y_SQUARES = 2; // a ten frame is this many squares tall
const SIDE_LENGTH = 20; // the side length of one square in a ten frame
const DISTANCE_BETWEEN_TEN_FRAMES = SIDE_LENGTH / 2; // horizontal spacing between ten frames, if there's more than one
const LINE_WIDTH = 0.8; // the line width of the lines in a ten frame. used in this class, not necessarily in getTenFramePath

class TenFrameNode extends Node {
  private readonly dotsLayer: Node;
  private readonly dotSpots: Vector2[];

  public constructor( currentNumberProperty: IReadOnlyProperty<number>, sumRange: Range ) {
    super();

    assert && assert( sumRange!.max % NumberPlayConstants.TEN === 0,
      `Provided sumRange.max should be a multiple of ten, but was: ${sumRange!.max}`
    );

    const numberOfTenFrames = sumRange!.max / NumberPlayConstants.TEN;
    const tenFramePaths: Node[] = [];

    // create the calculated number of ten frames needed
    _.times( numberOfTenFrames, () => {
      tenFramePaths.push( TenFrameNode.getTenFramePath() );
    } );

    // add all ten frames, aligned in a horizontal line
    const alignedTenFrames = new HBox( {
      children: tenFramePaths,
      spacing: DISTANCE_BETWEEN_TEN_FRAMES
    } );
    this.addChild( alignedTenFrames );

    // create and add a later for the dots
    this.dotsLayer = new Node();
    this.addChild( this.dotsLayer );

    // the center of every dot spot available
    this.dotSpots = TenFrameNode.getSpotCenters( {
      numberOfTenFrames: numberOfTenFrames
    } );

    // update the number of dots shown whenever the current number changes
    currentNumberProperty.link( currentNumber => {
      this.updateDots( currentNumber );
    } );
  }

  /**
   * Draws the provided number of dots on the dots layer.
   */
  private updateDots( numberOfDots: number ): void {
    this.dotsLayer.removeAllChildren();

    for ( let i = 0; i < numberOfDots; i++ ) {
      const dotNode = new Circle( SIDE_LENGTH / 4, { fill: 'black' } );
      dotNode.center = this.dotSpots[ i ];
      this.dotsLayer.addChild( dotNode );
    }
  }

  /**
   * Calculates the center position of all the squares in a ten frame shape(s).
   */
  public static getSpotCenters( provideOptions?: GetSpotCentersOptions ): Vector2[] {

    const options = optionize<GetSpotCentersOptions>()( {
      numberOfTenFrames: 1,
      sideLength: SIDE_LENGTH,
      lineWidth: LINE_WIDTH
    }, provideOptions );

    const spots = [];
    const squareCenterOffset = options.sideLength / 2 + options.lineWidth / 2; // offset from the edge to the first square's center

    // the width of i ten frames plus the space between ten frames
    const nextTenFrameXOffset = NUMBER_OF_X_SQUARES * options.sideLength + DISTANCE_BETWEEN_TEN_FRAMES + options.lineWidth / 2;

    for ( let i = 0; i < options.numberOfTenFrames; i++ ) {
      const xOffset = i * nextTenFrameXOffset; // shift over for each additional ten frame

      // iterate through all squares in a ten frame and record the center of each square
      for ( let j = 0; j < NUMBER_OF_Y_SQUARES; j++ ) {
        const y = j * options.sideLength + squareCenterOffset;
        for ( let k = 0; k < NUMBER_OF_X_SQUARES; k++ ) {
          const x = k * options.sideLength + squareCenterOffset;
          spots.push( new Vector2( x + xOffset, y ) );
        }
      }
    }
    return spots;
  }

  /**
   * Draws a ten frame shape, which is a 5 by 2 grid of squares.
   */
  public static getTenFramePath( providedOptions?: GetTenFramePathOptions ): Path {

    const options = optionize<GetTenFramePathOptions>()( {
      fill: 'white',
      lineWidth: LINE_WIDTH,
      sideLength: SIDE_LENGTH
    }, providedOptions );

    const tenFrameShape = new Shape()
      .moveTo( 0, 0 )

      // draw the bounding rectangle, counterclockwise
      .lineToRelative( 0, NUMBER_OF_Y_SQUARES * options.sideLength )
      .lineToRelative( NUMBER_OF_X_SQUARES * options.sideLength, 0 )
      .lineToRelative( 0, -NUMBER_OF_Y_SQUARES * options.sideLength )
      .lineToRelative( -NUMBER_OF_X_SQUARES * options.sideLength, 0 )
      .lineTo( 0, NUMBER_OF_Y_SQUARES / 2 * options.sideLength )

      // draw the middle horizontal line, left to right
      .lineToRelative( NUMBER_OF_X_SQUARES * options.sideLength, 0 )

      // draw the inner vertical lines, right to left
      .moveTo( NUMBER_OF_X_SQUARES * options.sideLength * 0.8, 0 )
      .lineToRelative( 0, NUMBER_OF_Y_SQUARES * options.sideLength )
      .moveTo( NUMBER_OF_X_SQUARES * options.sideLength * 0.6, 0 )
      .lineToRelative( 0, NUMBER_OF_Y_SQUARES * options.sideLength )
      .moveTo( NUMBER_OF_X_SQUARES * options.sideLength * 0.4, 0 )
      .lineToRelative( 0, NUMBER_OF_Y_SQUARES * options.sideLength )
      .moveTo( NUMBER_OF_X_SQUARES * options.sideLength * 0.2, 0 )
      .lineToRelative( 0, NUMBER_OF_Y_SQUARES * options.sideLength )
      .close();

    return new Path( tenFrameShape, {
      fill: options.fill,
      stroke: 'black',
      lineWidth: options.lineWidth
    } );
  }
}

numberPlay.register( 'TenFrameNode', TenFrameNode );
export default TenFrameNode;
