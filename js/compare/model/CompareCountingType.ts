// Copyright 2021, University of Colorado Boulder

/**
 * Counting representation types for the 'Compare' screen.
 *
 * @author Chris Klusendorf
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberPlay from '../../numberPlay.js';

// @public
const CompareCountingType = Enumeration.byKeys( [ 'BLOCKS', 'NUMBER_LINE', 'NONE' ] );

numberPlay.register( 'CompareCountingType', CompareCountingType );
export default CompareCountingType;