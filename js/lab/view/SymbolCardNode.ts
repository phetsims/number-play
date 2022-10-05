// Copyright 2022, University of Colorado Boulder

/**
 * A CardNode with an inequality symbol on it.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import CardNode, { CardNodeOptions } from './CardNode.js';

// TODO: This should be in its own file, not exported as a type here.
export type SymbolType = '<' | '=' | '>' | '+' | '-';
type SelfOptions = {
  symbolType: SymbolType;
};
export type SymbolCardNodeOptions = SelfOptions & StrictOmit<CardNodeOptions, 'height' | 'width'>;

class SymbolCardNode extends CardNode {

  public constructor( providedOptions: SymbolCardNodeOptions ) {
    const options = optionize<SymbolCardNodeOptions, SelfOptions, CardNodeOptions>()( {
      height: CardNode.WIDTH,
      width: CardNode.WIDTH
    }, providedOptions );

    const inequalitySymbol = new Text( providedOptions.symbolType, {
      font: new PhetFont( 46 )
    } );

    super( inequalitySymbol, options );
  }
}

numberPlay.register( 'SymbolCardNode', SymbolCardNode );
export default SymbolCardNode;