// Copyright 2021-2022, University of Colorado Boulder

/**
 * Counting representation types for the 'Compare' screen.
 *
 * @author Chris Klusendorf
 */

import numberPlay from '../../numberPlay.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import RichEnumeration from '../../../../phet-core/js/RichEnumeration.js';

class CompareCountingType extends EnumerationValue {
  static BLOCKS = new CompareCountingType();
  static NUMBER_LINE = new CompareCountingType();
  static NONE = new CompareCountingType();

  static enumeration = new RichEnumeration<CompareCountingType>( CompareCountingType );

  private constructor() { super(); }
}

numberPlay.register( 'CompareCountingType', CompareCountingType );
export default CompareCountingType;