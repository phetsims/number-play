// Copyright 2019-2022, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Animation from '../../../../twixt/js/Animation.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { ManualConstraint, Node, PressListenerEvent, Rectangle } from '../../../../scenery/js/imports.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import CountingPlayAreaNode from '../../common/view/CountingPlayAreaNode.js';
import numberPlay from '../../numberPlay.js';
import TenFrame from '../model/TenFrame.js';
import DraggableTenFrameNode from './DraggableTenFrameNode.js';
import NumberCardCreatorCarousel from './NumberCardCreatorCarousel.js';
import LabModel from '../model/LabModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import SymbolCardCreatorPanel from './SymbolCardCreatorPanel.js';
import TenFrameCreatorPanel from './TenFrameCreatorPanel.js';
import Easing from '../../../../twixt/js/Easing.js';
import CountingObject from '../../../../counting-common/js/common/model/CountingObject.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import TProperty from '../../../../axon/js/TProperty.js';
import { SymbolType } from './SymbolCardNode.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberSuiteCommonPreferences from '../../common/model/NumberSuiteCommonPreferences.js';

class LabScreenView<T extends NumberSuiteCommonPreferences> extends ScreenView {
  private readonly model: LabModel;

  // node for all pieces to share
  public readonly pieceLayer: Node;
  public readonly numberCardCreatorCarousel: NumberCardCreatorCarousel;
  private readonly tenFrameNodes: DraggableTenFrameNode[];
  public readonly symbolCardCreatorPanel: SymbolCardCreatorPanel;
  private readonly tenFrameCreatorPanel: TenFrameCreatorPanel;
  private readonly onesPlayAreaNode: CountingPlayAreaNode;
  private readonly dogPlayAreaNode: CountingPlayAreaNode;
  private readonly applePlayAreaNode: CountingPlayAreaNode;
  private readonly butterflyPlayAreaNode: CountingPlayAreaNode;
  private readonly ballPlayAreaNode: CountingPlayAreaNode;
  private readonly countingObjectTypeToPlayAreaNode: Map<CountingObjectType, CountingPlayAreaNode>;
  private readonly playAreaNodes: CountingPlayAreaNode[];
  public readonly objectPlayAreaBoundsProperty: TReadOnlyProperty<Bounds2>;
  public readonly numberCardBoundsProperty: TReadOnlyProperty<Bounds2>;
  public readonly symbolCardBoundsProperty: TReadOnlyProperty<Bounds2>;
  public readonly bottomReturnZoneProperty: TProperty<Bounds2>;

