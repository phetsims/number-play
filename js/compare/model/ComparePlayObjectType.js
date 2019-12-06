// Copyright 2019, University of Colorado Boulder

/**
 * Play object types specific to the `Compare` screen.
 *
 * @author Chris Klusendorf
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const PlayObjectType = require( 'NUMBER_PLAY/common/model/PlayObjectType' );

  // @public
  const ComparePlayObjectType = Enumeration.byKeys( [ PlayObjectType.DOG.name, PlayObjectType.APPLE.name, 'PAPER_ONE' ] );

  return numberPlay.register( 'ComparePlayObjectType', ComparePlayObjectType );
} );