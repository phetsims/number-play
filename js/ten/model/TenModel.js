// Copyright 2019, University of Colorado Boulder

/**
 * Model for the 'Ten' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const NumberPlayModel = require( 'NUMBER_PLAY/common/model/NumberPlayModel' );

  class TenModel extends NumberPlayModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      super( NumberPlayConstants.TEN, tandem );
    }
  }

  return numberPlay.register( 'TenModel', TenModel );
} );