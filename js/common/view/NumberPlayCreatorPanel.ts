// Copyright 2022, University of Colorado Boulder

/**
 * Base class for a panel that all types of creator nodes use for styling.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Node } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import numberPlay from '../../numberPlay.js';

class NumberPlayCreatorCreatorPanel extends Panel {

  public constructor( content: Node ) {
    super( content, {
      stroke: 'rgb(201,203,203)',
      xMargin: 8,
      yMargin: 8
    } );
  }
}

numberPlay.register( 'NumberPlayCreatorCreatorPanel', NumberPlayCreatorCreatorPanel );
export default NumberPlayCreatorCreatorPanel;
