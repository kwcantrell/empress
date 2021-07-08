define(["underscore", "ShearSelectLayer", "MetadataSelectPanel"], function (
    _,
    ShearSelectLayer,
    MetadataSelectPanel
) {
    /**
     * @class Shearer
     */
    function Shearer(empress, fCols, container) {
        // call MetadataSelectPanel constructor
        MetadataSelectPanel.call(
            this,
            empress,
            container,
            fCols,
            ShearSelectLayer
        );

        // update abstract labels to reflect Shearer
        this.metadataSelectLabel.innerText = "Shear by...";
        this.metadataSelectAddLabel.innerText = "Add shear filter";

        // note the following p are being added to front of
        // this.metadataSelectContainer to place the before the select menu and
        // add button. There are also being added in reverse order to preserve
        // the original order

        // add performance message
        var p = document.createElement("p");
        p.classList.add("side-panel-notes");
        p.innerHTML = "<span style='font-weight: bold;'>Performance Note: " +
        "</span>If shearing is taking a long time for your dataset, you may " +
        "want to try disabling tree coloring and barplots before shearing."
        this.metadataSelectContainer.prepend(p);

        // add warning message
        var p = document.createElement("p");
        p.classList.add("side-panel-notes");
        p.innerHTML = "<span style='font-weight: bold;'>Warning:</span> " +
                      "By design, shearing will change the topology of the " +
                      "tree: the resulting visualization may be misleading, " +
                      "especially if shown without context."
        this.metadataSelectContainer.prepend(p);


        // add description of shear
        var p = document.createElement("p");
        p.classList.add("side-panel-notes");
        p.innerText = "Shear the tree to tips with certain feature metadata " +
                      "values.";
        this.metadataSelectContainer.prepend(p);
        

    }

    // inherit MetadataSelectPanel functions
    Shearer.prototype = Object.create(MetadataSelectPanel.prototype);
    Shearer.prototype.constructor = Shearer;

    /**
     * Notifies all observers whenever the model has changed.
     * 
     * Implements an abstract function
     */
    Shearer.prototype.notify = function () {
        this.empress._tree.unshear();
        this.empress.shear(this.getMetadataSelectValues());
        this.empress.drawTree();
        _.each(this.observers, function (obs) {
            obs.shearUpdate();
        });
    };

    return Shearer;
});
