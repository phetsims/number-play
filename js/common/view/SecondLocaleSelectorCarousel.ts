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
import LanguageSelectionNode from '../../../../joist/js/preferences/LanguageSelectionNode.js';
import NumberSuiteCommonPreferences from '../model/NumberSuiteCommonPreferences.js';

class SecondLocaleSelectorCarousel<T extends NumberSuiteCommonPreferences> extends Carousel {

  public constructor( preferences: T ) {

    const createInteractiveLocales = () => {
      return localeProperty.validValues!.map( locale => {
        return new LanguageSelectionNode( preferences.secondLocaleProperty, locale );
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

    preferences.showSecondLocaleProperty.link( showSecondLocale => {
      this.visible = showSecondLocale;
    } );
  }
}

numberPlay.register( 'SecondLocaleSelectorCarousel', SecondLocaleSelectorCarousel );
export default SecondLocaleSelectorCarousel;