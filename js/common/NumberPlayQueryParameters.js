// Copyright 2021, University of Colorado Boulder

import numberPlay from '../numberPlay.js';

/**
 * NumberPlayQueryParameters defines query parameters that are specific to this simulation.
 *
 * @author Luisa Vargas
 */

const NumberPlayQueryParameters = QueryStringMachine.getAll( {

  // always show the correct answer
  // For internal use only, not public facing.
  showCorrectAnswer: { type: 'flag' }

} );

numberPlay.register( 'NumberPlayQueryParameters', NumberPlayQueryParameters );
export default NumberPlayQueryParameters;