// Copyright 2019-2020, University of Colorado Boulder

/**
 * Play object types specific to the `Compare` screen.
 *
 * @author Chris Klusendorf
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import PlayObjectType from '../../../../counting-common/js/common/model/PlayObjectType.js';
import numberPlay from '../../numberPlay.js';

// @public
const ComparePlayObjectType = Enumeration.byKeys( [ PlayObjectType.DOG.name, PlayObjectType.APPLE.name, 'PAPER_ONE' ] );

numberPlay.register( 'ComparePlayObjectType', ComparePlayObjectType );
export default ComparePlayObjectType;