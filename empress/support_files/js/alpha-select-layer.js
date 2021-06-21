define(["underscore", "FieldSelectLayer"], function(_, FieldSelectLayer) {
	function AlphaSelectLayer(
		fCol,
        fVals,
        container,
        setAsFirstChild=true
    ) {
		// call constructor
		FieldSelectLayer.call(
			this,
			fCol,
	        fVals,
	        container,
	        setAsFirstChild=true
        );
	}

	// get functions
	AlphaSelectLayer.prototype = Object.create(FieldSelectLayer.prototype);
	AlphaSelectLayer.prototype.constructor = AlphaSelectLayer;

	// implement notify
	AlphaSelectLayer.prototype.notify = function() {
		var scope = this;
		_.each(this.observers, function(obs) {
			obs.alphaSelectLayerUpdate(scope.fCol, scope.selectedValues, scope.removeLayer);
		});
	};

	return AlphaSelectLayer;
});