// Copyright 2022, University of Colorado Boulder

/**
 * The 3 possible states of grouping + linking in a play area
 *
 * @author Chris Klusendorf
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberPlay from '../../numberPlay.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

class GroupAndLinkType extends EnumerationValue {
  public static readonly UNGROUPED = new GroupAndLinkType();
  public static readonly GROUPED = new GroupAndLinkType();
  public static readonly GROUPED_AND_LINKED = new GroupAndLinkType();

  public static readonly enumeration = new Enumeration( GroupAndLinkType );
}

numberPlay.register( 'GroupAndLinkType', GroupAndLinkType );
export default GroupAndLinkType;