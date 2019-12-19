// Copyright 2019, University of Colorado Boulder

/**
 * The top carousel with number pieces for the Lab screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const Carousel = require( 'SUN/Carousel' );
  const Node = require( 'SCENERY/nodes/Node' );
  const StackNodesBox = require( 'FRACTIONS_COMMON/building/view/StackNodesBox' );

  class LabNumberCarousel extends Carousel {
    /**
     * @param {Array.<NumberStack>} numberStacks
     * @param {number} animationDuration
     * @param {function} pressCallback - function( {SceneryEvent}, {Stack} ) - Called when a press is started.
     */
    constructor( numberStacks, animationDuration, pressCallback ) {
      const box = new StackNodesBox( [
        ...numberStacks
      ], pressCallback );

      super( box.children.map( stack => {
        return new Node().addChild( stack );
      } ), {
        itemsPerPage: 10,
        margin: 14,
        spacing: 8,
        animationDuration: animationDuration
      } );

      // @private {StackNodesBox}
      this.box = box;
    }

    /**
     * Sets the model positions of our model objects corresponding to their displayed (view) positions.
     * @public
     *
     * @param {ModelViewTransform2} modelViewTransform
     */
    updateModelLocations( modelViewTransform ) {
      this.box.updateModelLocations( modelViewTransform, this );
    }
  }

  return numberPlay.register( 'LabNumberCarousel', LabNumberCarousel );
} );
