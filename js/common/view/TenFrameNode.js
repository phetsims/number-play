// Copyright 2019, University of Colorado Boulder

/**
 * Class for a 'Ten Frame' Node, which creates ten frames (5x2 grid of squares) and fills them with dots by listening
 * to the provided Property. It supports any NumberProperty with a maximum range that is a multiple of ten.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants - all are used for both drawing the ten frame shape and positioning the dots within the ten frame shape
  const NUMBER_OF_X_SQUARES = 5; // a ten frame is this many squares wide
  const NUMBER_OF_Y_SQUARES = 2; // a ten frame is this many squares tall
  const SIDE_LENGTH = 20; // the side length of one square in a ten frame
  const DISTANCE_BETWEEN_TEN_FRAMES = SIDE_LENGTH / 2; // horizontal spacing between ten frames, if there's more than one
  const LINE_WIDTH = 0.8; // the line width of the lines in a ten frame

  class TenFrameNode extends Node {

    /**
     * @param {NumberProperty} currentNumberProperty
     */
    constructor( currentNumberProperty ) {
      super();

      assert && assert( currentNumberProperty.range, `Range is required: ${currentNumberProperty.range}` );
      assert && assert( currentNumberProperty.range.max % NumberPlayConstants.TEN === 0,
        `Provided range.max should be a multiple of ten, but was: ${currentNumberProperty.range.max}`
      );

      const numberOfTenFrames = currentNumberProperty.range.max / NumberPlayConstants.TEN;
      const tenFramePaths = [];

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

      // @private {Vector2[]} - the center of every dot spot available
      this.dotSpots = this.getDotSpotCenters( numberOfTenFrames );

      // update the number of dots shown whenever the current number changes
      currentNumberProperty.link( currentNumber => {
        this.updateDots( currentNumber );
      } );
    }

    /**
     * Draws the provided number of dots on the dots layer.
     *
     * @param {number} numberOfDots
     * @private
     */
    updateDots( numberOfDots ) {
      this.dotsLayer.removeAllChildren();

      for ( let i = 0; i < numberOfDots; i++ ) {
        const dotNode = new Circle( SIDE_LENGTH / 4, { fill: 'black' } );
        dotNode.center = this.dotSpots[ i ];
        this.dotsLayer.addChild( dotNode );
      }
    }

    /**
     * Calculates the center of all dot locations for the provided number of ten frames.
     *
     * @param {number} numberOfTenFrames
     * @returns {Vector2[]}
     * @private
     */
    getDotSpotCenters( numberOfTenFrames ) {
      const spots = [];
      const squareCenterOffset = SIDE_LENGTH / 2 + LINE_WIDTH / 2; // offset from the edge to the first square's center

      // the width of i ten frames plus the space between ten frames
      const nextTenFrameXOffset = NUMBER_OF_X_SQUARES * SIDE_LENGTH + DISTANCE_BETWEEN_TEN_FRAMES + LINE_WIDTH / 2;

      for ( let i = 0; i < numberOfTenFrames; i++ ) {
        const xOffset = i * nextTenFrameXOffset; // shift over for each additional ten frame

        // iterate through all squares in a ten frame and record the center of each square
        for ( let j = 0; j < NUMBER_OF_Y_SQUARES; j++ ) {
          const y = j * SIDE_LENGTH + squareCenterOffset;
          for ( let k = 0; k < NUMBER_OF_X_SQUARES; k++ ) {
            const x = k * SIDE_LENGTH + squareCenterOffset;
            spots.push( new Vector2( x + xOffset, y ) );
          }
        }
      }
      return spots;
    }

    /**
     * Draws a ten frame shape, which is a 5 by 2 grid of squares.
     *
     * @returns {Path}
     * @public
     */
    static getTenFramePath() {
      const tenFrameShape = new Shape()
        .moveTo( 0, 0 )

        // draw the bounding rectangle, counterclockwise
        .lineToRelative( 0, NUMBER_OF_Y_SQUARES * SIDE_LENGTH )
        .lineToRelative( NUMBER_OF_X_SQUARES * SIDE_LENGTH, 0 )
        .lineToRelative( 0, -NUMBER_OF_Y_SQUARES * SIDE_LENGTH )
        .lineToRelative( -NUMBER_OF_X_SQUARES * SIDE_LENGTH, 0 )
        .lineTo( 0, NUMBER_OF_Y_SQUARES / 2 * SIDE_LENGTH )

        // draw the middle horizontal line, left to right
        .lineToRelative( NUMBER_OF_X_SQUARES * SIDE_LENGTH, 0 )

        // draw the inner vertical lines, right to left
        .moveTo( NUMBER_OF_X_SQUARES * SIDE_LENGTH * 0.8, 0 )
        .lineToRelative( 0, NUMBER_OF_Y_SQUARES * SIDE_LENGTH )
        .moveTo( NUMBER_OF_X_SQUARES * SIDE_LENGTH * 0.6, 0 )
        .lineToRelative( 0, NUMBER_OF_Y_SQUARES * SIDE_LENGTH )
        .moveTo( NUMBER_OF_X_SQUARES * SIDE_LENGTH * 0.4, 0 )
        .lineToRelative( 0, NUMBER_OF_Y_SQUARES * SIDE_LENGTH )
        .moveTo( NUMBER_OF_X_SQUARES * SIDE_LENGTH * 0.2, 0 )
        .lineToRelative( 0, NUMBER_OF_Y_SQUARES * SIDE_LENGTH )
        .close();

      return new Path( tenFrameShape, {
        fill: 'white',
        stroke: 'black',
        lineWidth: LINE_WIDTH
      } );
    }
  }

  return numberPlay.register( 'TenFrameNode', TenFrameNode );
} );