// Copyright 2019-2022, University of Colorado Boulder

/**
 * Play object types specific to the `Compare` screen.
 *
 * @author Chris Klusendorf
 */

import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberPlay from '../../numberPlay.js';

class ComparePlayObjectType extends EnumerationValue {
  static DOG = new ComparePlayObjectType();
  static APPLE = new ComparePlayObjectType();
  static PAPER_NUMBER = new ComparePlayObjectType();

  static enumeration = new Enumeration( ComparePlayObjectType );
}

numberPlay.register( 'ComparePlayObjectType', ComparePlayObjectType );
export default ComparePlayObjectType;