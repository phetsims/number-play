// Copyright 2019-2022, University of Colorado Boulder

/**
 * The top carousel with number pieces for the Lab screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberStack from '../../../../fractions-common/js/building/model/NumberStack.js';
import StackNodesBox from '../../../../fractions-common/js/building/view/StackNodesBox.js';
import { Node, PressListenerEvent } from '../../../../scenery/js/imports.js';
import Carousel from '../../../../sun/js/Carousel.js';
import numberPlay from '../../numberPlay.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

class LabNumberCarousel extends Carousel {
  private readonly box: StackNodesBox;

  constructor( numberStacks: NumberStack[], animationDuration: number,
               pressCallback: ( event: PressListenerEvent, stack: NumberStack ) => void ) {

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

    this.box = box;
  }

  /**
   * Sets the model positions of our model objects corresponding to their displayed (view) positions.
   */
  public updateModelPositions( modelViewTransform: ModelViewTransform2 ): void {
    this.box.updateModelPositions( modelViewTransform, this );
  }
}

numberPlay.register( 'LabNumberCarousel', LabNumberCarousel );
export default LabNumberCarousel;
