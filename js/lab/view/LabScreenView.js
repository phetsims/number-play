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
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const LabNumberCarousel = require( 'NUMBER_PLAY/lab/view/LabNumberCarousel' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const NumberPiece = require( 'FRACTIONS_COMMON/building/model/NumberPiece' );
  const NumberPieceNode = require( 'FRACTIONS_COMMON/building/view/NumberPieceNode' );
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

      // @private
      this.model = model;

      const playAreaViewBounds = new Bounds2(
        this.layoutBounds.left,
        this.layoutBounds.top + NumberPlayConstants.SCREEN_VIEW_Y_PADDING,
        this.layoutBounds.right,
        this.layoutBounds.bottom - NumberPlayConstants.SCREEN_VIEW_Y_PADDING
      );
      this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
        Vector2.ZERO,
        playAreaViewBounds.centerBottom,
        1
      );

      // @private {Array.<NumberPieceNode>}
      this.numberPieceNodes = [];

      const animationDuration = 0.4; // in seconds

      // @private {Node}
      this.numberPanel = new LabNumberCarousel( model.numberStacks, animationDuration, ( event, stack ) => {
        const modelPoint = this.modelViewTransform.viewToModelPosition( this.globalToLocalPoint( event.pointer.point ) );
        const numberPiece = new NumberPiece( stack.number );
        numberPiece.positionProperty.value = modelPoint;
        model.dragNumberPieceFromStack( numberPiece );
        const numberPieceNode = this.getNumberPieceNode( numberPiece );
        numberPieceNode.dragListener.press( event, numberPieceNode );
      } );
      this.numberPanel.centerX = this.layoutBounds.centerX;
      this.numberPanel.top = playAreaViewBounds.top;

      this.numberPanel.pageNumberProperty.link( pageNumber => {

        // TODO: The following code needs to run when the Carousel is actually at the page that this Property says it's
        // at, but this is not an acceptable solution.
        setTimeout( () => {
          this.numberPanel.updateModelLocations( this.modelViewTransform );
        }, animationDuration * 1000 );
      } );

      model.activeNumberPieces.addItemAddedListener( this.addNumberPiece.bind( this ) );
      model.activeNumberPieces.addItemRemovedListener( this.removeNumberPiece.bind( this ) );

      // create and add the OnesPlayAreaNode
      const onesPlayAreaNode = new OnesPlayAreaNode( model.onesPlayArea, playAreaViewBounds, this.modelViewTransform );
      this.addChild( onesPlayAreaNode );

      // the one's play area covers other nodes, so add the numberPanel after
      this.addChild( this.numberPanel );

      // create and add the left ObjectsPlayAreaNode
      const playAreaModelBounds = this.modelViewTransform.viewToModelBounds( playAreaViewBounds ).dilatedX( -20 ).dilatedY( -19 );
      const leftObjectsPlayAreaNode = new ObjectsPlayAreaNode(
        model.leftObjectsPlayArea,
        playAreaModelBounds,
        this.modelViewTransform
      );
      this.addChild( leftObjectsPlayAreaNode );

      // create and add the right ObjectsPlayAreaNode
      const rightObjectsPlayAreaNode = new ObjectsPlayAreaNode(
        model.rightObjectsPlayArea,
        playAreaModelBounds,
        this.modelViewTransform
      );
      this.addChild( rightObjectsPlayAreaNode );

      // TODO: all pieces in this ScreenView need to use this layer, not just the number pieces
      this.pieceLayer = new Node();
      this.addChild( this.pieceLayer );

      // create and add the ResetAllButton
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput(); // cancel interactions that may be in progress
          model.reset();
        },
        right: this.layoutBounds.maxX - NumberPlayConstants.SCREEN_VIEW_X_PADDING,
        bottom: this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_Y_PADDING,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }

    /**
     * Returns the corresponding NumberPieceNode for a given NumberPiece.
     * @public
     *
     * @param {NumberPiece} numberPiece
     * @returns {NumberPieceNode}
     */
    getNumberPieceNode( numberPiece ) {
      return _.find( this.numberPieceNodes, numberPieceNode => numberPieceNode.numberPiece === numberPiece );
    }

    /**
     * Called when a new NumberPiece is added to the model (we'll create the view).
     * @private
     *
     * @param {NumberPiece} numberPiece
     */
    addNumberPiece( numberPiece ) {
      const numberPieceNode = new NumberPieceNode( numberPiece, {
        positioned: true,
        modelViewTransform: this.modelViewTransform,
        dropListener: wasTouch => {
          this.model.numberPieceDropped(
            numberPiece,
            wasTouch ? 50 : 20,
            ( numberPiece.number < 11 && this.numberPanel.pageNumberProperty.value === 0 ) ||
            ( numberPiece.number > 10 && this.numberPanel.pageNumberProperty.value === 1 )
          );
        }
      } );

      numberPieceNode.cursor = 'pointer';
      numberPieceNode.inputListeners = [ DragListener.createForwardingListener( event => {
        numberPieceNode.dragListener.press( event, numberPieceNode );
      } ) ];

      this.numberPieceNodes.push( numberPieceNode );
      this.pieceLayer.addChild( numberPieceNode );
    }

    /**
     * Called when a NumberPiece is removed from the model (we'll remove the view).
     * @private
     *
     * @param {NumberPiece} numberPiece
     */
    removeNumberPiece( numberPiece ) {
      const numberPieceNode = _.find( this.numberPieceNodes, numberPieceNode => numberPieceNode.numberPiece === numberPiece );

      _.pull( this.numberPieceNodes, numberPieceNode );
      this.pieceLayer.removeChild( numberPieceNode );
      numberPieceNode.dispose();
    }
  }

  return numberPlay.register( 'LabScreenView', LabScreenView );
} );