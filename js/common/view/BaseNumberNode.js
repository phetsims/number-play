// Copyright 2019-2020, University of Colorado Boulder

/**
 * Creates image views for base numbers.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Klusendorf (PhET Interactive Simulations), copied from make-a-ten and modified for number-play
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import imageDigit0 from '../../../../make-a-ten/mipmaps/digit-0_png.js';
import imageDigit1 from '../../../../make-a-ten/mipmaps/digit-1_png.js';
import imageDigit2 from '../../../../make-a-ten/mipmaps/digit-2_png.js';
import imageDigit3 from '../../../../make-a-ten/mipmaps/digit-3_png.js';
import imageDigit4 from '../../../../make-a-ten/mipmaps/digit-4_png.js';
import imageDigit5 from '../../../../make-a-ten/mipmaps/digit-5_png.js';
import imageDigit6 from '../../../../make-a-ten/mipmaps/digit-6_png.js';
import imageDigit7 from '../../../../make-a-ten/mipmaps/digit-7_png.js';
import imageDigit8 from '../../../../make-a-ten/mipmaps/digit-8_png.js';
import imageDigit9 from '../../../../make-a-ten/mipmaps/digit-9_png.js';
import imagePaperBackground1000 from '../../../../make-a-ten/mipmaps/paper-background-1000_png.js';
import imagePaperBackground100 from '../../../../make-a-ten/mipmaps/paper-background-100_png.js';
import imagePaperBackground10 from '../../../../make-a-ten/mipmaps/paper-background-10_png.js';
import imagePaperBackground1 from '../../../../make-a-ten/mipmaps/paper-background-1_png.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import appleImage from '../../../images/apple_png.js';
import ballImage from '../../../images/ball_png.js';
import cornerPeelImage from '../../../images/corner-peel_png.js';
import dogImage from '../../../images/dog_png.js';
import turtleImage from '../../../images/turtle_png.js';
import peeledImagePaperBackground10 from '../../../mipmaps/peeled_paper_background_10_png.js';
import peeledImagePaperBackground1 from '../../../mipmaps/peeled_paper_background_1_png.js';
import numberPlay from '../../numberPlay.js';
import PlayObjectType from '../model/PlayObjectType.js';
import NumberPlayConstants from '../NumberPlayConstants.js';

// convenience map that links play object types to their corresponding images
const mapPlayObjectTypeToImage = {};
mapPlayObjectTypeToImage[ PlayObjectType.DOG ] = dogImage;
mapPlayObjectTypeToImage[ PlayObjectType.APPLE ] = appleImage;
mapPlayObjectTypeToImage[ PlayObjectType.TURTLE ] = turtleImage;
mapPlayObjectTypeToImage[ PlayObjectType.BALL ] = ballImage;

// place => mipmap info
const PEELED_BACKGROUND_IMAGE_MAP = {
  0: peeledImagePaperBackground1,
  1: peeledImagePaperBackground10
};

// place => mipmap info
const BACKGROUND_IMAGE_MAP = {
  0: imagePaperBackground1,
  1: imagePaperBackground10,
  2: imagePaperBackground100,
  3: imagePaperBackground1000
};

// digit => mipmap info
const DIGIT_IMAGE_MAP = {
  1: imageDigit1,
  2: imageDigit2,
  3: imageDigit3,
  4: imageDigit4,
  5: imageDigit5,
  6: imageDigit6,
  7: imageDigit7,
  8: imageDigit8,
  9: imageDigit9
};

// place => x/y offsets for the first digit in each place
const PLACE_X_OFFSET = { 0: 48, 1: 108, 2: 70, 3: 94 };
const PLACE_Y_OFFSET = { 0: 65, 1: 85, 2: 163, 3: 197 };

// digit => horizontal offset for that digit (applied to all places, includes digit-specific information)
const DIGIT_X_OFFSET = { 1: 93, 2: -7, 3: -7, 4: -9, 5: -18, 6: -5, 7: -24, 8: -2, 9: -10 };

// digit => horizontal offset, customized for each single digit base number
const FIRST_PLACE_DIGIT_X_OFFSET = { 1: -61, 2: 0, 3: 0, 4: 0, 5: 5, 6: 0, 7: 15, 8: 10, 9: 15 };

// place => horizontal positions of the zeros in the base number
const ZERO_OFFSET = {
  0: [],
  1: [ 335 ],
  2: [ 560, 314 ],
  3: [ 825, 580, 335 ]
};

// Scale was increased from 72dpi (pixels) to 300dpi, so that we can have crisper graphics.
const SCALE = 72 / 300;

class BaseNumberNode extends Node {
  /**
   * @param {BaseNumber} baseNumber
   * @param {number} opacity
   * @param {boolean} isPartOfStack - does this baseNumber have other layers to it?
   * @param {EnumerationProperty.<PlayObjectType>} playObjectTypeProperty
   */
  constructor( baseNumber, opacity, isPartOfStack, playObjectTypeProperty ) {
    super( { scale: SCALE } );

    // Position of the initial digit
    let x = PLACE_X_OFFSET[ baseNumber.place ] + DIGIT_X_OFFSET[ baseNumber.digit ];
    const y = PLACE_Y_OFFSET[ baseNumber.place ];

    // We need to slightly offset some
    if ( baseNumber.place === 0 ) {
      x += FIRST_PLACE_DIGIT_X_OFFSET[ baseNumber.digit ];
    }

    // Translate everything by our offset
    this.translation = baseNumber.offset;

    let backgroundNode;

    // the view should be objects and a custom background
    if ( playObjectTypeProperty ) {
      const numberValue = baseNumber.numberValue;

      const objectWidth = NumberPlayConstants.PLAY_OBJECT_SIZE.width;
      const objectHeight = NumberPlayConstants.PLAY_OBJECT_SIZE.width;
      const stackOffset = 10;
      const sideMargin = 10;

      // add a background if there's a least 2 object together
      if ( numberValue > 1 ) {
        const backgroundWidth = objectWidth + 2 * sideMargin + ( numberValue - 1 ) * stackOffset;
        const backgroundHeight = objectHeight + 3 * sideMargin + numberValue * stackOffset;

        backgroundNode = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, {
          fill: '#e8f6ff',
          cornerRadius: 10
        } );

        // create and add the corner peel
        const cornerPeelImageNode = new Image( cornerPeelImage, {
          maxHeight: 18,
          top: backgroundNode.top,
          right: backgroundNode.right
        } );
        backgroundNode.addChild( cornerPeelImageNode );
        backgroundNode.scale( 1 / SCALE );
        this.addChild( backgroundNode );
      }

      // add and position the objext images
      for ( let i = 0; i < numberValue; i++ ) {
        const offset = ( sideMargin + i * stackOffset ) / SCALE;
        const objectImage = new Image( mapPlayObjectTypeToImage[ playObjectTypeProperty.value ], {
          maxWidth: objectWidth,
          maxHeight: objectHeight,
          x: offset,
          y: offset
        } );
        objectImage.scale( 1 / SCALE );
        this.addChild( objectImage );
        playObjectTypeProperty.link( playObjectType => {
          objectImage.image = mapPlayObjectTypeToImage[ playObjectType ];
        } );
      }
    }
    // the view should be ones with a paper background
    else {
      // if the base number is a 1 that's not on top of a bigger base number, or if the base number is underneath smaller
      // base numbers, then use a flat background instead of a peeled one.
      if ( baseNumber.digit === 1 &&
           ( ( baseNumber.place === 0 && !isPartOfStack ) || ( baseNumber.place >= 1 && isPartOfStack ) ) ) {

        // The paper behind the numbers
        backgroundNode = new Image( BACKGROUND_IMAGE_MAP[ baseNumber.place ], {
          imageOpacity: opacity
        } );
      }
      else {
        backgroundNode = new Image( PEELED_BACKGROUND_IMAGE_MAP[ baseNumber.place ], {
          imageOpacity: opacity
        } );
      }

      this.addChild( backgroundNode );
      this.addChild( new Image( DIGIT_IMAGE_MAP[ baseNumber.digit ], {
        x: x,
        y: y
      } ) );

      // Add the zeros
      const digitZeroOffsets = ZERO_OFFSET[ baseNumber.place ];
      for ( let i = 0; i < digitZeroOffsets.length; i++ ) {
        this.addChild( new Image( imageDigit0, {
          x: digitZeroOffsets[ i ],
          y: y
        } ) );
      }
    }

    // add the grippy lines if this number is on the top layer
    if ( ( !( baseNumber.place >= 1 && isPartOfStack ) && !playObjectTypeProperty ) || ( playObjectTypeProperty && baseNumber.numberValue > 1 ) ) {

      // empirically determined to put the grippy in the same place in relation to the paper number's digit
      const yMargin = baseNumber.place >= 1 ? 90 : 56;
      const lineLength = 100;    // empirically determined
      const lineSeparation = 15; // empirically determined
      const grippyLines = new Path( new Shape()
        .moveTo( 0, 0 ).lineTo( lineLength, 0 ).moveTo( 0, lineSeparation ).lineTo( lineLength, lineSeparation ).close(), {
        stroke: 'rgb( 204, 204, 204 )',
        lineWidth: 3,
        centerX: backgroundNode.centerX,
        bottom: backgroundNode.bottom - yMargin
      } );
      this.addChild( grippyLines );
    }
  }


}

