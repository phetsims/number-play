// Copyright 2022, University of Colorado Boulder

/**
 * A CardNode with a number on it.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import CardNode, { CardNodeOptions } from './CardNode.js';

type SelfOptions = {
  number: number;
};
export type NumberCardNodeOptions = SelfOptions & StrictOmit<CardNodeOptions, 'height' | 'width'>;

class NumberCardNode extends CardNode {

  public constructor( providedOptions: NumberCardNodeOptions ) {
    const options = optionize<NumberCardNodeOptions, SelfOptions, CardNodeOptions>()( {
      height: 70,
      width: providedOptions.number < 10 ? CardNode.WIDTH : 70
    }, providedOptions );

    const number = new Text( providedOptions.number, {
      font: new PhetFont( 50 )
    } );

    super( number, options );
  }
}

numberPlay.register( 'NumberCardNode', NumberCardNode );
export default NumberCardNode;