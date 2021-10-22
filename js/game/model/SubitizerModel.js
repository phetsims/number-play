// Copyright 2021, University of Colorado Boulder

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import numberPlay from '../../numberPlay.js';

const SHAPES = {
  1: [
    [ { x: 0, y: 0 } ] // centered dot
  ],
  2: [
    [ { x: -0.5, y: 0 }, { x: 0.5, y: 0 } ] // row
  ],
  3: [
    [ { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 } ], // row
    [ { x: -1, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 1 } ], // diagonal row
    [ { x: -1, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 1 } ] // triangle pointing up
  ],
  4: [
    [ { x: -1.5, y: 0 }, { x: -0.5, y: 0 }, { x: 0.5, y: 0 }, { x: 1.5, y: 0 } ], // row
    [ { x: -1, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: 1, y: 1 } ] // square
  ],
  5: [
    [ { x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 } ], // row
    [ { x: -1, y: -1 }, { x: 1, y: -1 }, { x: 0, y: 0 }, { x: -1, y: 1 }, { x: 1, y: 1 } ], // 5 in a "die" formation
    [ { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: -0.5 }, { x: 1, y: 0.5 } ], // 3 left and 2 centered on right
    [ { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: -1 }, { x: 1, y: 0 } ], // 3 left and 2 top right
    [ { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 } ] // 3 left and 2 bottom right
  ]
};
const ROTATION = {
  2: [
    [ 3.14 / 4, 3.14 / 2, ( 3 / 4 ) * 3.14 ] // rotated 45, 90, 135
  ],
  3: [
    [ 3.14 / 2 ], // rotated 90
    [ 3.14 / 2 ], // rotated 90
    [ 3.14 / 2, 3.14, ( 3 / 2 ) * 3.14 ] // rotated 90, 180, 270
  ],
  4: [
    [ 3.14 / 4 ] // rotated 45
  ],
  5: [
    [ 3.14 / 2, 3.14, ( 3 / 2 ) * 3.14 ] // rotated 90, 180, 270
  ]
};

/**
 * SubitizerModel generates the arranged and random patterns of the objects.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
class SubitizerModel {

  /**
   * @param subitizeNumberProperty {NumberProperty}
   */
  constructor( subitizeNumberProperty ) {

    // @public (read-only) {NumberProperty} - the rotation of the current shape
    this.rotationProperty = new NumberProperty( 0 );

    // @public (read-only) {DerivedProperty.<Vector2[]>} - the coordinates of the current shape
    this.coordinatesProperty = new DerivedProperty( [ subitizeNumberProperty ], subitizeNumber => {
      this.rotationProperty.reset();
      let coordinates = [];

      // whether the pattern uses an arranged configuration or a random one
      const arranged = dotRandom.nextBoolean();
      if ( arranged ) {

        // pick out a random shape for the corresponding subitizeNumber
        let randomPatternIndex = dotRandom.nextInt( SHAPES[ subitizeNumber ].length );
        coordinates = SHAPES[ subitizeNumber ][ randomPatternIndex ];

        // if this shape is allowed to rotate, pick out a random corresponding rotation
        if ( subitizeNumber !== 1 && !( subitizeNumber === 4 && randomPatternIndex === 0 ) &&
             !( subitizeNumber === 5 && randomPatternIndex < 2 ) ) {

          // subitizeNumber 4 and 5 only have one rotation option
          if ( subitizeNumber === 5 || subitizeNumber === 4 ) {
            randomPatternIndex = 0;
          }
          const randomRotationIndex = dotRandom.nextInt( ROTATION[ subitizeNumber ][ randomPatternIndex ].length );
          this.rotationProperty.value = ROTATION[ subitizeNumber ][ randomPatternIndex ][ randomRotationIndex ];
        }
      }
      else {

        // generate random coordinates for the subitizeNumber positions
        while ( coordinates.length < subitizeNumber ) {
          let randomX = dotRandom.nextIntBetween( -2, 2 );
          let randomY = dotRandom.nextIntBetween( -1, 1 );

          // add a new coordinate if it doesn't exist yet
          if ( _.find( coordinates, object => { return object.x === randomX && object.y === randomY } ) === undefined ) {
            coordinates.push( { x: randomX, y: randomY } );
          }
        }
      }
      return coordinates;
    } );

  }
}

numberPlay.register( 'SubitizerModel', SubitizerModel );
export default SubitizerModel;