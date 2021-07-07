define(["underscore", "util", "TreeController", "ShearSelectLayer", "MetadataSelectPanel"], function (
    _,
    util,
    TreeController,
    ShearSelectLayer,
    MetadataSelectPanel
) {
    /**
     * @class Shearer
     *
     * This is the exposed only exposed class of this closure and the one that
     * the rest of the empress code base will interact with.
     */
    function Shearer(empress, fCols) {
        this.metadataSelectPanel = new MetadataSelectPanel(
            empress,
            this.shearLayerContainer,
            fCols,
            ShearSelectLayer
        );
        this.metadataSelectPanel.initialize();
    }

    /**
     * Registers an observer to the model.
     *
     * @param{Object} obs The object to register to the model. A
     *                    '.shearerObserverName' property must be provided if
     *                    this observer will at some point be unregistered.
     */
    Shearer.prototype.registerObserver = function (obs) {
        this.metadataSelectPanel.registerObserver(obs);
    };

    /**
     * Unregisters an observer to the model. The method will remove all
     * observers with a '.shearerObserverName' === to removeObsName.
     *
     * @param{String} removeObsName The name of the observer to unregister.
     */
    Shearer.prototype.unregisterObserver = function (removeObsName) {
        this.metadataSelectPanel.unregisterObserver(removeObsName);
    };

    return Shearer;
});
