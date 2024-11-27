// Copyright 2021-2024, University of Colorado Boulder

/**
 * SubitizeObjectType identifies the countingObject type in the 'Subitize' game in Number Play.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberPlay from '../../numberPlay.js';

class SubitizeObjectType extends CountingObjectType {
  public static readonly CIRCLE = new SubitizeObjectType();

  public static override readonly enumeration = new Enumeration( SubitizeObjectType, {
    instanceType: CountingObjectType
  } );
}

numberPlay.register( 'SubitizeObjectType', SubitizeObjectType );
export default SubitizeObjectType;