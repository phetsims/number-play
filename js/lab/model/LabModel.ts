// Copyright 2019-2022, University of Colorado Boulder

/**
 * Model class for the 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import NumberPiece from '../../../../fractions-common/js/building/model/NumberPiece.js';
import NumberStack from '../../../../fractions-common/js/building/model/NumberStack.js';
import FractionsCommonConstants from '../../../../fractions-common/js/common/FractionsCommonConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import OnesPlayArea from '../../common/model/OnesPlayArea.js';
import numberPlay from '../../numberPlay.js';
import TenFrame from './TenFrame.js';

// constants
const NUMBER_PIECE_RETURN_THRESHOLD = 92;
const HIGHEST_COUNT = 100;

class LabModel {
  public readonly numberStacks: NumberStack[];
  public readonly activeNumberPieces: ObservableArray<NumberPiece>;
  public readonly activeTenFrames: ObservableArray<TenFrame>;
  private readonly isResettingProperty: BooleanProperty;
  private readonly onesPlayArea: OnesPlayArea;
  private readonly leftObjectsPlayArea: OnesPlayArea;
  private readonly rightObjectsPlayArea: OnesPlayArea;

  constructor( tandem: Tandem ) {

    this.numberStacks = [];

    // number pieces in the play area
    this.activeNumberPieces = createObservableArray();

    // @public {ObservableArrayDef.<TenFrame>} - ten frames in the play area
    this.activeTenFrames = createObservableArray();

    // Number stacks
    _.range( 1, 21 ).forEach( number => {
      const stack = new NumberStack( number, 2, false );
      stack.numberPieces.push( new NumberPiece( number ) );
      stack.numberPieces.push( new NumberPiece( number ) );
      this.numberStacks.push( stack );
    } );

    // true when the sim is being reset. this is used so that playAreas don't return things to their buckets the normal
    // way (with animations), but instead with a different reset case (no animations).
    this.isResettingProperty = new BooleanProperty( false );

    // create three different kinds of play areas
    this.onesPlayArea = new OnesPlayArea( new NumberProperty( 0, { range: new Range( 0, HIGHEST_COUNT ) } ), {
      isResettingProperty: this.isResettingProperty
    } );
    this.leftObjectsPlayArea = new OnesPlayArea( new NumberProperty( 0, { range: new Range( 0, HIGHEST_COUNT ) } ), {
      isResettingProperty: this.isResettingProperty
    } );
    this.rightObjectsPlayArea = new OnesPlayArea( new NumberProperty( 0, { range: new Range( 0, HIGHEST_COUNT ) } ), {
      isResettingProperty: this.isResettingProperty
    } );
  }

  /**
   * Called when the user drags a number piece from a stack.
   */
  public dragNumberPieceFromStack( numberPiece: NumberPiece ) {
    this.activeNumberPieces.push( numberPiece );
  }

  /**
   * Returns a corresponding NumberStack that should be used as the "home" of a given NumberPiece (if it's returned from
   * the play area with an animation, etc.)
   */
  public findMatchingNumberStack( numberPiece: NumberPiece ): NumberStack | null {
    return _.find( this.numberStacks, stack => stack.number === numberPiece.number ) || null;
  }

  /**
   * Animates a piece back to its "home" stack.
   */
  public returnActiveNumberPiece( numberPiece: NumberPiece ): void {
    const numberStack = this.findMatchingNumberStack( numberPiece );
    if ( numberStack ) {
      const offset = NumberStack.getOffset( numberStack.numberPieces.length );
      numberPiece.animator.animateTo( {
        position: numberStack.positionProperty.value.plus( offset.timesScalar( FractionsCommonConstants.NUMBER_BUILD_SCALE ) ),
        scale: 1,
        animationInvalidationProperty: numberStack.positionProperty,
        endAnimationCallback: () => {
          this.activeNumberPieces.remove( numberPiece );
          if ( numberStack.isMutable ) {
            numberStack.numberPieces.push( numberPiece );
          }
        }
      } );
    }
  }

  /**
   * Called when a NumberPiece is dropped by the user.
   *
   * @param numberPiece
   * @param threshold - How much distance to allow between the piece and a container/group for it to be
   *                             dropped inside.
   */
  public numberPieceDropped( numberPiece: NumberPiece, threshold: number ): void {
    const numberPiecePosition = numberPiece.positionProperty.value;
    const sortedNumberStacks = _.sortBy( this.numberStacks, numberStack => {
      return numberStack.positionProperty.value.distance( numberPiecePosition );
    } );
    const closestNumberStack = sortedNumberStacks.shift();

    if ( closestNumberStack &&
         numberPiecePosition.distance( closestNumberStack.positionProperty.value ) < NUMBER_PIECE_RETURN_THRESHOLD ) {
      this.returnActiveNumberPiece( numberPiece );
    }
  }

  /**
   * Called when the user drags a ten frame from a stack.
   */
  public dragTenFrameFromIcon( tenFrame: TenFrame ): void {
    this.activeTenFrames.push( tenFrame );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.onesPlayArea.reset();
    this.leftObjectsPlayArea.reset();
    this.rightObjectsPlayArea.reset();
    this.activeNumberPieces.clear();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.onesPlayArea.step( dt );
    this.leftObjectsPlayArea.step( dt );
    this.rightObjectsPlayArea.step( dt );
    this.activeNumberPieces.forEach( numberPiece => numberPiece.step( dt ) );
  }
}

numberPlay.register( 'LabModel', LabModel );
export default LabModel;