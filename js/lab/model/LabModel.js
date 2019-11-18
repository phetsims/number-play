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
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ObjectsPlayArea = require( 'NUMBER_PLAY/common/model/ObjectsPlayArea' );
  const OnesPlayArea = require( 'NUMBER_PLAY/common/model/OnesPlayArea' );
  const PlayObjectType = require( 'NUMBER_PLAY/common/model/PlayObjectType' );
  const Range = require( 'DOT/Range' );
  const Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  class LabModel  {

    /**
     * @param {number} highestCount - the highest integer number that can be counted to
     * @param {Vector2} paperNumberOrigin - see OnesPlayArea for doc
     * @param {number} objectMaxScale - see PlayObject for doc
     * @param {Tandem} tandem
     */
    constructor( highestCount, paperNumberOrigin, objectMaxScale, tandem ) {

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
          playObjectTypeProperty: new EnumerationProperty( PlayObjectType, PlayObjectType.CIRCLE ),
          bucketPosition: new Vector2( bucketOffsetX, 0 )
        }
      );
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {
      this.onesPlayArea.reset();
      this.leftObjectsPlayArea.reset();
      this.rightObjectsPlayArea.reset();
    }

    /**
     * Steps the model.
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      this.onesPlayArea.step( dt );
    }
  }

  return numberPlay.register( 'LabModel', LabModel );
} );