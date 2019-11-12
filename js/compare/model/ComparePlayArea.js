// Copyright 2019, University of Colorado Boulder

/**
 * Model class for a ComparePlayArea, which combines a OnesPlayArea and an ObjectPlayArea.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const ObjectsPlayArea = require( 'NUMBER_PLAY/common/model/ObjectsPlayArea' );
  const OnesPlayArea = require( 'NUMBER_PLAY/common/model/OnesPlayArea' );
  const ComparePlayObjectType = require( 'NUMBER_PLAY/compare/model/ComparePlayObjectType' );

  class ComparePlayArea {

    /**
     * @param {NumberProperty} currentNumberProperty
     * @param {number} objectMaxScale - see PlayObject for doc
     * @param {Vector2} paperNumberOrigin - see OnesPlayArea for doc
     * @param {BooleanProperty} isResetting
     */
    constructor( currentNumberProperty, objectMaxScale, paperNumberOrigin, isResettingProperty ) {

      // @public {EnumerationProperty.<ComparePlayObjectType>} - the current type of playObject being displayed
      this.playObjectTypeProperty = new EnumerationProperty( ComparePlayObjectType, ComparePlayObjectType.DOG );

      // since one value of ComparePlayObjectType is not valid in ObjectsPlayArea, this is a separate Property
      // to prevent that value from passing through to ObjectsPlayArea. see the link below for usage.
      const playObjectTypeProperty = new EnumerationProperty( ComparePlayObjectType, ComparePlayObjectType.DOG );

      // @public (read-only) - the model for managing paper ones in the playArea
      this.onesPlayArea = new OnesPlayArea( currentNumberProperty, paperNumberOrigin, isResettingProperty );

      // @public (read-only) - the model for managing objects in the playArea
      this.objectsPlayArea = new ObjectsPlayArea( currentNumberProperty, objectMaxScale, isResettingProperty, {
        playObjectTypeProperty: playObjectTypeProperty
      } );

      // if the value of the current play object type is a paper one, don't send update the Property that was passed to
      // ObjectsPlayArea, as it does not handle paper ones. instead, see how this same link is used in
      // CompareAccordionBox to hide ObjectsPlayArea and show the OnesPlayArea for this case.
      this.playObjectTypeProperty.link( type => {
        if ( type !== ComparePlayObjectType.PAPER_ONE ) {
          playObjectTypeProperty.value = type;
        }
      } );
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      this.onesPlayArea.step( dt );
    }

    /**
     * @public
     */
    reset() {
      this.onesPlayArea.reset();
      this.objectsPlayArea.reset();
      this.playObjectTypeProperty.reset();
    }
  }

  return numberPlay.register( 'ComparePlayArea', ComparePlayArea );
} );