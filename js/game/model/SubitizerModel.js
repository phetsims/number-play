// Copyright 2021, University of Colorado Boulder

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import numberPlay from '../../numberPlay.js';

// constants

// angles, all in radians
const DEGREES_45 = Math.PI * 0.25;
const DEGREES_90 = Math.PI * 0.5;
const DEGREES_135 = Math.PI * 0.75;
const DEGREES_180 = Math.PI;
const DEGREES_270 = Math.PI * ( 3 / 2 );

// convenience function for easier reading
const v2 = ( x, y ) => new Vector2( x, y );

const SHAPES = {
  1: [ {
    coordinates: [ v2( 0, 0 ) ], // centered dot
    rotations: []
  } ],
  2: [ {
    coordinates: [ v2( -0.5, 0 ), v2( 0.5, 0 ) ], // row
    rotations: [ DEGREES_45, DEGREES_90, DEGREES_135 ]
  } ],
  3: [ {
    coordinates: [ v2( -1, 0 ), v2( 0, 0 ), v2( 1, 0 ) ], // row
    rotations: [ DEGREES_90 ]
  }, {
    coordinates: [ v2( -1, -1 ), v2( 0, 0 ), v2( 1, 1 ) ], // diagonal row
    rotations: [ DEGREES_90 ]
  }, {
    coordinates: [ v2( -1, 1 ), v2( 0, -1 ), v2( 1, 1 ) ], // triangle pointing up
    rotations: [ DEGREES_90, DEGREES_180, DEGREES_270 ]
  } ],
  4: [ {
    coordinates: [ v2( -1.5, 0 ), v2( -0.5, 0 ), v2( 0.5, 0 ), v2( 1.5, 0 ) ], // row
    rotations: []
  }, {
    coordinates: [ v2( -1, -1 ), v2( 1, -1 ), v2( -1, 1 ), v2( 1, 1 ) ], // square
    rotations: [ DEGREES_45 ]
  } ],
  5: [ {
    coordinates: [ v2( -2, 0 ), v2( -1, 0 ), v2( 0, 0 ), v2( 1, 0 ), v2( 2, 0 ) ], // row
    rotations: []
  }, {
    coordinates: [ v2( -1, -1 ), v2( 1, -1 ), v2( 0, 0 ), v2( -1, 1 ), v2( 1, 1 ) ], // 5 in a "die" formation
    rotations: []
  }, {
    coordinates: [ v2( 0, -1 ), v2( 0, 0 ), v2( 0, 1 ), v2( 1, -0.5 ), v2( 1, 0.5 ) ], // 3 left and 2 centered on right
    rotations: [ DEGREES_90, DEGREES_180, DEGREES_270 ]
  }, {
    coordinates: [ v2( 0, -1 ), v2( 0, 0 ), v2( 0, 1 ), v2( 1, -1 ), v2( 1, 0 ) ], // 3 left and 2 top right
    rotations: [ DEGREES_90, DEGREES_180, DEGREES_270 ]
  }, {
    coordinates: [ v2( 0, -1 ), v2( 0, 0 ), v2( 0, 1 ), v2( 1, 0 ), v2( 1, 1 ) ], // 3 left and 2 bottom right
    rotations: [ DEGREES_90, DEGREES_180, DEGREES_270 ]
  } ]
};

/**
 * SubitizerModel generates the arranged and random patterns of the objects.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
class SubitizerModel {

  /**
   * @param {NumberProperty} subitizeNumberProperty
   * @param {Boolean} randomAndArranged TODO: figure out the arranged patterns for level 2
   */
  constructor( subitizeNumberProperty, randomAndArranged ) {

    // @public (read-only) {NumberProperty} - the rotation of the current shape
    this.rotationProperty = new NumberProperty( 0 );

    // @public (read-only) {DerivedProperty.<Vector2[]>} - the coordinates of the current shape
    this.coordinatesProperty = new DerivedProperty( [ subitizeNumberProperty ], subitizeNumber => {
      this.rotationProperty.reset();
      let coordinates = [];

      // 50/50 chance whether the pattern uses an arranged configuration or a random one for level 1, level 2 always
      // uses a random configuration
      const arranged = randomAndArranged ? dotRandom.nextBoolean() : false;
      if ( arranged ) {

        // pick out a random shape for the corresponding subitizeNumber
        const randomPatternIndex = dotRandom.nextInt( SHAPES[ subitizeNumber ].length );
        const shape = SHAPES[ subitizeNumber ][ randomPatternIndex ];
        coordinates = shape.coordinates;

        // if the shape has rotations available, randomly pick one to assign
        if ( shape.rotations.length ) {
          const randomRotationIndex = dotRandom.nextInt( shape.rotations.length );
          this.rotationProperty.value = shape.rotations[ randomRotationIndex ];
        }
      }
      else {

        // generate random coordinates for the subitizeNumber positions
        while ( coordinates.length < subitizeNumber ) {
          const randomX = dotRandom.nextIntBetween( -2, 2 );
          const randomY = dotRandom.nextIntBetween( -1, 1 );

          // add a new coordinate if it doesn't exist yet
          if ( !_.find( coordinates, object => object.x === randomX && object.y === randomY ) ) {
            coordinates.push( new Vector2( randomX, randomY ) );
          }
        }
      }
      return coordinates;
    } );

  }
}

numberPlay.register( 'SubitizerModel', SubitizerModel );
export default SubitizerModel;