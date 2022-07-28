// Copyright 2022, University of Colorado Boulder

/**
 * Base class for a panel that all types of creator nodes use for styling.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import numberPlay from '../../numberPlay.js';

type SelfOptions = EmptySelfOptions;
type NumberPlayCreatorCreatorPanelOptions = SelfOptions & Pick<PanelOptions, 'xMargin'>;

class NumberPlayCreatorCreatorPanel extends Panel {

  public constructor( content: Node, providedOptions?: NumberPlayCreatorCreatorPanelOptions ) {

    const options = optionize<NumberPlayCreatorCreatorPanelOptions, SelfOptions, PanelOptions>()( {
      stroke: 'rgb(201,203,203)',
      xMargin: 8,
      yMargin: 8
    }, providedOptions );

    super( content, options );
  }
}

numberPlay.register( 'NumberPlayCreatorCreatorPanel', NumberPlayCreatorCreatorPanel );
export default NumberPlayCreatorCreatorPanel;
