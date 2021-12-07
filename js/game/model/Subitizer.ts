// Copyright 2021, University of Colorado Boulder

/**
 * Subitizer generates the arranged and random points that make up a shape. It is also responsible for the sequence of
 * showing and hiding a shape during a challenge.
 *
 * A shape is a set of points which can be predetermined (hard coded points), random (randomly generated points), or
 * arranged (a grid-like arrangement generated with some randomness).
 *
 * An object is the representation that is rendered at each point of a shape. An object can take many forms, see
 * SubitizeObjectTypeEnum for available types.
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

type PredeterminedShapes = {
  [ key: number ]: {
    points: Vector2[],
    rotations: number[]
  }[],
};

// constants

// angles
const DEGREES_45 = Math.PI * 0.25;
const DEGREES_90 = Math.PI * 0.5;
const DEGREES_135 = Math.PI * 0.75;
const DEGREES_180 = Math.PI;
const DEGREES_270 = Math.PI * ( 3 / 2 );

// convenience function for easier reading
const v2 = ( x: number, y: number ) => new Vector2( x, y );

const PREDETERMINED_SHAPES: PredeterminedShapes = {
  1: [ {
    points: [ v2( 0, 0 ) ], // centered dot
    rotations: []
  } ],
  2: [ {
    points: [ v2( -0.5, 0 ), v2( 0.5, 0 ) ], // vertically-centered row
    rotations: [ DEGREES_45, DEGREES_90, DEGREES_135 ]
  } ],
  3: [ {
    points: [ v2( -1, 0 ), v2( 0, 0 ), v2( 1, 0 ) ], // // vertically-centered row
    rotations: [ DEGREES_90 ]
  }, {
    points: [ v2( -1, -1 ), v2( 0, 0 ), v2( 1, 1 ) ], // diagonal row
    rotations: [ DEGREES_90 ]
  }, {
    points: [ v2( -1, 1 ), v2( 0, -1 ), v2( 1, 1 ) ], // triangle pointing up
    rotations: [ DEGREES_90, DEGREES_180, DEGREES_270 ]
  } ],
  4: [ {
    points: [ v2( -1.5, 0 ), v2( -0.5, 0 ), v2( 0.5, 0 ), v2( 1.5, 0 ) ], // vertically-centered row
    rotations: []
  }, {
    points: [ v2( -0.7, -0.7 ), v2( 0.7, -0.7 ), v2( -0.7, 0.7 ), v2( 0.7, 0.7 ) ], // square
    rotations: [ DEGREES_45 ]
  } ],
  5: [ {
    points: [ v2( -2, 0 ), v2( -1, 0 ), v2( 0, 0 ), v2( 1, 0 ), v2( 2, 0 ) ], // vertically-centered row
    rotations: []
  }, {
    points: [ v2( -1, -1 ), v2( 1, -1 ), v2( 0, 0 ), v2( -1, 1 ), v2( 1, 1 ) ], // 5 in a "die" formation
    rotations: []
  }, {
    points: [ v2( -0.5, -1 ), v2( -0.5, 0 ), v2( -0.5, 1 ), v2( 0.5, -0.5 ), v2( 0.5, 0.5 ) ], // 2 columns, 3:2 "zipper" formation
    rotations: [ DEGREES_90, DEGREES_180, DEGREES_270 ]
  }, {
    points: [ v2( -0.5, -1 ), v2( -0.5, 0 ), v2( -0.5, 1 ), v2( 0.5, -1 ), v2( 0.5, 0 ) ], // 2 columns, 3:2 top-aligned
    rotations: [ DEGREES_90, DEGREES_180, DEGREES_270 ]
  }, {
    points: [ v2( -0.5, -1 ), v2( -0.5, 0 ), v2( -0.5, 1 ), v2( 0.5, 0 ), v2( 0.5, 1 ) ], // 2 columns, 3:2 bottom-aligned
    rotations: [ DEGREES_90, DEGREES_180, DEGREES_270 ]
  } ]
};

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

class Subitizer {

  private readonly challengeNumberProperty: NumberProperty;
  private readonly isChallengeSolvedProperty: BooleanProperty;
  public readonly shapeVisibleProperty: BooleanProperty;
  public readonly pointsProperty: Property<Vector2[]>;
  private readonly randomOrPredetermined: boolean;
  private timeSinceShapeVisible: number;
  public readonly objectSize: number;
  public readonly inputEnabledProperty: BooleanProperty;
  private timeToShowShapeProperty: DerivedProperty<number>;
  public objectTypeProperty: Property<SubitizeObjectTypeEnum>;
  public isDelayStarted: boolean;
  private timeSinceDelayStarted: number;
  public readonly isLoadingBarAnimatingProperty: BooleanProperty;
  public static SUBITIZER_BOUNDS: Bounds2;
  public readonly playButtonVisibleProperty: BooleanProperty;

  constructor( challengeNumberProperty: NumberProperty,
               isChallengeSolvedProperty: BooleanProperty,
               numberOfAnswerButtonPressesProperty: NumberProperty,
               randomOrPredetermined: boolean
  ) {
    this.challengeNumberProperty = challengeNumberProperty;
    this.isChallengeSolvedProperty = isChallengeSolvedProperty;

    // whether the play button is visible
    this.playButtonVisibleProperty = new BooleanProperty( true );

    // whether the loading bar is animating. This can also be used to stop an existing animation.
    this.isLoadingBarAnimatingProperty = new BooleanProperty( false );

    // whether the current shape is visible
    this.shapeVisibleProperty = new BooleanProperty( false );

    // the points of the current shape
    this.pointsProperty = new Property( [ Vector2.ZERO ], {
      valueType: Array,
      arrayElementType: Vector2
    } );

    // whether we can choose to use a random and arranged shape
    this.randomOrPredetermined = randomOrPredetermined;

    // whether the delay has been started. a delay happens at the beginning of a new challenge, before revealing the
    // shape for that challenge.
    this.isDelayStarted = false;

    // the amount of time that the sim clock has run since the delay was started, in seconds
    this.timeSinceDelayStarted = 0;

    // the amount of time that the sim clock has run since the shape was made visible, in seconds
    this.timeSinceShapeVisible = 0;

    // the width and height of every object
    this.objectSize = OBJECT_SIZE;

    // Indicates when input is enabled to answer the current challenge. True when the current challenge is not solved.
    // False when the current challenge is solved. Manipulated only in the view.
    this.inputEnabledProperty = new BooleanProperty( false );

    // the object type of the current shape
    this.objectTypeProperty = new Property<SubitizeObjectTypeEnum>( 'dog' );

    // how long the shape is visible when shown, in seconds. This is a derived Property instead of a constant because
    // the time that the shape is shown is increased if the user gets the answer wrong multiple times.
    this.timeToShowShapeProperty = new DerivedProperty( [ numberOfAnswerButtonPressesProperty ],
      ( numberOfAnswerButtonPresses: number ) => {
        if ( numberOfAnswerButtonPresses > NumberPlayConstants.NUMBER_OF_SUBITIZER_GUESSES_AT_NORMAL_TIME ) {
          return this.timeToShowShapeProperty.value + NumberPlayConstants.SHAPE_VISIBLE_TIME_INCREASE_AMOUNT;
        }
        return NumberPlayQueryParameters.subitizerTimeVisible;
      } );

    Subitizer.assertValidPredeterminedShapes();

    // initialize first set of points
    this.setNewPoints();
  }

  public step( dt: number ): void {
    
    if ( this.isDelayStarted ) {
      this.timeSinceDelayStarted += dt;

      // hide the loading bar after briefly showing it in a filled state
      if ( this.timeSinceDelayStarted > 0.2 && this.isLoadingBarAnimatingProperty.value ) {
        this.isLoadingBarAnimatingProperty.value = false;
      }
      // show the shape and enable answer inputs after a delay
      else if ( this.timeSinceDelayStarted > NumberPlayConstants.SHAPE_DELAY_TIME ) {
        this.inputEnabledProperty.value = true;
        this.shapeVisibleProperty.value = true;
        this.resetDelay();
      }
    }

    // hide the shape after it's been visible for long enough 
    if ( this.shapeVisibleProperty.value && this.inputEnabledProperty.value ) {
      this.timeSinceShapeVisible += dt;
      
      if ( this.timeSinceShapeVisible > this.timeToShowShapeProperty.value ) {
        this.resetShapeVisible();
      }
    }
  }

  public newChallenge(): void {

    // set values for the step function to handle sequence of showing and hiding game parts for a new challenge
    this.isDelayStarted = true;
    this.inputEnabledProperty.value = false;
    this.shapeVisibleProperty.value = false;

    // set play object type and shape
    this.setRandomPlayObjectType();
    this.setNewPoints();

    // skip the challenge started sequence in the step function
    if ( NumberPlayQueryParameters.showCorrectAnswer ) {
      this.isLoadingBarAnimatingProperty.value = false;
      this.isDelayStarted = false;
    }
  }

  /**
   * Reset start sequence if the current challenge is unsolved. Because the start sequence proceeds normally if a user
   * chooses to leave a challenge after kicking off the start sequence (by clicking play), we need to reset all aspects
   * of the start sequence (including all parts that happen during the step function).
   */
  public resetStartSequence(): void {
    if ( !this.isChallengeSolvedProperty.value ) {
      this.isLoadingBarAnimatingProperty.reset();
      this.resetDelay();
      this.resetShapeVisible();
      this.playButtonVisibleProperty.reset();
      this.inputEnabledProperty.reset();
    }
  }

  private resetDelay(): void {
    this.timeSinceDelayStarted = 0;
    this.isDelayStarted = false;
  }

  /**
   * Hides the shape and resets the time counter for how long the shape has been visible.
   */
  private resetShapeVisible(): void {
    this.shapeVisibleProperty.reset();
    this.timeSinceShapeVisible = 0;
  }

  /**
   * Sets this.pointsProperty with new points for the current challenge number
   */
  private setNewPoints(): void {
    const challengeNumber = this.challengeNumberProperty.value;
    let points = [];

    // if randomOrPredetermined, then 60/40 chance whether the shape uses random or predetermined points.
    // if not randomOrPredetermined, then the shape uses arranged points.
    if ( this.randomOrPredetermined ) {
      if ( dotRandom.nextDouble() >= 0.4 ) {

        // pick out a predetermined shape randomly for the corresponding challenge number
        const shapeIndex = dotRandom.nextInt( PREDETERMINED_SHAPES[ challengeNumber ].length );
        const shape = PREDETERMINED_SHAPES[ challengeNumber ][ shapeIndex ];
        points = shape.points;

        // if the shape has rotations available, randomly pick one to rotate by 50% of the time
        if ( shape.rotations.length && dotRandom.nextBoolean() ) {
          const rotationIndex = dotRandom.nextInt( shape.rotations.length );
          points = Subitizer.rotatePoints( points, shape.rotations[ rotationIndex ] );
        }
      }
      else {

        // generate random points
        while ( points.length < challengeNumber ) {
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

      // get a random number of rows and set the number of columns for drawing an arranged shape
      const maxNumberOfRows = 3;
      const minNumberOfRows = 2;
      const numberOfRows = dotRandom.nextIntBetween( minNumberOfRows, maxNumberOfRows );
      let numberOfColumns = 0;

      // get the number of necessary columns to fit all the object representations to arrange
      while ( numberOfColumns * numberOfRows < challengeNumber ) {
        numberOfColumns++;
      }

      // create and add the points
      const startX = ( numberOfColumns - 1 ) / -2;
      const startY = ( numberOfRows - 1 ) / -2;
      for ( let j = 0; j < numberOfRows; j++ ) {
        for ( let i = 0; i < numberOfColumns; i++ ) {
          if ( points.length < challengeNumber ) {
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
   * Rotates each point of the shape around the origin.
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
   * Asserts that every point in every predetermined shape is within the model bounds for every possible rotation of the
   * shape.
   */
  private static assertValidPredeterminedShapes(): void {
    for ( const key in PREDETERMINED_SHAPES ) {
      PREDETERMINED_SHAPES[ key ].forEach( shape => { // iterate over each shape in the shape set for the given number (key)
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