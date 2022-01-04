// Copyright 2021-2022, University of Colorado Boulder

/**
 * SubitizeObjectType identifies the play object type in the 'Subitize' game in Number Play.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import RichEnumeration from '../../../../phet-core/js/RichEnumeration.js';
import numberPlay from '../../numberPlay.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

class SubitizeObjectType extends EnumerationValue {
  static DOG = new SubitizeObjectType();
  static APPLE = new SubitizeObjectType();
  static TURTLE = new SubitizeObjectType();
  static BALL = new SubitizeObjectType();
  static CIRCLE = new SubitizeObjectType();

  static enumeration = new RichEnumeration<SubitizeObjectType>( SubitizeObjectType );

  private constructor() { super(); }
}

numberPlay.register( 'SubitizeObjectType', SubitizeObjectType );
export default SubitizeObjectType;
