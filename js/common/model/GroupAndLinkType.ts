// Copyright 2022, University of Colorado Boulder

/**
 * The 3 possible states of grouping + linking in a play area
 *
 * @author Chris Klusendorf
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import GroupType from '../../../../counting-common/js/common/model/GroupType.js';
import numberPlay from '../../numberPlay.js';

class GroupAndLinkType extends GroupType {
  static GROUPED_AND_LINKED = new GroupAndLinkType();

  static enumeration = new Enumeration( GroupAndLinkType, {
    instanceType: GroupType
  } );
}

numberPlay.register( 'GroupAndLinkType', GroupAndLinkType );
export default GroupAndLinkType;