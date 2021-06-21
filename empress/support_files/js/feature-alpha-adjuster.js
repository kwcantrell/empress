define(["AlphaSelectLayer"], function(AlphaSelectLayer) {
	function FeatureAlphaAdjuster(empress, fCols) {
		this.fCols = fCols;
        this.alphaSelect = document.getElementById("alpha-feature-select");
        this.addLayerButton = document.getElementById("alpha-add-btn");
        this.container = document.getElementById(
            "alpha-layer-container"
        );

        // model properties
        this.empress = empress;
        this.layers = new Map();
        this.alphaMap = new Map();
        this.observers = [];

        // this holds the 'alpha by...' select menu and the
        // 'Add alpha filter' button
        this.alphaOptionsContainer = document.getElementById(
            "alpha-add-options"
        );

        var scope = this;
        _.each(this.fCols, function (col) {
            var opt = document.createElement("option");
            opt.innerText = col;
            opt.value = col;
            scope.alphaSelect.appendChild(opt);
        });

        this.addLayerButton.onclick = function () {
            scope.addLayer(scope.alphaSelect.value);
            scope.alphaSelect[scope.alphaSelect.selectedIndex].remove();
            // hide the 'alpha by...' menu and 'Add alpha filter' button
            // if the 'Shear by...' menu is empty
            if (scope.alphaSelect.options.length < 1) {
                scope.shearOptionsContainer.classList.add("hidden");
            }
        };
	}

	FeatureAlphaAdjuster.prototype.addLayer = function(layerTitle) {
		if (!this.layers.has(layerTitle)) {
			var fVals = this.empress.getUniqueFeatureMetadataInfo(layerTitle, "tip")
	            .sortedUniqueValues;
	        var alphaSelectLayer = new AlphaSelectLayer(
	            layerTitle,
	            fVals,
	            this.container,
	            false
	        );
	        alphaSelectLayer.registerObserver(this);
	        this.layers.set(layerTitle, alphaSelectLayer);
		}
	};

	FeatureAlphaAdjuster.prototype.alphaSelectLayerUpdate = function(layerTitle, values, removeLayer) {
        if (removeLayer) {
            this.removeLayer(layerTitle);
        } else {
            this.alphaMap.set(layerTitle, values);
            this.notify();
        }
    };

    /**
     * Removes a shear layer from a FeatureAlphaAdjuster
     * @param{FeatureAlphaAdjuster} model The FeatureAlphaAdjuster to use
     * @param{String} layer The name of layer to remove.
     */
    FeatureAlphaAdjuster.prototype.removeLayer = function (layerTitle) {
        this.layers.delete(layerTitle);
        this.alphaMap.delete(layerTitle);
        this.notify();
    };

    FeatureAlphaAdjuster.prototype.notify = function() {
    	console.log(this.alphaMap)
    }
	return FeatureAlphaAdjuster;
});