  public constructor( model: LabModel, symbolTypes: SymbolType[], preferences: T, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    this.model = model;
    this.pieceLayer = new Node();
    const backgroundDragTargetNode = new Rectangle( this.layoutBounds ); // see CountingPlayAreaNode for doc

    // TODO: make file constants?
    const tenFrameCreatorPanelLeft = 143;
    const creatorNodeSpacing = 18;

    this.numberCardCreatorCarousel = new NumberCardCreatorCarousel( this );
    this.numberCardCreatorCarousel.centerX = this.layoutBounds.centerX;
    this.addChild( this.numberCardCreatorCarousel );

    // create the symbolCardCreatorPanel, position later after we create the boundsProperty
    this.symbolCardCreatorPanel = new SymbolCardCreatorPanel( model, this, symbolTypes );

    this.tenFrameCreatorPanel = new TenFrameCreatorPanel( model, this );
    this.tenFrameCreatorPanel.left = tenFrameCreatorPanelLeft;
    this.addChild( this.tenFrameCreatorPanel );

    this.numberCardBoundsProperty = new DerivedProperty( [ this.visibleBoundsProperty ], visibleBounds => {
      return visibleBounds.withMaxY( visibleBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y -
                                     this.tenFrameCreatorPanel.height )
        .withMaxX( visibleBounds.maxX - this.symbolCardCreatorPanel.width - CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN );
    } );
    this.symbolCardBoundsProperty = new DerivedProperty( [ this.visibleBoundsProperty ], visibleBounds => {
      return visibleBounds.withMinY( visibleBounds.minY + NumberPlayConstants.SCREEN_VIEW_PADDING_Y +
                                     this.numberCardCreatorCarousel.height ).withMaxY(
        visibleBounds.maxY - CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN - this.tenFrameCreatorPanel.height );
    } );
    this.objectPlayAreaBoundsProperty = new DerivedProperty( [ this.visibleBoundsProperty ], visibleBounds => {
      return visibleBounds.withMinY( visibleBounds.minY + NumberPlayConstants.SCREEN_VIEW_PADDING_Y +
                                     this.numberCardCreatorCarousel.height )
        .withMaxX( visibleBounds.maxX - this.symbolCardCreatorPanel.width - CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN );
    } );

    // return zone where any pieces from the bottom row will return to their home if they intersect when dropped
    this.bottomReturnZoneProperty = new Property( new Bounds2( 0, 0, 0, 0 ) );

    // create and add the left ObjectsPlayAreaNode
    this.dogPlayAreaNode = new CountingPlayAreaNode(
      model.dogPlayArea,
      new EnumerationProperty( CountingObjectType.DOG ),
      this.objectPlayAreaBoundsProperty, {
        countingObjectLayerNode: this.pieceLayer,
        backgroundDragTargetNode: backgroundDragTargetNode,
        returnZoneProperty: this.bottomReturnZoneProperty
      }
    );
    this.addChild( this.dogPlayAreaNode );

    // create and add the right ObjectsPlayAreaNode
    this.applePlayAreaNode = new CountingPlayAreaNode(
      model.applePlayArea,
      new EnumerationProperty( CountingObjectType.APPLE ),
      this.objectPlayAreaBoundsProperty, {
        countingObjectLayerNode: this.pieceLayer,
        backgroundDragTargetNode: backgroundDragTargetNode,
        returnZoneProperty: this.bottomReturnZoneProperty
      }
    );
    this.addChild( this.applePlayAreaNode );

    // create and add the right ObjectsPlayAreaNode
    this.butterflyPlayAreaNode = new CountingPlayAreaNode(
      model.butterflyPlayArea,
      new EnumerationProperty( CountingObjectType.BUTTERFLY ),
      this.objectPlayAreaBoundsProperty, {
        countingObjectLayerNode: this.pieceLayer,
        backgroundDragTargetNode: backgroundDragTargetNode,
        returnZoneProperty: this.bottomReturnZoneProperty
      }
    );
    this.addChild( this.butterflyPlayAreaNode );

    // create and add the right ObjectsPlayAreaNode
    this.ballPlayAreaNode = new CountingPlayAreaNode(
      model.ballPlayArea,
      new EnumerationProperty( CountingObjectType.BALL ),
      this.objectPlayAreaBoundsProperty, {
        countingObjectLayerNode: this.pieceLayer,
        backgroundDragTargetNode: backgroundDragTargetNode,
        returnZoneProperty: this.bottomReturnZoneProperty
      }
    );
    this.addChild( this.ballPlayAreaNode );

    // create and add the CountingPlayAreaNode
    this.onesPlayAreaNode = new CountingPlayAreaNode(
      model.onesPlayArea,
      new EnumerationProperty( CountingObjectType.PAPER_NUMBER ),
      this.objectPlayAreaBoundsProperty, {
        countingObjectLayerNode: this.pieceLayer,
        backgroundDragTargetNode: backgroundDragTargetNode,
        returnZoneProperty: this.bottomReturnZoneProperty
      }
    );
    this.addChild( this.onesPlayAreaNode );

    const hideOnesPlayAreaNodeAdjustment = this.onesPlayAreaNode.countingObjectCreatorPanel.width / 2;

    preferences.showLabOnesProperty.link( showLabOnes => {
      if ( showLabOnes ) {
        this.tenFrameCreatorPanel.left = tenFrameCreatorPanelLeft;
      }
      else {
        this.model.onesPlayArea.reset();
        this.tenFrameCreatorPanel.left = tenFrameCreatorPanelLeft + hideOnesPlayAreaNodeAdjustment;
      }
      this.onesPlayAreaNode.visible = showLabOnes;
    } );

    ManualConstraint.create( this, [ this.tenFrameCreatorPanel, this.dogPlayAreaNode.countingObjectCreatorPanel,
        this.applePlayAreaNode.countingObjectCreatorPanel, this.butterflyPlayAreaNode.countingObjectCreatorPanel,
        this.ballPlayAreaNode.countingObjectCreatorPanel, this.onesPlayAreaNode.countingObjectCreatorPanel ],
      ( tenFrameCreatorNodeProxy, dogCreatorNodeProxy, appleCreatorNodeProxy, butterflyCreatorNodeProxy,
        ballsCreatorNodeProxy, onesCreatorNodeProxy ) => {
        dogCreatorNodeProxy.left = tenFrameCreatorNodeProxy.right + creatorNodeSpacing;
        appleCreatorNodeProxy.left = dogCreatorNodeProxy.right + creatorNodeSpacing;
        butterflyCreatorNodeProxy.left = appleCreatorNodeProxy.right + creatorNodeSpacing;
        ballsCreatorNodeProxy.left = butterflyCreatorNodeProxy.right + creatorNodeSpacing;
        onesCreatorNodeProxy.left = ballsCreatorNodeProxy.right + creatorNodeSpacing;
      } );

    this.countingObjectTypeToPlayAreaNode = new Map();
    this.countingObjectTypeToPlayAreaNode.set( CountingObjectType.DOG, this.dogPlayAreaNode );
    this.countingObjectTypeToPlayAreaNode.set( CountingObjectType.APPLE, this.applePlayAreaNode );
    this.countingObjectTypeToPlayAreaNode.set( CountingObjectType.BUTTERFLY, this.butterflyPlayAreaNode );
    this.countingObjectTypeToPlayAreaNode.set( CountingObjectType.BALL, this.ballPlayAreaNode );
    this.countingObjectTypeToPlayAreaNode.set( CountingObjectType.PAPER_NUMBER, this.onesPlayAreaNode );

    this.playAreaNodes = [
      this.dogPlayAreaNode,
      this.applePlayAreaNode,
      this.butterflyPlayAreaNode,
      this.ballPlayAreaNode,
      this.onesPlayAreaNode
    ];

    // position and add the symbolCardCreatorPanel later so we have access to its bounds Property
    this.symbolCardCreatorPanel.centerY = this.symbolCardBoundsProperty.value.centerY;
    this.addChild( this.symbolCardCreatorPanel );

    this.tenFrameNodes = [];

    model.tenFrames.addItemAddedListener( this.addTenFrame.bind( this ) );
    model.tenFrames.addItemRemovedListener( this.removeTenFrame.bind( this ) );

    // add the piece layer
    this.addChild( this.pieceLayer );

    phet.joist.display.addInputListener( {
      down: ( event: PressListenerEvent ) => {
        const screen = phet.joist.sim.selectedScreenProperty.value;
        if ( screen && screen.view === this ) {

          let tenFrameNodeFound = false;
          event.trail.nodes.forEach( node => {
            if ( node instanceof DraggableTenFrameNode ) {
              tenFrameNodeFound = true;
            }
          } );

          if ( !tenFrameNodeFound ) {
            model.selectedTenFrameProperty.value = null;
          }
        }
      }
    } );

    // create and add the ResetAllButton
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.numberCardCreatorCarousel.reset();
        this.symbolCardCreatorPanel.reset();
      },
      right: this.layoutBounds.maxX - NumberPlayConstants.SCREEN_VIEW_PADDING_X,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // update the y-position of panels when the visible bounds change so everything floats to the top or bottom
    Multilink.multilink( [ this.visibleBoundsProperty, preferences.showLabOnesProperty ],
      ( visibleBounds, showLabOnes ) => {
        this.numberCardCreatorCarousel.top = visibleBounds.top + NumberPlayConstants.SCREEN_VIEW_PADDING_Y;

        this.symbolCardCreatorPanel.right = visibleBounds.right - CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;
        resetAllButton.right = visibleBounds.right - CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;
        const bottomY = visibleBounds.bottom - CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;
        this.tenFrameCreatorPanel.bottom = bottomY;
        resetAllButton.bottom = bottomY;

        const returnZoneRightBoundary = showLabOnes ? this.onesPlayAreaNode.right : this.ballPlayAreaNode.right;

        this.bottomReturnZoneProperty.value = new Bounds2( this.tenFrameCreatorPanel.left, this.tenFrameCreatorPanel.top,
          returnZoneRightBoundary, bottomY );
      } );

