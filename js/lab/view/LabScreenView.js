// Copyright 2019, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const ObjectsPlayAreaNode = require( 'NUMBER_PLAY/common/view/ObjectsPlayAreaNode' );
  const OnesPlayAreaNode = require( 'NUMBER_PLAY/common/view/OnesPlayAreaNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Vector2 = require( 'DOT/Vector2' );

  class LabScreenView extends ScreenView {

    /**
     * @param {LabModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super( {
        tandem: tandem
      } );

      const playAreaViewBounds = new Bounds2(
        this.layoutBounds.left,
        this.layoutBounds.top + NumberPlayConstants.SCREEN_VIEW_Y_PADDING,
        this.layoutBounds.right,
        this.layoutBounds.bottom - NumberPlayConstants.SCREEN_VIEW_Y_PADDING
      );
      const translateMVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
        Vector2.ZERO,
        playAreaViewBounds.centerBottom,
        1
      );

      // create and add the OnesPlayAreaNode
      const onesPlayAreaNode = new OnesPlayAreaNode( model.onesPlayArea, playAreaViewBounds, translateMVT );
      this.addChild( onesPlayAreaNode );

      // create and add the left ObjectsPlayAreaNode
      const playAreaModelBounds = translateMVT.viewToModelBounds( playAreaViewBounds ).dilatedX( -20 ).dilatedY( -19 );
      const leftObjectsPlayAreaNode = new ObjectsPlayAreaNode(
        model.leftObjectsPlayArea,
        playAreaModelBounds,
        translateMVT
      );
      this.addChild( leftObjectsPlayAreaNode );

      // create and add the right ObjectsPlayAreaNode
      const rightObjectsPlayAreaNode = new ObjectsPlayAreaNode(
        model.rightObjectsPlayArea,
        playAreaModelBounds,
        translateMVT
      );
      this.addChild( rightObjectsPlayAreaNode );

      // create and add the ResetAllButton
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput(); // cancel interactions that may be in progress
          model.reset();
          this.reset();
        },
        right: this.layoutBounds.maxX - NumberPlayConstants.SCREEN_VIEW_X_PADDING,
        bottom: this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_Y_PADDING,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }
  }

  return numberPlay.register( 'LabScreenView', LabScreenView );
} );