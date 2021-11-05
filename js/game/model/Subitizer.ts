// Copyright 2021, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import NumberPlayQueryParameters from '../../common/NumberPlayQueryParameters.js';
import numberPlay from '../../numberPlay.js';

//TODO-TS: naming for a type used as a constant like this?
type Shapes = {
  [ key: number ]: {
    coordinates: Vector2[],
    rotations: number[]
  }[],
};

// constants

// angles, all in radians
const DEGREES_45 = Math.PI * 0.25;
const DEGREES_90 = Math.PI * 0.5;
const DEGREES_135 = Math.PI * 0.75;
const DEGREES_180 = Math.PI;
const DEGREES_270 = Math.PI * ( 3 / 2 );

// convenience function for easier reading
const v2 = ( x: number, y: number ) => new Vector2( x, y );

const SHAPES: Shapes = {
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
const OBJECT_WIDTH = 0.4444; // width of the object in model coordinates

/**
 * Subitizer generates the arranged and random patterns of the objects.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
class Subitizer {
  subitizeNumberProperty: NumberProperty;
  visibleProperty: BooleanProperty;
  coordinatesProperty: Property<Vector2[]>;
  randomAndArranged: boolean;
  secondsSinceVisible: number;
  objectWidth: number;
  isPlayingProperty: BooleanProperty;
  subitizerTimeVisibleProperty: DerivedProperty<number>;

  /**
   * @param {NumberProperty} subitizeNumberProperty
   * @param {NumberProperty} numberOfAnswerButtonPressesProperty
   * @param {Boolean} randomAndArranged
   */
  constructor( subitizeNumberProperty: NumberProperty,
               numberOfAnswerButtonPressesProperty: NumberProperty,
               randomAndArranged: boolean
  ) {

    // @public {NumberProperty}
    this.subitizeNumberProperty = subitizeNumberProperty;

    // @public {NumberProperty} - whether the current shape is visible
    this.visibleProperty = new BooleanProperty( false );

    // @public (read-only) {Property.<Vector2[]>} - the coordinates of the current shape
    this.coordinatesProperty = new Property( [ Vector2.ZERO ], {
      valueType: Array,
      arrayElementType: Vector2
    } );

    // @private {boolean} - whether we can choose to use a random and arranged pattern
    this.randomAndArranged = randomAndArranged;

    // @private {number} - the number of seconds the sim clock has run since the subitizer was made visible
    this.secondsSinceVisible = 0;

    // initialize first set of coordinates
    this.setNewCoordinates();

    // @public {number}
    this.objectWidth = OBJECT_WIDTH;

    // @public {BooleanProperty} - indicates the play/pause state of the subitizer model. Manipulated only in the view.
    this.isPlayingProperty = new BooleanProperty( false );

    // @private {DerivedProperty.<number>} - the time the subitizerNode is visible
    this.subitizerTimeVisibleProperty = new DerivedProperty( [ numberOfAnswerButtonPressesProperty ], ( numberOfAnswerButtonPresses: number ) => {
      if ( numberOfAnswerButtonPresses > NumberPlayConstants.SUBITIZER_GUESSES_AT_NORMAL_TIME ) {
        return this.subitizerTimeVisibleProperty.value + NumberPlayConstants.SUBITIZER_TIME_INCREASE_AMOUNT;
      }
      return NumberPlayQueryParameters.subitizerTimeVisible;
    } );
  }

  /**
   * @param {number} dt
   * @public
   */
  step( dt: number ) {

    // keep adding to secondsSinceVisible if the subitizer is visible and not paused
    if ( this.visibleProperty.value && this.isPlayingProperty.value ) {
      this.secondsSinceVisible += dt;

      // hide the subitizer and reset the time counter if the subitizer has been visible for as long as desired
      if ( this.secondsSinceVisible > this.subitizerTimeVisibleProperty.value ) {
        this.visibleProperty.reset();
        this.secondsSinceVisible = 0;
      }
    }
  }

  /**
   * Sets this.coordinatesProperty with new coordinates for the current subitizeNumber
   * @public
   */
  setNewCoordinates() {
    const subitizeNumber = this.subitizeNumberProperty.value;
    let coordinates = [];

    // 60/40 chance whether the pattern uses an random configuration or an arranged one for level 1, level 2 always
    // uses a configuration in a randomly set pattern/array
    if ( this.randomAndArranged ) {
      if ( dotRandom.nextDouble() >= 0.4 ) {

        // pick out a random shape for the corresponding subitizeNumber
        const randomPatternIndex = dotRandom.nextInt( SHAPES[ subitizeNumber ].length );
        const shape = SHAPES[ subitizeNumber ][ randomPatternIndex ];
        coordinates = shape.coordinates;

        // if the shape has rotations available, randomly pick one to assign
        if ( shape.rotations.length && dotRandom.nextBoolean() ) {
          const randomRotationIndex = dotRandom.nextInt( shape.rotations.length );
          coordinates = this.rotateCoordinates( coordinates, shape.rotations[ randomRotationIndex ] );
        }
      }
      else {

        // generate random coordinates for the subitizeNumber positions
        while ( coordinates.length < subitizeNumber ) {
          const randomX = dotRandom.nextDoubleBetween( -2, 2 );
          const randomY = dotRandom.nextDoubleBetween( -1, 1 );

          // add a new coordinate if it doesn't exist yet and does not overlap with the existing coordinates
          const objectsOverlap = this.objectsOverlap( coordinates, randomX, randomY );
          if ( !_.find( coordinates, object => object.x === randomX && object.y === randomY ) && !objectsOverlap ) {
            coordinates.push( new Vector2( randomX, randomY ) );
          }
        }
      }
    }
    else {

      // get a random numberOfRows and set the numberOfColumns
      const maxNumberOfRows = 3;
      const minNumberOfRows = 2;
      const numberOfRows = dotRandom.nextIntBetween( minNumberOfRows, maxNumberOfRows );
      let numberOfColumns = 0;

      // get the number of necessary columns to fit all the object representations to subitize
      while ( numberOfColumns * numberOfRows < subitizeNumber ) {
        numberOfColumns++;
      }

      // create and add the coordinates
      const startX = ( numberOfColumns - 1 ) / -2;
      const startY = ( numberOfRows - 1 ) / -2;
      for ( let j = 0; j < numberOfRows; j++ ) {
        for ( let i = 0; i < numberOfColumns; i++ ) {
          if ( coordinates.length < subitizeNumber ) {
            coordinates.push( new Vector2( startX + i, startY + j ) );
          }
        }
      }
    }

    if ( !this.isSameCoordinates( this.coordinatesProperty.value, coordinates ) ) {
      this.coordinatesProperty.value = coordinates;
    }
    else {
      this.setNewCoordinates();
    }
  }

  /**
   * Rotate each coordinate of the shape shape around the origin.
   *
   * @param {Vector2[]} coordinates
   * @param {number} rotationAngle - in radians
   * @returns {Vector2[]}
   * @private
   */
  rotateCoordinates( coordinates: Vector2[], rotationAngle: number ) {
    const rotationMatrix = new Matrix3().setToRotationZ( rotationAngle );

    const rotatedCoordinates: Vector2[] = [];
    coordinates.forEach( point => {
      rotatedCoordinates.push( rotationMatrix.timesVector2( point ) );
    } );

    return rotatedCoordinates;
  }

  /**
   * Compares the bounds of a coordinate to be added to all other existing coordinates and returns if the coordinate to
   * be added overlaps with any existing coordinate
   * @param {Vector2[]} coordinates
   * @param {number} randomX - X coordinate
   * @param {number} randomY - Y coordinate
   * @returns {boolean}
   * @private
   */
  objectsOverlap( coordinates: Vector2[], randomX: number, randomY: number ) {
    let overlap = false;
    const objectTotalWidth = OBJECT_WIDTH + 0.1;
    const objectTotalHalfWidth = objectTotalWidth / 2;
    if ( coordinates.length > 0 ) {
      for ( let i = 0; i < coordinates.length; i++ ) {
        const coordinate = coordinates[ i ];
        const coordinateObjectBounds = new Bounds2( coordinate.x - objectTotalHalfWidth, coordinate.y - objectTotalHalfWidth, coordinate.x + objectTotalHalfWidth, coordinate.y + objectTotalHalfWidth );
        const randomObjectBounds = new Bounds2( randomX - objectTotalHalfWidth, randomY - objectTotalHalfWidth, randomX + objectTotalHalfWidth, randomY + objectTotalHalfWidth );
        overlap = coordinateObjectBounds.intersectsBounds( randomObjectBounds );
        if ( overlap ) {
          break;
        }
      }
    }
    return overlap;
  }

  /**
   * Compares two sets of coordinates and returns if they are equal or not
   *
   * @param {Vector2[]} coordinatesSetOne
   * @param {Vector2[]} coordinatesSetTwo
   * @returns {boolean}
   * @private
   */
  isSameCoordinates( coordinatesSetOne: Vector2[], coordinatesSetTwo: Vector2[] ) {
    let coordinatesAreEqual = true;
    if ( coordinatesSetOne.length === coordinatesSetTwo.length ) {
      for ( let i = 0; i < coordinatesSetOne.length; i++ ) {
        if ( !coordinatesSetOne[ i ].equals( coordinatesSetTwo[ i ] ) ) {
          return false;
        }
      }
    }
    else {
      coordinatesAreEqual = false;
    }
    return coordinatesAreEqual;
  }

  /**
   * @public
   */
  reset() {
    this.visibleProperty.reset();
    this.isPlayingProperty.reset();
  }
}

numberPlay.register( 'Subitizer', Subitizer );
export default Subitizer;