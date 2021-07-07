define(["underscore", "FieldSelectLayer"], function(_, FieldSelectLayer) {
	function ShearSelectLayer(
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
	ShearSelectLayer.prototype = Object.create(FieldSelectLayer.prototype);
	ShearSelectLayer.prototype.constructor = ShearSelectLayer;

	// implement notify
	ShearSelectLayer.prototype.notify = function() {
		var scope = this;
		_.each(this.observers, function(obs) {
			obs.selectLayerUpdate(scope.fCol, scope.unselectedValues, scope.removeLayer);
		});
	}

	return ShearSelectLayer;
});