    this.objectPlayAreaBoundsProperty.link( objectPlayAreaBounds => {
      model.tenFrames.forEach( tenFrame => {
        tenFrame.setConstrainedDestination( objectPlayAreaBounds, tenFrame.positionProperty.value );
      } );
      this.symbolCardCreatorPanel.getAllSymbolNodes().forEach( symbolCardNode => {
        symbolCardNode.setConstrainedDestination( objectPlayAreaBounds, symbolCardNode.positionProperty.value );
      } );
    } );
  }

  /**
   * Returns the counting object type of the CountingObjectNode for the given CountingObject
   */
  private getCountingObjectType( countingObject: CountingObject ): CountingObjectType {
    let countingObjectType = CountingObjectType.DOG;
    let countingObjectTypeFound = false;

    for ( let i = 0; i < this.playAreaNodes.length; i++ ) {
      const playAreaNode = this.playAreaNodes[ i ];

      if ( playAreaNode.playArea.countingObjects.includes( countingObject ) ) {
        const countingObjectNode = playAreaNode.getCountingObjectNode( countingObject );
        countingObjectType = countingObjectNode.countingObjectTypeProperty.value;
        countingObjectTypeFound = true;
        break;
      }
    }

    assert && assert( countingObjectTypeFound, 'countingObjectType not found!' );
    return countingObjectType;
  }

  /**
   * Called when a new Ten Frame is added to the model.
   */
  private addTenFrame( tenFrame: TenFrame ): void {
    const tenFrameNode = new DraggableTenFrameNode( tenFrame, this.model.selectedTenFrameProperty,
      this.objectPlayAreaBoundsProperty, {
        dropListener: () => {

          const tenFrameNode = this.getTenFrameNode( tenFrame );
          if ( tenFrameNode.bounds.intersectsBounds( this.bottomReturnZoneProperty.value ) ) {
            tenFrameNode.inputEnabled = false;
            tenFrame.countingObjects.clear();

            // calculate icon's origin
            let trail = this.getUniqueLeafTrailTo( this.tenFrameCreatorPanel.iconNode );
            trail = trail.slice( 1, trail.length );
            const globalOrigin = trail.localToGlobalPoint( this.tenFrameCreatorPanel.iconNode.localBounds.leftTop );

            const removeAnimation = new Animation( {
              duration: 0.3,
              targets: [ {
                property: tenFrame.positionProperty,
                easing: Easing.CUBIC_IN_OUT,
                to: globalOrigin
              }, {
                property: tenFrame.scaleProperty,
                easing: Easing.CUBIC_IN_OUT,
                to: TenFrameCreatorPanel.ICON_SCALE
              } ]
            } );

            removeAnimation.finishEmitter.addListener( () => {
              this.model.tenFrames.includes( tenFrame ) && this.model.tenFrames.remove( tenFrame );
            } );
            removeAnimation.start();
          }
        }, removeCountingObjectListener: countingObject => {
          const playAreaNode = this.getCorrespondingPlayAreaNode( countingObject );
          playAreaNode.playArea.sendCountingObjectToCreatorNode( countingObject );
        }, getCountingObjectNode: countingObject => {
          const playAreaNode = this.getCorrespondingPlayAreaNode( countingObject );
          return playAreaNode.getCountingObjectNode( countingObject );
        }
      } );

    this.tenFrameNodes.push( tenFrameNode );
    this.pieceLayer.addChild( tenFrameNode );
  }

  /**
   * Called when a TenFrame is removed from the model.
   */
  private removeTenFrame( tenFrame: TenFrame ): void {
    const tenFrameNode = this.getTenFrameNode( tenFrame );

    _.pull( this.tenFrameNodes, tenFrameNode );
    this.pieceLayer.removeChild( tenFrameNode );
    tenFrameNode.dispose();
  }

  /**
   * Returns the corresponding DraggableTenFrameNode for a given TenFrame.
   */
  public getTenFrameNode( tenFrame: TenFrame ): DraggableTenFrameNode {
    const tenFrameNode = _.find( this.tenFrameNodes, tenFrameNode => tenFrameNode.tenFrame === tenFrame );
    assert && assert( tenFrameNode, 'matching tenFrameNode not found!' );
    return tenFrameNode!;
  }

  /**
   * Each type of counting object has its own play area, so when working with a counting object, we need to look up
   * its corresponding play area in order to do an operation on it (like sending the counting object back to its origin).
   */
  private getCorrespondingPlayAreaNode( countingObject: CountingObject ): CountingPlayAreaNode {
    const countingObjectType = this.getCountingObjectType( countingObject );
    const playAreaNode = this.countingObjectTypeToPlayAreaNode.get( countingObjectType );
    assert && assert( playAreaNode, 'playAreaNode not found for counting object type: ' + countingObjectType.name );
    return playAreaNode!;
  }
}

numberPlay.register( 'LabScreenView', LabScreenView );
export default LabScreenView;
