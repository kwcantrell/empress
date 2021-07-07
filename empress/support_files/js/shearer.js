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
    function Shearer(empress, fCols, container) {
        MetadataSelectPanel.call(
            this,
            empress,
            null,
            fCols,
            ShearSelectLayer
        );
        this.container = container;
        

        // add description/warning messages to container

    }

    // inherit MetadataSelectPanel functions
    Shearer.prototype = Object.create(MetadataSelectPanel.prototype);
    Shearer.prototype.constructor = Shearer;

    return Shearer;
});
