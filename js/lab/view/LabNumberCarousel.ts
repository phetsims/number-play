// Copyright 2019-2021, University of Colorado Boulder

/**
 * The top carousel with number pieces for the Lab screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import StackNodesBox from '../../../../fractions-common/js/building/view/StackNodesBox.js';
import { Node } from '../../../../scenery/js/imports.js';
import Carousel from '../../../../sun/js/Carousel.js';
import numberPlay from '../../numberPlay.js';

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
  updateModelPositions( modelViewTransform ) {
    this.box.updateModelPositions( modelViewTransform, this );
  }
}

numberPlay.register( 'LabNumberCarousel', LabNumberCarousel );
export default LabNumberCarousel;
