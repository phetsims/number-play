// Copyright 2021, University of Colorado Boulder

/**
 * Subitizer generates the arranged and random patterns of the objects.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

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
import SubitizeObjectTypeEnum from './SubitizeObjectTypeEnum.js';
import { SubitizeObjectTypeValues } from './SubitizeObjectTypeEnum.js';

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
    coordinates: [ v2( -0.75, -0.75 ), v2( 0.75, -0.75 ), v2( -0.75, 0.75 ), v2( 0.75, 0.75 ) ], // square
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
const OBJECT_SIZE = 0.4444; // width of the object in model coordinates

class Subitizer {

  public readonly challengeNumberProperty: NumberProperty;
  public readonly visibleProperty: BooleanProperty;
  public readonly coordinatesProperty: Property<Vector2[]>;
  private readonly randomAndArranged: boolean;
  private secondsSinceVisible: number;
  public readonly objectSize: number;
  public readonly inputEnabledProperty: BooleanProperty;
  private subitizerTimeVisibleProperty: DerivedProperty<number>;
  public objectTypeProperty: Property<SubitizeObjectTypeEnum>;
  public challengeStartedProperty: BooleanProperty;
  private subitizerVisibleDelaySeconds: number;
  private startSequencePlayingProperty: BooleanProperty;

  constructor( challengeNumberProperty: NumberProperty,
               numberOfAnswerButtonPressesProperty: NumberProperty,
               startSequencePlayingProperty: BooleanProperty,
               randomAndArranged: boolean
  ) {
    this.challengeNumberProperty = challengeNumberProperty;
    this.startSequencePlayingProperty = startSequencePlayingProperty;

    // whether the current shape is visible
    this.visibleProperty = new BooleanProperty( false );

    // the coordinates of the current shape
    this.coordinatesProperty = new Property( [ Vector2.ZERO ], {
      valueType: Array,
      arrayElementType: Vector2
    } );

    // whether we can choose to use a random and arranged pattern
    this.randomAndArranged = randomAndArranged;

    // the number of seconds the sim clock has run since the subitizer was made visible
    this.secondsSinceVisible = 0;

    // the number of seconds the sim clock has run since the subitizer's visibility was delayed
    this.subitizerVisibleDelaySeconds = 0;

    // initialize first set of coordinates
    this.setNewCoordinates();

    // the width and height of every object used to make a shape
    this.objectSize = OBJECT_SIZE;

    // whether the current challenge started
    this.challengeStartedProperty = new BooleanProperty( false );

    // Indicates when input is enabled to answer the current challenge. True when the current challenge is not solved.
    // False when the current challenge is solved. Manipulated only in the view.
    this.inputEnabledProperty = new BooleanProperty( false );

    // the object type of the current shape
    this.objectTypeProperty = new Property<SubitizeObjectTypeEnum>( 'dog' );

    // how long the subitizer is visible when shown
    this.subitizerTimeVisibleProperty = new DerivedProperty( [ numberOfAnswerButtonPressesProperty ], ( numberOfAnswerButtonPresses: number ) => {
      if ( numberOfAnswerButtonPresses > NumberPlayConstants.SUBITIZER_GUESSES_AT_NORMAL_TIME ) {
        return this.subitizerTimeVisibleProperty.value + NumberPlayConstants.SUBITIZER_TIME_INCREASE_AMOUNT;
      }
      return NumberPlayQueryParameters.subitizerTimeVisible;
    } );
  }

  public step( dt: number ) {

    // delay the visibility of the subitizer at the start of every challenge
    if ( this.challengeStartedProperty.value ) {
      this.subitizerVisibleDelaySeconds += dt;

      // show the subitizer and enable answer inputs after a delay of 0.5 seconds
      if ( this.subitizerVisibleDelaySeconds > 0.5 ) {
        this.inputEnabledProperty.value = true;
        this.visibleProperty.value = true;
        this.subitizerVisibleDelaySeconds = 0;
        this.challengeStartedProperty.reset();
      }
    }

    // keep adding to secondsSinceVisible if the subitizer is visible and not paused
    if ( this.visibleProperty.value && this.inputEnabledProperty.value ) {
      this.secondsSinceVisible += dt;

      // hide the subitizer and reset the time counter if the subitizer has been visible for as long as desired
      if ( this.secondsSinceVisible > this.subitizerTimeVisibleProperty.value ) {
        this.visibleProperty.reset();
        this.secondsSinceVisible = 0;
      }
    }
  }

  newChallenge(): void {
    const isStartSequence = this.startSequencePlayingProperty.value; //TODO: pretty weird, keep working on this
    this.inputEnabledProperty.value = isStartSequence;
    this.visibleProperty.value = isStartSequence;
    this.challengeStartedProperty.value = !isStartSequence;
    !isStartSequence && this.setRandomPlayObjectType();
    this.setNewCoordinates();
  }

  /**
   * Sets this.coordinatesProperty with new coordinates for the current subitizeNumber
   */
  public setNewCoordinates() {
    const subitizeNumber = this.challengeNumberProperty.value;
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
          coordinates = Subitizer.rotateCoordinates( coordinates, shape.rotations[ randomRotationIndex ] );
        }
      }
      else {

        // generate random coordinates for the subitizeNumber positions
        while ( coordinates.length < subitizeNumber ) {
          const randomX = dotRandom.nextDoubleBetween( -2, 2 );
          const randomY = dotRandom.nextDoubleBetween( -1, 1 );

          // add a new coordinate if it doesn't exist yet and does not overlap with the existing coordinates
          const objectsOverlap = Subitizer.objectsOverlap( coordinates, randomX, randomY );
          if ( !_.find( coordinates, object => object.x === randomX && object.y === randomY ) && !objectsOverlap ) {
            coordinates.push( new Vector2( randomX, randomY ) );
          }
        }
      }
    }
    else {

      // get a random number of rows and set the number of columns
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

    if ( !Subitizer.isSameCoordinates( this.coordinatesProperty.value, coordinates ) ) {
      this.coordinatesProperty.value = coordinates;
    }
    else {
      this.setNewCoordinates();
    }
  }

  /**
   * Sets this.objectTypeProperty with a new object type for the current challenge.
   */
  public setRandomPlayObjectType() {
    this.objectTypeProperty.value = dotRandom.sample( SubitizeObjectTypeValues.slice() );
  }

  public reset() {
    this.visibleProperty.reset();
    this.inputEnabledProperty.reset();
  }

  /**
   * Rotate each coordinate of the shape shape around the origin.
   */
  private static rotateCoordinates( coordinates: Vector2[], rotationAngle: number ): Vector2[] {
    const rotationMatrix = new Matrix3().setToRotationZ( rotationAngle );

    const rotatedCoordinates: Vector2[] = [];
    coordinates.forEach( point => {
      rotatedCoordinates.push( rotationMatrix.timesVector2( point ) );
    } );

    return rotatedCoordinates;
  }

  /**
   * Compares the bounds of a coordinate to be added to all other existing coordinates and returns if the coordinate to
   * be added overlaps with any existing coordinate.
   */
  private static objectsOverlap( coordinates: Vector2[], randomX: number, randomY: number ): boolean {
    let overlap = false;
    const objectTotalWidth = OBJECT_SIZE + 0.1;
    const objectTotalHalfWidth = objectTotalWidth / 2;
    if ( coordinates.length > 0 ) {
      for ( let i = 0; i < coordinates.length; i++ ) {
        const coordinate = coordinates[ i ];
        const coordinateObjectBounds = new Bounds2(
          coordinate.x - objectTotalHalfWidth,
          coordinate.y - objectTotalHalfWidth,
          coordinate.x + objectTotalHalfWidth,
          coordinate.y + objectTotalHalfWidth
        );
        const randomObjectBounds = new Bounds2( randomX - objectTotalHalfWidth,
          randomY - objectTotalHalfWidth,
          randomX + objectTotalHalfWidth,
          randomY + objectTotalHalfWidth
        );
        overlap = coordinateObjectBounds.intersectsBounds( randomObjectBounds );
        if ( overlap ) {
          break;
        }
      }
    }
    return overlap;
  }

  /**
   * Compares two sets of coordinates and returns if they are equal or not.
   */
  private static isSameCoordinates( coordinatesSetOne: Vector2[], coordinatesSetTwo: Vector2[] ): boolean {
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
}

numberPlay.register( 'Subitizer', Subitizer );
export default Subitizer;