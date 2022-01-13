// Copyright 2021-2022, University of Colorado Boulder

/**
 * SubitizeObjectType identifies the play object type in the 'Subitize' game in Number Play.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import RichEnumeration from '../../../../phet-core/js/RichEnumeration.js';
import numberPlay from '../../numberPlay.js';
import PlayObjectType from '../../../../counting-common/js/common/model/PlayObjectType.js';

class SubitizeObjectType extends PlayObjectType {
  static CIRCLE = new SubitizeObjectType();

  static enumeration = new RichEnumeration( SubitizeObjectType, {
    instanceType: PlayObjectType
  } );
}

numberPlay.register( 'SubitizeObjectType', SubitizeObjectType );
export default SubitizeObjectType;
