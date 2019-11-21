// Copyright 2019, University of Colorado Boulder

/**
 * Model class for the 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const FractionsCommonConstants = require( 'FRACTIONS_COMMON/common/FractionsCommonConstants' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPiece = require( 'FRACTIONS_COMMON/building/model/NumberPiece' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const NumberStack = require( 'FRACTIONS_COMMON/building/model/NumberStack' );
  const ObjectsPlayArea = require( 'NUMBER_PLAY/common/model/ObjectsPlayArea' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const OnesPlayArea = require( 'NUMBER_PLAY/common/model/OnesPlayArea' );
  const PlayObjectType = require( 'NUMBER_PLAY/common/model/PlayObjectType' );
  const Range = require( 'DOT/Range' );
  const Vector2 = require( 'DOT/Vector2' );

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

      // @public {ObservableArray.<NumberPiece>} - Number pieces in the play area (controlled or animating)
      this.activeNumberPieces = new ObservableArray();

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
     * @param {boolean} animateReturn
     */
    numberPieceDropped( numberPiece, threshold, animateReturn ) {
      const numberPiecePosition = numberPiece.positionProperty.value;
      const sortedNumberStacks = _.sortBy( this.numberStacks, numberStack => {
        return numberStack.positionProperty.value.distance( numberPiecePosition );
      } );
      const closestNumberStack = sortedNumberStacks.shift();

      if ( numberPiecePosition.distance( closestNumberStack.positionProperty.value ) < NUMBER_PIECE_RETURN_THRESHOLD ) {
        animateReturn ? this.returnActiveNumberPiece( numberPiece ) : this.activeNumberPieces.remove( numberPiece );
      }
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

  return numberPlay.register( 'LabModel', LabModel );
} );