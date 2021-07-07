define(["underscore", "util", "TreeController", "ShearSelectLayer"], function (
    _,
    util,
    TreeController,
    ShearSelectLayer,
) {
    /**
     * @class MetadataSelectPanel
     *
     * A metadata select panel. This class will add a 'select' menu and an 'add
     * layer' button to 'container'. Whenever the add button is clicked on, a
     * new 'select layer' panel will be added to the container.
     */
    function MetadataSelectPanel(empress, container, metadataColumns, SelectLayer) {
        this.empress = empress;
        this.layers = new Map();
        this.selectMap = new Map();
        this.metadataSelect = document.getElementById("shear-feature-select");
        this.addLayerButton = document.getElementById("shear-add-btn");
        this.container = document.getElementById(
            "shear-layer-container"
        );
        this.observers = [];
        this.metadataColumns = metadataColumns;
        this.SelectLayer = SelectLayer;
        console.log(this.SelectLayer)

        // this holds the 'Shear by...' select menu and the
        // 'Add shear filter' button
        this.selectOptionsContainer = document.getElementById(
            "shear-add-options"
        );
    }

    MetadataSelectPanel.prototype.initialize = function() {
        var scope = this;
        _.each(this.metadataColumns, function (col) {
            var opt = document.createElement("option");
            opt.innerText = col;
            opt.value = col;
            scope.metadataSelect.appendChild(opt);
        });

        this.addLayerButton.onclick = function () {
            scope.addLayer(scope.metadataSelect.value);
            scope.metadataSelect[scope.metadataSelect.selectedIndex].remove();
            // hide the 'select' menu and 'add layer' button if the 'select'
            // menu is empty
            if (scope.metadataSelect.options.length < 1) {
                scope.selectOptionsContainer.classList.add("hidden");
            }
        };
    }

    /**
     * creates a new 'SelectLayer' and adds it to 'this.container'.
     *
     * @param{String} layer The metadata column to create a new 'SelectLayer'
     *                      out of.
     */
    MetadataSelectPanel.prototype.addLayer = function (layer) {
        if (this.hasLayer(layer)) {
            return;
        }
        var fVals = this.empress.getUniqueFeatureMetadataInfo(layer, "tip")
            .sortedUniqueValues;
        var selectLayer = new this.SelectLayer(
            layer,
            fVals,
            this.container,
            false
        );
        selectLayer.registerObserver(this);
        this.layers.set(layer, selectLayer);
    };

    MetadataSelectPanel.prototype._updateSelect = function() {
        // clear select
        this.metadataSelect.innerHTML = "";

        // add feature metadata values that do not have a layer
        var scope = this;
        _.each(this.metadataColumns, function (layer) {
            if (!scope.hasLayer(layer)) {
                var opt = document.createElement("option");
                opt.innerText = layer;
                opt.value = layer;
                scope.metadataSelect.appendChild(opt);
            }
        });
        // show the 'Shear by...' menu and 'Add shear filter' button
        // if the 'Shear by...' menu is not empty
        if (this.metadataSelect.options.length >= 1) {
            this.selectOptionsContainer.classList.remove("hidden");
        }
    };

    MetadataSelectPanel.prototype.selectLayerUpdate = function(layerTitle, values, removeLayer) {
        if (removeLayer) {
            this.removeLayer(layerTitle);
            this._updateSelect();
        } else {
            this.selectMap.set(layerTitle, values);
            this.notify();
        }
    }

    /**
     * Returns the feature values the have been unselected (i.e. sheared) from
     * a particular shear layer.
     *
     * @param{String} layer The name of shear layer
     */
    MetadataSelectPanel.prototype.getShearLayer = function (layer) {
        return this.selectMap.get(layer);
    };

    /**
     * Checks if a shear layer has been created for a particular feature metadata
     * column.
     *
     * @param{String} layer The feature metadata column to check
     */
    MetadataSelectPanel.prototype.hasLayer = function (layer) {
        return this.layers.has(layer);
    };

    /**
     * Notifies all observers whenever the model has changed.
     */
    MetadataSelectPanel.prototype.notify = function () {
        this.empress.shear(this.selectMap);
        this.empress.drawTree();
        _.each(this.observers, function (obs) {
            obs.shearUpdate();
        });
    };

    /**
     * Registers an observer to the model which will then be notified whenever
     * the model is updated. Note this object must implement a shearUpdate()
     * method.
     *
     * @param{Object} obs The object to register. A '.shearerObserverName'
     *                    property must be provided if this observer will at
     *                    some point be unregistered.
     */
    MetadataSelectPanel.prototype.registerObserver = function (obs) {
        this.observers.push(obs);
    };

    /**
     * Unregisters an observer to the model. The method will remove all
     * observers with a '.shearerObserverName' === to removeObsName.
     *
     * @param{String} removeObsName The name of the observer to unregister.
     */
    MetadataSelectPanel.prototype.unregisterObserver = function (removeObsName) {
        var removeIndx;
        var tempObs = [];
        _.each(this.observers, function (obs, indx) {
            if (
                !obs.hasOwnProperty("shearerObserverName") ||
                obs.shearerObserverName !== removeObsName
            ) {
                tempObs.push(obs);
            }
        });
        this.observers = tempObs;
    };

    /**
     * Removes a shear layer from a MetadataSelectPanel
     * @param{MetadataSelectPanel} model The MetadataSelectPanel to use
     * @param{String} layer The name of layer to remove.
     */
    MetadataSelectPanel.prototype.removeLayer = function (layer) {
        this.layers.delete(layer);
        this.selectMap.delete(layer);
        this.notify();
    };

    return MetadataSelectPanel;
});
