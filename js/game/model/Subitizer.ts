// Copyright 2021, University of Colorado Boulder

/**
 * Subitizer generates the arranged and random objects that make up a shape.
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
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import NumberPlayQueryParameters from '../../common/NumberPlayQueryParameters.js';
import numberPlay from '../../numberPlay.js';
import SubitizeObjectTypeEnum, { SubitizeObjectTypeValues } from './SubitizeObjectTypeEnum.js';

//TODO-TS: naming for a type used as a constant like this?
type Shapes = {
  [ key: number ]: {
    points: Vector2[],
    rotations: number[]
  }[],
};

// constants
const DECIMALS = 4;

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
    points: [ v2( 0, 0 ) ], // centered dot
    rotations: []
  } ],
  2: [ {
    points: [ v2( -0.5, 0 ), v2( 0.5, 0 ) ], // row
    rotations: [ DEGREES_45, DEGREES_90, DEGREES_135 ]
  } ],
  3: [ {
    points: [ v2( -1, 0 ), v2( 0, 0 ), v2( 1, 0 ) ], // row
    rotations: [ DEGREES_90 ]
  }, {
    points: [ v2( -1, -1 ), v2( 0, 0 ), v2( 1, 1 ) ], // diagonal row
    rotations: [ DEGREES_90 ]
  }, {
    points: [ v2( -1, 1 ), v2( 0, -1 ), v2( 1, 1 ) ], // triangle pointing up
    rotations: [ DEGREES_90, DEGREES_180, DEGREES_270 ]
  } ],
  4: [ {
    points: [ v2( -1.5, 0 ), v2( -0.5, 0 ), v2( 0.5, 0 ), v2( 1.5, 0 ) ], // row
    rotations: []
  }, {
    points: [ v2( -0.7, -0.7 ), v2( 0.7, -0.7 ), v2( -0.7, 0.7 ), v2( 0.7, 0.7 ) ], // square
    rotations: [ DEGREES_45 ]
  } ],
  5: [ {
    points: [ v2( -2, 0 ), v2( -1, 0 ), v2( 0, 0 ), v2( 1, 0 ), v2( 2, 0 ) ], // row
    rotations: []
  }, {
    points: [ v2( -1, -1 ), v2( 1, -1 ), v2( 0, 0 ), v2( -1, 1 ), v2( 1, 1 ) ], // 5 in a "die" formation
    rotations: []
  }, {
    points: [ v2( 0, -1 ), v2( 0, 0 ), v2( 0, 1 ), v2( 1, -0.5 ), v2( 1, 0.5 ) ], // 3 left and 2 centered on right
    rotations: [ DEGREES_90, DEGREES_180, DEGREES_270 ]
  }, {
    points: [ v2( 0, -1 ), v2( 0, 0 ), v2( 0, 1 ), v2( 1, -1 ), v2( 1, 0 ) ], // 3 left and 2 top right
    rotations: [ DEGREES_90, DEGREES_180, DEGREES_270 ]
  }, {
    points: [ v2( 0, -1 ), v2( 0, 0 ), v2( 0, 1 ), v2( 1, 0 ), v2( 1, 1 ) ], // 3 left and 2 bottom right
    rotations: [ DEGREES_90, DEGREES_180, DEGREES_270 ]
  } ]
};

// width of the object, in model units. An object is the representation that is rendered at each point of a
// shape.
const OBJECT_SIZE = 0.7;

// padding around an object, in model units. This is the closest distance that two objects can be together,
// measured from edge to edge (not center to center).
const OBJECT_PADDING = 0.2;

// the area in which the objects of a shape can be created. This does not take into account the size of an object, but
// rather the area where the centers of each object are allowed.
const SHAPE_BOUNDS = new Bounds2( -2, -1, 2, 1 );

// the area for the whole subitizer, including padding between the exterior and where the objects are allowed to be.
// this is used to render the subitizer node in the view.
const SUBITIZER_BOUNDS = SHAPE_BOUNDS.dilated( OBJECT_SIZE / 2 + OBJECT_PADDING );

class Subitizer {

  private readonly challengeNumberProperty: NumberProperty;
  private readonly isChallengeSolvedProperty: BooleanProperty;
  public readonly shapeVisibleProperty: BooleanProperty;
  public readonly pointsProperty: Property<Vector2[]>;
  private readonly randomAndArranged: boolean;
  private secondsSinceShapeVisible: number;
  public readonly objectSize: number;
  public readonly inputEnabledProperty: BooleanProperty;
  private subitizerTimeVisibleProperty: DerivedProperty<number>;
  public objectTypeProperty: Property<SubitizeObjectTypeEnum>;
  public startDelay: boolean;
  private shapeVisibleDelaySeconds: number;
  public readonly loadingBarAnimatingProperty: BooleanProperty;
  public static SUBITIZER_BOUNDS: Bounds2;
  public readonly playButtonVisibleProperty: BooleanProperty;

  constructor( challengeNumberProperty: NumberProperty,
               isChallengeSolvedProperty: BooleanProperty,
               numberOfAnswerButtonPressesProperty: NumberProperty,
               randomAndArranged: boolean
  ) {
    this.challengeNumberProperty = challengeNumberProperty;
    this.isChallengeSolvedProperty = isChallengeSolvedProperty;
    this.shapeVisibleProperty = new BooleanProperty( false );
    this.playButtonVisibleProperty = new BooleanProperty( true );

    // whether the loading bar is animating. This can also be used to stop an existing animation.
    this.loadingBarAnimatingProperty = new BooleanProperty( false );

    // the points of the current shape
    this.pointsProperty = new Property( [ Vector2.ZERO ], {
      valueType: Array,
      arrayElementType: Vector2
    } );

    // whether we can choose to use a random and arranged shape
    this.randomAndArranged = randomAndArranged;

    // the number of seconds the sim clock has run since the shape was made visible
    this.secondsSinceShapeVisible = 0;

    // the number of seconds the sim clock has run since the shape's visibility was delayed
    this.shapeVisibleDelaySeconds = 0;

    // initialize first set of points
    this.setNewPoints();

    // the width and height of every object used to make a shape
    this.objectSize = OBJECT_SIZE;

    // whether the current challenge started
    this.startDelay = false;

    // Indicates when input is enabled to answer the current challenge. True when the current challenge is not solved.
    // False when the current challenge is solved. Manipulated only in the view.
    this.inputEnabledProperty = new BooleanProperty( false );

    // the object type of the current shape
    this.objectTypeProperty = new Property<SubitizeObjectTypeEnum>( 'dog' );

    // how long the shape is visible when shown
    this.subitizerTimeVisibleProperty = new DerivedProperty( [ numberOfAnswerButtonPressesProperty ], ( numberOfAnswerButtonPresses: number ) => {
      if ( numberOfAnswerButtonPresses > NumberPlayConstants.SUBITIZER_GUESSES_AT_NORMAL_TIME ) {
        return this.subitizerTimeVisibleProperty.value + NumberPlayConstants.SUBITIZER_TIME_INCREASE_AMOUNT;
      }
      return NumberPlayQueryParameters.subitizerTimeVisible;
    } );

    Subitizer.assertValidShapes();
  }

  public step( dt: number ): void {

    // delay the visibility of the subitizer at the start of every challenge
    if ( this.startDelay ) {
      this.shapeVisibleDelaySeconds += dt;

      // hide the loading bar after a delay of 0.2 seconds
      if ( this.shapeVisibleDelaySeconds > 0.2 && this.loadingBarAnimatingProperty.value ) {
        this.loadingBarAnimatingProperty.value = false;
      }
      // show the subitizer and enable answer inputs after a delay of 0.5 seconds
      else if ( this.shapeVisibleDelaySeconds > 0.5 ) {
        this.inputEnabledProperty.value = true;
        this.shapeVisibleProperty.value = true;
        this.resetSubitizerDelay();
      }
    }

    // keep adding to secondsSinceShapeVisible if the subitizer is visible and not paused
    if ( this.shapeVisibleProperty.value && this.inputEnabledProperty.value ) {
      this.secondsSinceShapeVisible += dt;

      // hide the subitizer and reset the time counter if the subitizer has been visible for as long as desired
      if ( this.secondsSinceShapeVisible > this.subitizerTimeVisibleProperty.value ) {
        this.resetSubitizerVisible();
      }
    }
  }

  public newChallenge(): void {

    // set values for the step function to handle sequence of showing and hiding game parts for a new challenge
    this.startDelay = true;
    this.inputEnabledProperty.value = false;
    this.shapeVisibleProperty.value = false;

    // set play object type and shape
    this.setRandomPlayObjectType();
    this.setNewPoints();

    // skip the challenge started sequence in the step function
    if ( NumberPlayQueryParameters.showCorrectAnswer ) {
      this.loadingBarAnimatingProperty.value = false;
      this.startDelay = false;
    }
  }

  /**
   * Reset start sequence if the current challenge is unsolved. Because the start sequence proceeds normally if a user
   * chooses to leave a challenge after kicking off the start sequence (by clicking play), we need to reset all aspects
   * of the start sequence (including all parts that happen during the step function).
   */
  public resetStartSequence(): void {
    if ( !this.isChallengeSolvedProperty.value ) {
      this.loadingBarAnimatingProperty.reset();
      this.resetSubitizerDelay();
      this.resetSubitizerVisible();
      this.playButtonVisibleProperty.reset();
      this.inputEnabledProperty.reset();
    }
  }

  private resetSubitizerDelay(): void {
    this.shapeVisibleDelaySeconds = 0;
    this.startDelay = false;
  }

  private resetSubitizerVisible(): void {
    this.shapeVisibleProperty.reset();
    this.secondsSinceShapeVisible = 0;
  }

  /**
   * Sets this.pointsProperty with new points for the current subitizeNumber
   */
  public setNewPoints(): void {
    const subitizeNumber = this.challengeNumberProperty.value;
    let points = [];

    // 60/40 chance whether the pattern uses an random configuration or an arranged one for level 1, level 2 always
    // uses a configuration in a randomly set pattern/array
    if ( this.randomAndArranged ) {
      if ( dotRandom.nextDouble() >= 0.4 ) {

        // pick out a random shape for the corresponding subitizeNumber
        const randomPatternIndex = dotRandom.nextInt( SHAPES[ subitizeNumber ].length );
        const shape = SHAPES[ subitizeNumber ][ randomPatternIndex ];
        points = shape.points;

        // if the shape has rotations available, randomly pick one to rotate by 50% of the time
        if ( shape.rotations.length && dotRandom.nextBoolean() ) {
          const randomRotationIndex = dotRandom.nextInt( shape.rotations.length );
          points = Subitizer.rotatePoints( points, shape.rotations[ randomRotationIndex ] );
        }
      }
      else {

        // generate random points for the subitizeNumber positions
        while ( points.length < subitizeNumber ) {
          const randomX = dotRandom.nextDoubleBetween( SHAPE_BOUNDS.minX, SHAPE_BOUNDS.maxX );
          const randomY = dotRandom.nextDoubleBetween( SHAPE_BOUNDS.minY, SHAPE_BOUNDS.maxY );

          // add a new point if it doesn't exist yet and does not overlap with the existing points
          const objectsOverlap = Subitizer.objectsOverlap( points, randomX, randomY );
          if ( !_.find( points, object => object.x === randomX && object.y === randomY ) && !objectsOverlap ) {
            points.push( new Vector2( randomX, randomY ) );
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

      // create and add the points
      const startX = ( numberOfColumns - 1 ) / -2;
      const startY = ( numberOfRows - 1 ) / -2;
      for ( let j = 0; j < numberOfRows; j++ ) {
        for ( let i = 0; i < numberOfColumns; i++ ) {
          if ( points.length < subitizeNumber ) {
            points.push( new Vector2( startX + i, startY + j ) );
          }
        }
      }
    }

    if ( !Subitizer.isSamePoints( this.pointsProperty.value, points ) ) {
      this.pointsProperty.value = points;
    }
    else {
      this.setNewPoints();
    }
  }

  /**
   * Sets this.objectTypeProperty with a new object type for the current challenge.
   */
  public setRandomPlayObjectType(): void {
    this.objectTypeProperty.value = dotRandom.sample( SubitizeObjectTypeValues.slice() );
  }

  public reset(): void {
    this.shapeVisibleProperty.reset();
    this.inputEnabledProperty.reset();
    this.playButtonVisibleProperty.reset();
  }

  /**
   * Rotates each point of the shape shape around the origin.
   */
  private static rotatePoints( points: Vector2[], rotationAngle: number ): Vector2[] {
    const rotationMatrix = new Matrix3().setToRotationZ( rotationAngle );

    const rotatedPoints: Vector2[] = [];
    points.forEach( point => {
      rotatedPoints.push( rotationMatrix.timesVector2( point ) );
    } );

    return rotatedPoints;
  }

  /**
   * Compares the bounds of a point to be added to all other existing points and returns if the point to
   * be added overlaps with any existing point.
   */
  private static objectsOverlap( points: Vector2[], randomX: number, randomY: number ): boolean {
    let overlap = false;
    const objectTotalWidth = OBJECT_SIZE + OBJECT_PADDING;
    const objectTotalHalfWidth = objectTotalWidth / 2;
    if ( points.length > 0 ) {
      for ( let i = 0; i < points.length; i++ ) {
        const point = points[ i ];
        const pointObjectBounds = new Bounds2(
          point.x - objectTotalHalfWidth,
          point.y - objectTotalHalfWidth,
          point.x + objectTotalHalfWidth,
          point.y + objectTotalHalfWidth
        );
        const randomObjectBounds = new Bounds2( randomX - objectTotalHalfWidth,
          randomY - objectTotalHalfWidth,
          randomX + objectTotalHalfWidth,
          randomY + objectTotalHalfWidth
        );
        overlap = pointObjectBounds.intersectsBounds( randomObjectBounds );
        if ( overlap ) {
          break;
        }
      }
    }
    return overlap;
  }

  /**
   * Compares two sets of points and returns if they are equal or not.
   */
  private static isSamePoints( pointsSetOne: Vector2[], pointsSetTwo: Vector2[] ): boolean {
    let pointsAreEqual = true;
    if ( pointsSetOne.length === pointsSetTwo.length ) {
      for ( let i = 0; i < pointsSetOne.length; i++ ) {
        if ( !pointsSetOne[ i ].equals( pointsSetTwo[ i ] ) ) {
          return false;
        }
      }
    }
    else {
      pointsAreEqual = false;
    }
    return pointsAreEqual;
  }

  /**
   * Asserts that every point in every shape is within the model bounds for every possible rotation of the shape.
   */
  private static assertValidShapes(): void {
    for ( const key in SHAPES ) {
      SHAPES[ key ].forEach( shape => { // iterate over each shape in the shape set for the given number (key)
        const shapeRotations = shape.rotations;
        shapeRotations.unshift( 0 ); // add 0 degrees to every set of rotations so 0 is tested too

        // check that the points of each rotation for a shape are within the model bounds
        shapeRotations.forEach( rotationAngle => {
          const rotatedPoints = Subitizer.rotatePoints( shape.points, rotationAngle );
          rotatedPoints.forEach( point => {
            assert && assert( SHAPE_BOUNDS.containsPoint( Subitizer.fixPoint( point ) ),
              `vector point ${point.toString()} from shape ${key} is outside the object bounds when rotation ` +
              `${rotationAngle} is applied: ${SHAPE_BOUNDS.toString()}` );
          } );
        } );
      } );
    }
  }

  /**
   * Fixes points that have wrong values due to JavaScript decimal math error
   */
  private static fixPoint( point: Vector2 ): Vector2 {
    return new Vector2( Utils.toFixedNumber( point.x, DECIMALS ), Utils.toFixedNumber( point.y, DECIMALS ) );
  }
}

Subitizer.SUBITIZER_BOUNDS = SUBITIZER_BOUNDS;

numberPlay.register( 'Subitizer', Subitizer );
export default Subitizer;