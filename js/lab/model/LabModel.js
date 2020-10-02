// Copyright 2019-2020, University of Colorado Boulder

/**
 * Model class for the 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberPiece from '../../../../fractions-common/js/building/model/NumberPiece.js';
import NumberStack from '../../../../fractions-common/js/building/model/NumberStack.js';
import FractionsCommonConstants from '../../../../fractions-common/js/common/FractionsCommonConstants.js';
import ObjectsPlayArea from '../../common/model/ObjectsPlayArea.js';
import OnesPlayArea from '../../common/model/OnesPlayArea.js';
import PlayObjectType from '../../common/model/PlayObjectType.js';
import numberPlay from '../../numberPlay.js';

const NUMBER_PIECE_RETURN_THRESHOLD = 92;

/**
 * @constructor
 */
class LabModel {

  /**
   * @param {number} highestCount - the highest integer number that can be counted to
   * @param {Vector2} paperNumberOrigin - see OnesPlayArea for doc
   * @param {number} objectMaxScale - see PlayObject for doc
   * @param {Tandem} tandem
   */
  constructor( highestCount, paperNumberOrigin, objectMaxScale, tandem ) {

    // @public {Array.<NumberStack>}
    this.numberStacks = [];

    // @public {ObservableArray.<NumberPiece>} - Number pieces in the play area
    this.activeNumberPieces = createObservableArray();

    // @public {ObservableArray.<TenFrame>} - ten frames in the play area
    this.activeTenFrames = createObservableArray();

    // Number stacks
    _.range( 1, 21 ).map( number => {
      const stack = new NumberStack( number, 2, false );
      stack.numberPieces.push( new NumberPiece( number ) );
      stack.numberPieces.push( new NumberPiece( number ) );
      this.numberStacks.push( stack );
    } );

    const bucketOffsetX = 140;

    // @public (read-only) - the model for managing paper ones in the playArea
    this.onesPlayArea = new OnesPlayArea(
      new NumberProperty( 0, { range: new Range( 0, highestCount ) } ),
      paperNumberOrigin,
      new BooleanProperty( false ), {
        bucketPosition: new Vector2( -bucketOffsetX, 0 )
      }
    );

    // @public (read-only) - the model for managing dogs in the playArea
    this.leftObjectsPlayArea = new ObjectsPlayArea(
      new NumberProperty( 0, { range: new Range( 0, highestCount ) } ),
      objectMaxScale,
      new BooleanProperty( false )
    );

    // @public (read-only) - the model for managing balls in the playArea
    this.rightObjectsPlayArea = new ObjectsPlayArea(
      new NumberProperty( 0, { range: new Range( 0, highestCount ) } ),
      objectMaxScale,
      new BooleanProperty( false ), {
        playObjectTypeProperty: new EnumerationProperty( PlayObjectType, PlayObjectType.BALL ),
        bucketPosition: new Vector2( bucketOffsetX, 0 )
      }
    );
  }

  /**
   * Called when the user drags a number piece from a stack.
   *
   * @param {NumberPiece} numberPiece
   * @public
   */
  dragNumberPieceFromStack( numberPiece ) {
    this.activeNumberPieces.push( numberPiece );
  }

  /**
   * Returns a corresponding NumberStack that should be used as the "home" of a given NumberPiece (if it's returned from
   * the play area with an animation, etc.)
   * @public
   *
   * @param {NumberPiece} numberPiece
   * @returns {NumberStack|null}
   */
  findMatchingNumberStack( numberPiece ) {
    return _.find( this.numberStacks, stack => stack.number === numberPiece.number ) || null;
  }

  /**
   * Animates a piece back to its "home" stack.
   * @public
   *
   * @param {NumberPiece} numberPiece
   */
  returnActiveNumberPiece( numberPiece ) {
    const numberStack = this.findMatchingNumberStack( numberPiece );
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

  /**
   * Called when a NumberPiece is dropped by the user.
   * @public
   *
   * @param {NumberPiece} numberPiece
   * @param {number} threshold - How much distance to allow between the piece and a container/group for it to be
   *                             dropped inside.
   */
  numberPieceDropped( numberPiece, threshold ) {
    const numberPiecePosition = numberPiece.positionProperty.value;
    const sortedNumberStacks = _.sortBy( this.numberStacks, numberStack => {
      return numberStack.positionProperty.value.distance( numberPiecePosition );
    } );
    const closestNumberStack = sortedNumberStacks.shift();

    if ( numberPiecePosition.distance( closestNumberStack.positionProperty.value ) < NUMBER_PIECE_RETURN_THRESHOLD ) {
      this.returnActiveNumberPiece( numberPiece );
    }
  }

  /**
   * Called when the user drags a ten frame from a stack.
   *
   * @param {TenFrame} tenFrame
   * @public
   */
  dragTenFrameFromIcon( tenFrame ) {
    this.activeTenFrames.push( tenFrame );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.onesPlayArea.reset();
    this.leftObjectsPlayArea.reset();
    this.rightObjectsPlayArea.reset();
    this.activeNumberPieces.reset();
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    this.onesPlayArea.step( dt );
    this.activeNumberPieces.forEach( numberPiece => numberPiece.step( dt ) );
  }
}

numberPlay.register( 'LabModel', LabModel );
export default LabModel;