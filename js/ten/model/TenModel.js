// Copyright 2019, University of Colorado Boulder

/**
 * @author Chris Klusendorf
 */
define( require => {
  'use strict';

  // modules
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayModel = require( 'NUMBER_PLAY/common/model/NumberPlayModel' );

  /**
   * @constructor
   */
  class TenModel extends NumberPlayModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      super( tandem );
    }
  }

  return numberPlay.register( 'TenModel', TenModel );
} );