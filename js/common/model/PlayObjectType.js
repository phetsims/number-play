// Copyright 2019-2020, University of Colorado Boulder

/**
 * Play object types for Number Play.
 *
 * @author Chris Klusendorf
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberPlay from '../../numberPlay.js';

// @public
const PlayObjectType = Enumeration.byKeys( [ 'DOG', 'APPLE', 'TURTLE', 'BALL' ] );

numberPlay.register( 'PlayObjectType', PlayObjectType );
export default PlayObjectType;