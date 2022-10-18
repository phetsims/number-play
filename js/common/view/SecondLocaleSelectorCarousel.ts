// Copyright 2022, University of Colorado Boulder

/**
 * A carousel that contains buttons that can be selected to set the second locale of this sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import numberPlay from '../../numberPlay.js';
import Carousel from '../../../../sun/js/Carousel.js';
import localeProperty from '../../../../joist/js/i18n/localeProperty.js';
import { GridBox } from '../../../../scenery/js/imports.js';
import numberPlayPreferences from '../model/numberPlayPreferences.js';
import LanguageSelectionNode from '../../../../joist/js/preferences/LanguageSelectionNode.js';

class SecondLocaleSelectorCarousel extends Carousel {

  public constructor() {

    const createInteractiveLocales = () => {
      return localeProperty.validValues!.map( locale => {
        return new LanguageSelectionNode( numberPlayPreferences.secondLocaleProperty, locale );
      } );
    };

    // A prototype where we show all languages in grid managed by a Carousel so that there aren't too many items
    // displayed at one time
    const chunkedLocaleItems = _.chunk( createInteractiveLocales(), 10 );
    const carouselItems = chunkedLocaleItems.map( localeItem => {
      return new GridBox( {
        xMargin: 5,
        yMargin: 3,
        xAlign: 'center',
        autoRows: 10,
        children: [ ...localeItem ],
        resize: false
      } );
    } );

    super( carouselItems, {
      itemsPerPage: 1,
      spacing: 0,
      margin: 0,
      orientation: 'vertical'
    } );
  }
}

numberPlay.register( 'SecondLocaleSelectorCarousel', SecondLocaleSelectorCarousel );
export default SecondLocaleSelectorCarousel;