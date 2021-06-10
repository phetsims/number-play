// Copyright 2019-2021, University of Colorado Boulder

/**
 * Model class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';
import Range from '../../../../dot/js/Range.js';
import numberPlay from '../../numberPlay.js';
import OnesPlayArea from './OnesPlayArea.js';

class NumberPlayModel {

  /**
   * @param {number} highestCount - the highest integer number that can be counted to
   * @param {Vector2} paperNumberOrigin - see OnesPlayArea for doc
   * @param {number} objectMaxScale - see PlayObject for doc
   * @param {Vector2} organizedObjectPadding - see ObjectsPlayArea for doc
   * @param {Tandem} tandem
   */
  constructor( highestCount, paperNumberOrigin, objectMaxScale, organizedObjectPadding, tandem ) {

    // @public {NumberProperty} - the current "counted to" number, which is the central aspect of this whole sim
    this.currentNumberProperty = new NumberProperty( 0, {
      range: new Range( 0, highestCount )
    } );

    // @public {BooleanProperty} - true when the sim is being reset. this is used so that playAreas don't return things
    // to their buckets the normal way (with animations), but instead with a different reset case (no animations).
    this.isResettingProperty = new BooleanProperty( false );

    // @public {EnumerationProperty.<GroupingLinkingType>} - whether the ones and objects play areas ar linked
    this.groupingLinkingTypeProperty = new EnumerationProperty( GroupingLinkingType, GroupingLinkingType.NO_GROUPING );

    // @public (read-only) - the model for managing the play area in the OnesAccordionBox
    this.onesPlayArea = new OnesPlayArea( this.currentNumberProperty, paperNumberOrigin, this.isResettingProperty );

    // @public (read-only) - the model for managing the play area in the ObjectsAccordionBox
    this.objectsPlayArea = new OnesPlayArea( this.currentNumberProperty, paperNumberOrigin, this.isResettingProperty );
  }

  /**
   * Steps the model.
   * @param {number} dt
   * @public
   */
  step( dt ) {
    this.onesPlayArea.step( dt );
    this.objectsPlayArea.step( dt );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.isResettingProperty.value = true;
    this.linkPlayAreasProperty.reset();
    this.onesPlayArea.reset();
    this.objectsPlayArea.reset();
    this.currentNumberProperty.reset();
    this.isResettingProperty.reset();
  }
}

numberPlay.register( 'NumberPlayModel', NumberPlayModel );
export default NumberPlayModel;