/**
 * @public {Object} - Maps place (0-3) to a {Dimension2} with the width/height
 */
BaseNumberNode.PAPER_NUMBER_DIMENSIONS = _.mapValues( BACKGROUND_IMAGE_MAP, mipmap => new Dimension2( mipmap[ 0 ].width * SCALE, mipmap[ 0 ].height * SCALE ) );

/**
 * @public {Array.<Vector2>} - Maps place (0-3) to a {Vector2} that is the offset of the upper-left corner of the
 *                             BaseNumberNode relative to a 1-digit BaseNumberNode.
 */
BaseNumberNode.IMAGE_OFFSETS = [
  new Vector2( 0, 0 ),
  new Vector2( -70, -( PLACE_Y_OFFSET[ 1 ] - PLACE_Y_OFFSET[ 0 ] ) * SCALE ),
  new Vector2( -70 - ( ZERO_OFFSET[ 2 ][ 0 ] - ZERO_OFFSET[ 1 ][ 0 ] ) * SCALE, -( PLACE_Y_OFFSET[ 2 ] - PLACE_Y_OFFSET[ 0 ] ) * SCALE ),
  new Vector2( -70 - ( ZERO_OFFSET[ 3 ][ 0 ] - ZERO_OFFSET[ 1 ][ 0 ] ) * SCALE, -( PLACE_Y_OFFSET[ 3 ] - PLACE_Y_OFFSET[ 0 ] ) * SCALE )
];

numberPlay.register( 'BaseNumberNode', BaseNumberNode );

export default BaseNumberNode;
