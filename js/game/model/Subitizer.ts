// Copyright 2021-2023, University of Colorado Boulder

/**
 * Subitizer generates the arranged and random points that make up a shape. It is also responsible for the sequence of
 * showing and hiding a shape during a challenge.
 *
 * A shape is a set of points which can be predetermined (hard coded points), random (randomly generated points), or
 * arranged (a grid-like arrangement generated with some randomness).
 *
 * An object is the representation that is rendered at each point of a shape. An object can take many forms, see
 * SubitizeObjectType for available types.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import numberPlay from '../../numberPlay.js';
import SubitizeObjectType from './SubitizeObjectType.js';
import numberPlayPreferences from '../../common/model/numberPlayPreferences.js';

// types
type PredeterminedShapes = Record<number, {
  points: Vector2[];
  rotations: number[];
}[]>;

// constants

// angles
const DEGREES_0 = 0;
const DEGREES_45 = Math.PI * 0.25;
const DEGREES_90 = Math.PI * 0.5;
const DEGREES_135 = Math.PI * 0.75;
const DEGREES_180 = Math.PI;
const DEGREES_270 = Math.PI * ( 3 / 2 );

// convenience function for easier reading
const v2 = ( x: number, y: number ) => new Vector2( x, y );

// define predetermined shapes, which are all assumed to be centered around (0, 0)
const PREDETERMINED_SHAPES: PredeterminedShapes = {
  1: [ {
    points: [ v2( 0, 0 ) ], // centered dot
    rotations: [ DEGREES_0 ]
  } ],
  2: [ {
    points: [ v2( -0.5, 0 ), v2( 0.5, 0 ) ], // row
    rotations: [ DEGREES_0, DEGREES_45, DEGREES_90, DEGREES_135 ]
  } ],
  3: [ {
    points: [ v2( -1, 0 ), v2( 0, 0 ), v2( 1, 0 ) ], // row
    rotations: [ DEGREES_0, DEGREES_90 ]
  }, {
    points: [ v2( -1, -1 ), v2( 0, 0 ), v2( 1, 1 ) ], // diagonal row
    rotations: [ DEGREES_0, DEGREES_90 ]
  }, {
    points: [ v2( -1, 1 ), v2( 0, -1 ), v2( 1, 1 ) ], // triangle pointing up
    rotations: [ DEGREES_0, DEGREES_90, DEGREES_180, DEGREES_270 ]
  } ],
  4: [ {
    points: [ v2( -1.5, 0 ), v2( -0.5, 0 ), v2( 0.5, 0 ), v2( 1.5, 0 ) ], // row
    rotations: [ DEGREES_0 ]
  }, {
    points: [ v2( -0.7, -0.7 ), v2( 0.7, -0.7 ), v2( -0.7, 0.7 ), v2( 0.7, 0.7 ) ], // square
    rotations: [ DEGREES_0, DEGREES_45 ]
  } ],
  5: [ {
    points: [ v2( -2, 0 ), v2( -1, 0 ), v2( 0, 0 ), v2( 1, 0 ), v2( 2, 0 ) ], // row
    rotations: [ DEGREES_0 ]
  }, {
    points: [ v2( -1, -1 ), v2( 1, -1 ), v2( 0, 0 ), v2( -1, 1 ), v2( 1, 1 ) ], // 5 in a "die" formation
    rotations: [ DEGREES_0 ]
  }, {
    points: [ v2( -0.5, -1 ), v2( -0.5, 0 ), v2( -0.5, 1 ), v2( 0.5, -0.5 ), v2( 0.5, 0.5 ) ], // 2 columns, 3:2 "zipper" formation
    rotations: [ DEGREES_0, DEGREES_90, DEGREES_180, DEGREES_270 ]
  }, {
    points: [ v2( -0.5, -1 ), v2( -0.5, 0 ), v2( -0.5, 1 ), v2( 0.5, -1 ), v2( 0.5, 0 ) ], // 2 columns, 3:2 top-aligned
    rotations: [ DEGREES_0, DEGREES_90, DEGREES_180, DEGREES_270 ]
  }, {
    points: [ v2( -0.5, -1 ), v2( -0.5, 0 ), v2( -0.5, 1 ), v2( 0.5, 0 ), v2( 0.5, 1 ) ], // 2 columns, 3:2 bottom-aligned
    rotations: [ DEGREES_0, DEGREES_90, DEGREES_180, DEGREES_270 ]
  } ]
};
const PROBABILITY_OF_PREDETERMINED_SHAPE = 0.6; // specified by designer

// how many decimals to round to when correcting buggy JS floats
const DECIMALS = 4;

// width of each object, in model units
const OBJECT_SIZE = 0.7;

// padding around an object, in model units. This is the closest distance that two objects can be together,
// measured from edge to edge (not center to center).
const OBJECT_PADDING = 0.2;

// the area in which the points of a shape can be created. This does not take into account the size of an object 
// rendered at each point, because a point is the center of its corresponding object.
const SHAPE_BOUNDS = new Bounds2( -2, -1, 2, 1 );

// the area for the whole subitizer, including padding between the exterior and where the objects are allowed to be.
// this is used to render the subitizer node in the view.
const SUBITIZER_BOUNDS = SHAPE_BOUNDS.dilated( OBJECT_SIZE / 2 + OBJECT_PADDING );

// for calculating arranged shapes. all dependant on SHAPE_BOUNDS, but clearer to state explicitly than derive
const MIN_NUMBER_OF_COLUMNS = 2;
const MAX_NUMBER_OF_COLUMNS = 5;
const MIN_NUMBER_OF_ROWS = 2;
const MAX_NUMBER_OF_ROWS = 3;

// list of valid object types. SubitizeObjectType extends from a another enumeration, so a subset must be selected to
// get the desired values.
const SUBITIZER_OBJECT_TYPES = [
  SubitizeObjectType.DOG, SubitizeObjectType.APPLE, SubitizeObjectType.BUTTERFLY, SubitizeObjectType.BALL,
  SubitizeObjectType.CIRCLE
];

class Subitizer {

  private readonly challengeNumberProperty: TReadOnlyProperty<number>;
  private readonly isChallengeSolvedProperty: TReadOnlyProperty<boolean>;

  // whether the current shape is visible
  public readonly isShapeVisibleProperty: BooleanProperty;

  // the points of the current shape
  public readonly pointsProperty: Property<Vector2[]>;

  // if true, make random or predetermined shapes. if false, only make arranged shapes.
  private readonly randomOrPredetermined: boolean;

  // the amount of time that the sim clock has run since the shape was made visible, in seconds
  private timeSinceShapeVisible: number;

  // the width and height of every object
  public readonly objectSize: number;

  // Indicates when input is enabled to answer the current challenge. True when the current challenge is not solved.
  // False when the current challenge is solved. Manipulated only in the view.
  public readonly isInputEnabledProperty: BooleanProperty;

  // the object type of the current shape
  public readonly objectTypeProperty: EnumerationProperty<SubitizeObjectType>;

  // whether the delay has been started. a delay happens at the beginning of a new challenge, before revealing the
  // shape for that challenge.
  private isDelayStarted: boolean;

  // the amount of time that the sim clock has run since the delay was started, in seconds
  private timeSinceDelayStarted: number;

  // whether the loading bar is animating. This can also be used to stop an existing animation.
  public readonly isLoadingBarAnimatingProperty: BooleanProperty;
  public static readonly SUBITIZER_BOUNDS = SUBITIZER_BOUNDS;

  // whether the play button is visible
  public readonly isPlayButtonVisibleProperty: BooleanProperty;

  public constructor( challengeNumberProperty: TReadOnlyProperty<number>,
                      isChallengeSolvedProperty: TReadOnlyProperty<boolean>,
                      numberOfAnswerButtonPressesProperty: TReadOnlyProperty<number>,
                      randomOrPredetermined: boolean
  ) {
    this.challengeNumberProperty = challengeNumberProperty;
    this.isChallengeSolvedProperty = isChallengeSolvedProperty;

    this.isPlayButtonVisibleProperty = new BooleanProperty( true );

    this.isLoadingBarAnimatingProperty = new BooleanProperty( false );

    this.isShapeVisibleProperty = new BooleanProperty( false );

    this.pointsProperty = new Property( [ Vector2.ZERO ], {
      valueType: Array,
      isValidValue: value => Array.isArray( value ) && value.every( element => element instanceof Vector2 )
    } );

    this.randomOrPredetermined = randomOrPredetermined;

    this.isDelayStarted = false;

    this.timeSinceDelayStarted = 0;

    this.timeSinceShapeVisible = 0;

    this.objectSize = OBJECT_SIZE;

    this.isInputEnabledProperty = new BooleanProperty( false );

    this.objectTypeProperty = new EnumerationProperty( SubitizeObjectType.DOG, {
      enumeration: SubitizeObjectType.enumeration,
      validValues: SUBITIZER_OBJECT_TYPES
    } );

    Subitizer.assertValidPredeterminedShapes();

    // initialize first set of points
    this.setNewPoints();
  }

  /**
   * @param dt - in seconds
   */
  public step( dt: number ): void {

    if ( this.isDelayStarted ) {
      this.timeSinceDelayStarted += dt;

      // hide the loading bar after briefly showing it in a filled state
      if ( this.timeSinceDelayStarted > 0.2 && this.isLoadingBarAnimatingProperty.value ) {
        this.isLoadingBarAnimatingProperty.value = false;
      }
      // show the shape and enable answer inputs after a delay
      else if ( this.timeSinceDelayStarted > NumberPlayConstants.SHAPE_DELAY_TIME ) {
        this.isInputEnabledProperty.value = true;
        this.isShapeVisibleProperty.value = true;
        this.resetDelay();
      }
    }

    // hide the shape after it's been visible for long enough 
    if ( this.isShapeVisibleProperty.value && this.isInputEnabledProperty.value ) {
      this.timeSinceShapeVisible += dt;

      if ( this.timeSinceShapeVisible > numberPlayPreferences.subitizeTimeShownProperty.value ) {
        this.resetShapeVisible();
      }
    }
  }

  public newChallenge(): void {

    // set values for the step function to handle sequence of showing and hiding game parts for a new challenge
    this.isDelayStarted = true;
    this.isInputEnabledProperty.value = false;
    this.resetShapeVisible();

    // set countingObject type and shape
    this.setRandomCountingObjectType();
    this.setNewPoints();

    // skip the challenge started sequence in the step function
    if ( phet.chipper.queryParameters.showAnswers ) {
      this.isLoadingBarAnimatingProperty.value = false;
      this.isDelayStarted = false;
    }
  }

  /**
   * Resets the start sequence. Because the start sequence proceeds normally if a user chooses to leave a challenge
   * after kicking off the start sequence (by clicking play), we need to reset all aspects of the start sequence
   * (including all parts that happen during the step function).
   */
  public resetStartSequence(): void {
    this.isLoadingBarAnimatingProperty.reset();
    this.resetDelay();
    this.resetShapeVisible();
    this.isPlayButtonVisibleProperty.reset();
    this.isInputEnabledProperty.reset();
  }

  /**
   * Resets the time counter for how much time has passed since the delay started.
   */
  private resetDelay(): void {
    this.timeSinceDelayStarted = 0;
    this.isDelayStarted = false;
  }

  /**
   * Hides the shape and resets the time counter for how long the shape has been visible.
   */
  private resetShapeVisible(): void {
    this.isShapeVisibleProperty.value = false;
    this.timeSinceShapeVisible = 0;
  }

  /**
   * Sets this.pointsProperty with new points for the current challenge number
   */
  private setNewPoints(): void {
    const challengeNumber = this.challengeNumberProperty.value;
    let points;

    if ( this.randomOrPredetermined && ( dotRandom.nextDouble() <= PROBABILITY_OF_PREDETERMINED_SHAPE ) ) {
      points = Subitizer.getPredeterminedShapePoints( challengeNumber );
    }
    else if ( this.randomOrPredetermined ) {
      points = Subitizer.getRandomShapePoints( challengeNumber );
    }
    else {
      points = Subitizer.getArrangedShapePoints( challengeNumber );
    }

    assert && assert( points.length === challengeNumber, 'incorrect number of points for challengeNumber ' +
                                                         `${challengeNumber}: ${points.length}` );

    // two of the same shapes in a row are not allowed
    if ( !_.isEqual( this.pointsProperty.value, points ) ) {
      this.pointsProperty.value = points;
    }
    else {
      this.setNewPoints();
    }
  }

  /**
   * Sets this.objectTypeProperty with a new object type for the current challenge.
   */
  private setRandomCountingObjectType(): void {
    this.objectTypeProperty.value = dotRandom.sample( SUBITIZER_OBJECT_TYPES );
  }

  /**
   * Randomly picks out a predetermined shape with N points and applies a random available rotation, where
   * N = the provided challengeNumber.
   */
  private static getPredeterminedShapePoints( challengeNumber: number ): Vector2[] {

    assert && assert( PREDETERMINED_SHAPES && PREDETERMINED_SHAPES[ challengeNumber ],
      `There exists no predetermined shape for challenge number ${challengeNumber}. ` +
      `Predetermined shapes: ${Object.keys( PREDETERMINED_SHAPES ).toString()}` );

    const shapeIndex = dotRandom.nextInt( PREDETERMINED_SHAPES[ challengeNumber ].length );
    const shape = PREDETERMINED_SHAPES[ challengeNumber ][ shapeIndex ];

    const rotationIndex = dotRandom.nextInt( shape.rotations.length );
    return Subitizer.rotatePoints( shape.points, shape.rotations[ rotationIndex ] );
  }

  /**
   * Randomly generates N points inside the available bounds, where N = the provided challengeNumber.
   */
  private static getRandomShapePoints( challengeNumber: number ): Vector2[] {
    const points = [];

    while ( points.length < challengeNumber ) {
      const randomX = dotRandom.nextDoubleBetween( SHAPE_BOUNDS.minX, SHAPE_BOUNDS.maxX );
      const randomY = dotRandom.nextDoubleBetween( SHAPE_BOUNDS.minY, SHAPE_BOUNDS.maxY );

      // add a new point if it doesn't exist yet and does not overlap with the existing points
      const objectsOverlap = Subitizer.objectsOverlap( points, randomX, randomY );
      if ( !_.find( points, object => ( object.x === randomX ) && ( object.y === randomY ) ) && !objectsOverlap ) {
        points.push( new Vector2( randomX, randomY ) );
      }
    }

    return points;
  }

  /**
   * Randomly generates an arranged shape with N points, where N = the provided challengeNumber. An arranged shape is
   * a block of points, where the remainder of points that dont fit into the block are located on the upper left, upper
   * right, lower left, or lower right of the block.
   */
  private static getArrangedShapePoints( challengeNumber: number ): Vector2[] {
    const numberOfRows = dotRandom.nextIntBetween( MIN_NUMBER_OF_ROWS, MAX_NUMBER_OF_ROWS );
    let minNumberOfColumns = MIN_NUMBER_OF_COLUMNS;

    // get the minimum number of columns needed to fit all the points in the arrangement given the chosen number of rows
    while ( minNumberOfColumns * numberOfRows < challengeNumber ) {
      minNumberOfColumns++;
    }

    // get the maximum number of columns that should be used such that every row will still have a least one point given
    // the chosen number of rows (since we generate the points from left to right, top to bottom).
    let maxNumberOfColumns = minNumberOfColumns;
    while ( challengeNumber > ( maxNumberOfColumns + 1 ) * ( numberOfRows - 1 ) &&
            maxNumberOfColumns < MAX_NUMBER_OF_COLUMNS ) {
      maxNumberOfColumns++;
    }

    const numberOfColumns = dotRandom.nextIntBetween( minNumberOfColumns, maxNumberOfColumns );

    // calculate the center of the first point to draw in the shape (upper left corner of the shape). This assumes that
    // the center of the shape is at (0, 0).
    const getStartCoordinate = ( n: number ) => ( n - 1 ) / -2;
    const startX = getStartCoordinate( numberOfColumns );
    const startY = getStartCoordinate( numberOfRows );

    // create and add all points in calculated "rectangle" (numberOfRows by numberOfColumns), which may end up being
    // more points than are needed, drawing them from left to right, top to bottom
    const points = [];
    for ( let j = 0; j < numberOfRows; j++ ) {
      for ( let i = 0; i < numberOfColumns; i++ ) {
        points.push( new Vector2( startX + i, startY + j ) );
      }
    }

    // both used for the correct number of points, where the remainder was removed from the block
    let reducedPoints;
    const reducedShiftedPoints = points;

    // randomly pick between modifying the top row or bottom row
    if ( dotRandom.nextBoolean() ) {
      const sliceIndex = points.length - challengeNumber;

      // remove extra points from the top row, left side
      reducedPoints = points.slice( sliceIndex );

      // remove extra points from the top row, right side
      reducedShiftedPoints.splice( numberOfColumns - sliceIndex, sliceIndex );
    }
    else {

      // remove extra points from the bottom row, right side
      reducedPoints = points.slice( 0, challengeNumber );

      // remove extra points from the bottom row, left side
      reducedShiftedPoints.splice( points.length - numberOfColumns, points.length - challengeNumber );
    }

    // randomly pick between the two types of reduced points
    return dotRandom.nextBoolean() ? reducedPoints : reducedShiftedPoints;
  }

  /**
   * Rotates each point of the shape around the origin, which is assumed to be (0, 0).
   */
  private static rotatePoints( points: Vector2[], rotationAngle: number ): Vector2[] {
    const rotationMatrix = new Matrix3().setToRotationZ( rotationAngle );

    const rotatedPoints: Vector2[] = [];
    points.forEach( point => rotatedPoints.push( rotationMatrix.timesVector2( point ) ) );

    return rotatedPoints;
  }

  /**
   * Compares the bounds of a point to be added to all other existing points and returns if the point to
   * be added overlaps with any existing point.
   */
  private static objectsOverlap( points: Vector2[], xCoordinate: number, yCoordinate: number ): boolean {
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
        const otherPointObjectBounds = new Bounds2(
          xCoordinate - objectTotalHalfWidth,
          yCoordinate - objectTotalHalfWidth,
          xCoordinate + objectTotalHalfWidth,
          yCoordinate + objectTotalHalfWidth
        );
        overlap = pointObjectBounds.intersectsBounds( otherPointObjectBounds );
        if ( overlap ) {
          break;
        }
      }
    }
    return overlap;
  }

  /**
   * Asserts that every point in every predetermined shape is within the model bounds for every possible rotation of the
   * shape.
   */
  private static assertValidPredeterminedShapes(): void {
    for ( const key in PREDETERMINED_SHAPES ) {
      PREDETERMINED_SHAPES[ key ].forEach( shape => { // iterate over each shape in the shape set for the given number (key)

        // check that the points of each rotation for a shape are within the model bounds
        shape.rotations.forEach( rotationAngle => {
          const rotatedPoints = Subitizer.rotatePoints( shape.points, rotationAngle );
          rotatedPoints.forEach( point => assert && assert( SHAPE_BOUNDS.containsPoint( Subitizer.fixPoint( point ) ),
            `vector point ${point.toString()} from shape ${key} is outside the object bounds when a rotation of ` +
            `${rotationAngle * ( 180 / Math.PI )} degrees is applied: ${SHAPE_BOUNDS.toString()}` ) );
        } );
      } );
    }
  }

  /**
   * Fixes points that have wrong values due to JavaScript decimal math error.
   */
  private static fixPoint( point: Vector2 ): Vector2 {
    return new Vector2( Utils.toFixedNumber( point.x, DECIMALS ), Utils.toFixedNumber( point.y, DECIMALS ) );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

numberPlay.register( 'Subitizer', Subitizer );
export default Subitizer;