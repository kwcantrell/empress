define(["underscore", "util", "TreeController", "ShearSelectLayer"], function (
    _,
    util,
    TreeController,
    ShearSelectLayer,
) {
    /**
     * @class ShearModel
     *
     * The model for Shearer. This model is responsible for maintaining updating
     * empress whenever a user clicks on a shear option in one of the shear
     * layers. This model is also responsible for notifying its observers
     * whenever the shear status of the tree has changed.
     */
    function ShearModel(empress, container) {
        this.empress = empress;
        this.layers = new Map();
        this.shearMap = new Map();
        this.container = container;
        this.observers = [];
    }

    /**
     * Adds a shear layer to the shear panel.
     *
     * @param{String} layer The feature metadata column to create a shear layer
     *                     from.
     */
    ShearModel.prototype.addLayer = function (layer) {
        var fVals = this.empress.getUniqueFeatureMetadataInfo(layer, "tip")
            .sortedUniqueValues;
        var shearSelectLayer = new ShearSelectLayer(
            layer,
            fVals,
            this.container,
            false
        );
        shearSelectLayer.registerObserver(this);
        this.layers.set(layer, shearSelectLayer);
    };

    ShearModel.prototype.shearSelectLayerUpdate = function(layerTitle, values, removeLayer) {
        if (removeLayer) {
            this.removeLayer(layerTitle);
        } else {
            this.shearMap.set(layerTitle, values);
            this.notify();
        }
    }

    /**
     * Returns the feature values the have been unselected (i.e. sheared) from
     * a particular shear layer.
     *
     * @param{String} layer The name of shear layer
     */
    ShearModel.prototype.getShearLayer = function (layer) {
        return this.shearMap.get(layer);
    };

    /**
     * Checks if a shear layer has been created for a particular feature metadata
     * column.
     *
     * @param{String} layer The feature metadata column to check
     */
    ShearModel.prototype.hasLayer = function (layer) {
        return this.layers.has(layer);
    };

    /**
     * Notifies all observers whenever the model has changed.
     */
    ShearModel.prototype.notify = function () {
        this.empress.shear(this.shearMap);
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
    ShearModel.prototype.registerObserver = function (obs) {
        this.observers.push(obs);
    };

    /**
     * Unregisters an observer to the model. The method will remove all
     * observers with a '.shearerObserverName' === to removeObsName.
     *
     * @param{String} removeObsName The name of the observer to unregister.
     */
    ShearModel.prototype.unregisterObserver = function (removeObsName) {
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
     * Removes a shear layer from a ShearModel
     * @param{ShearModel} model The ShearModel to use
     * @param{String} layer The name of layer to remove.
     */
    ShearModel.prototype.removeLayer = function (layer) {
        this.layers.delete(layer);
        this.shearMap.delete(layer);
        this.notify();
    };

    /**
     * @class ShearController
     *
     * The controller for a ShearModel.
     */
    function ShearController(empress, container) {
        this.model = new ShearModel(empress, container);
    }

    /**
     * Adds a layer to the model.
     * @param{String} layer A feature metadata column name
     */
    ShearController.prototype.addLayer = function (layer) {
        if (!this.model.hasLayer(layer)) {
            this.model.addLayer(layer);
        }
    };

    /**
     * Registers an observer to the model.
     *
     * @param{Object} obs The object to register to the model. A
     *                    '.shearerObserverName' property must be provided if
     *                    this observer will at some point be unregistered.
     */
    ShearController.prototype.registerObserver = function (obs) {
        this.model.registerObserver(obs);
    };

    /**
     * Unregisters an observer to the model. The method will remove all
     * observers with a '.shearerObserverName' === to removeObsName.
     *
     * @param{String} removeObsName The name of the observer to unregister.
     */
    ShearController.prototype.unregisterObserver = function (removeObsName) {
        this.model.unregisterObserver(removeObsName);
    };

    /**
     * @class Shearer
     *
     * This is the exposed only exposed class of this closure and the one that
     * the rest of the empress code base will interact with.
     */

    function Shearer(empress, fCols) {
        this.fCols = fCols;
        this.shearSelect = document.getElementById("shear-feature-select");
        this.addLayerButton = document.getElementById("shear-add-btn");
        this.shearLayerContainer = document.getElementById(
            "shear-layer-container"
        );
        this.controller = new ShearController(
            empress,
            this.shearLayerContainer
        );

        // this holds the 'Shear by...' select menu and the
        // 'Add shear filter' button
        this.shearOptionsContainer = document.getElementById(
            "shear-add-options"
        );

        var scope = this;
        _.each(this.fCols, function (col) {
            var opt = document.createElement("option");
            opt.innerText = col;
            opt.value = col;
            scope.shearSelect.appendChild(opt);
        });

        this.addLayerButton.onclick = function () {
            scope.controller.addLayer(scope.shearSelect.value);
            scope.shearSelect[scope.shearSelect.selectedIndex].remove();
            // hide the 'Shear by...' menu and 'Add shear filter' button
            // if the 'Shear by...' menu is empty
            if (scope.shearSelect.options.length < 1) {
                scope.shearOptionsContainer.classList.add("hidden");
            }
        };
    }

    /**
     * Add metadata values back into the shear select container.
     */
    Shearer.prototype.shearUpdate = function () {
        console.log("???")
        // clear select
        this.shearSelect.innerHTML = "";

        // add feature metadata values that do not have a layer
        var scope = this;
        _.each(this.fCols, function (col) {
            if (!scope.controller.model.layers.has(col)) {
                var opt = document.createElement("option");
                opt.innerText = col;
                opt.value = col;
                scope.shearSelect.appendChild(opt);
            }
        });
        // show the 'Shear by...' menu and 'Add shear filter' button
        // if the 'Shear by...' menu is not empty
        if (this.shearSelect.options.length >= 1) {
            this.shearOptionsContainer.classList.remove("hidden");
        }
    };

    /**
     * Registers an observer to the model.
     *
     * @param{Object} obs The object to register to the model. A
     *                    '.shearerObserverName' property must be provided if
     *                    this observer will at some point be unregistered.
     */
    Shearer.prototype.registerObserver = function (obs) {
        this.controller.registerObserver(obs);
    };

    /**
     * Unregisters an observer to the model. The method will remove all
     * observers with a '.shearerObserverName' === to removeObsName.
     *
     * @param{String} removeObsName The name of the observer to unregister.
     */
    Shearer.prototype.unregisterObserver = function (removeObsName) {
        this.controller.unregisterObserver(removeObsName);
    };

    return Shearer;
});
