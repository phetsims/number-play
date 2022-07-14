// Copyright 2021-2022, University of Colorado Boulder

/**
 * Counting representation types for the 'Compare' screen.
 *
 * @author Chris Klusendorf
 */

import numberPlay from '../../numberPlay.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';

class CompareCountingType extends EnumerationValue {
  public static BLOCKS = new CompareCountingType();
  public static NUMBER_LINE = new CompareCountingType();
  public static NONE = new CompareCountingType();

  public static enumeration = new Enumeration( CompareCountingType );
}

numberPlay.register( 'CompareCountingType', CompareCountingType );
export default CompareCountingType;