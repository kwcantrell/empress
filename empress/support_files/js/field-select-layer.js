define([], function() {
	/**
     * Stores the next unique number for the removeLayer button is ShearLayer
     */
    var UniqueRemoveNum = 0;

    /**
     * Returns a unique number to use for the id of the removeLayer button.
     */
    function getUniqueNum() {
        return UniqueRemoveNum++;
    }


	function FieldSelectLayer(
		fCol,
        fVals,
        container,
        setAsFirstChild=true
    ) {
    	// make abstract class
    	if (this.constructor === FieldSelectLayer) {
			throw Error("FieldSelectLayer is an abstract class and cannot be instantiated.");
    	}

        this.fCol = fCol;
        // this.fVals = fVals;
        this.container = container;
        this.layerDiv = null;
        this.inputs = [];
        this.valueList = [];
        this.selectedValues = [];
        this.unselectedValues = [];
        this.observers = [];
        this.removeLayer = false;

        var scope = this;

        // create layer div
        this.layerDiv = document.createElement("div");
        if (setAsFirstChild) {
       		this.container.insertBefore(this.layerDiv, this.container.firstChild);
		} else {
			this.container.appendChild(this.layerDiv);
		}
        // create border line
        this.layerDiv.appendChild(document.createElement("hr"));

        // create checkbox legend title
        var legendTitle = document.createElement("div");
        this.layerDiv.appendChild(legendTitle);
        legendTitle.innerText = this.fCol;
        legendTitle.classList.add("legend-title");

        // // create container for select/unselect all buttons
        var p = document.createElement("p");
        this.layerDiv.appendChild(p);

        // create the select all button
        button = document.createElement("button");
        button.innerText = "Select all";
        button.onclick = function () {
         	scope.selectAll();
        };
        button.setAttribute("style", "margin: 0 auto;");
        p.appendChild(button);

        // create the unselect all button
        button = document.createElement("button");
        button.innerText = "Unselect all";
        button.onclick = function () {
            scope.unselectAll();
        };
        button.setAttribute("style", "margin: 0 auto;");
        p.appendChild(button);

        // create checkbox legend div
        var chkBoxLegendDiv = document.createElement("div");
        this.layerDiv.appendChild(chkBoxLegendDiv);
        chkBoxLegendDiv.classList.add("barplot-layer-legend");
        chkBoxLegendDiv.classList.add("legend");

        // create chcbox div
        var legendChkBoxs = document.createElement("div");
        chkBoxLegendDiv.appendChild(legendChkBoxs);

        // create checkboxes
        var table = document.createElement("table");
        legendChkBoxs.appendChild(table);
        var uniqueNum = 1;
        _.each(fVals, function (val) {
            scope.valueList.push(val);
            var row = document.createElement("tr");
            var id =
                scope.fCol.replaceAll(" ", "-") +
                "-" +
                val.replaceAll(" ", "-") +
                uniqueNum++;

            // add checkbox
            var dataCheck = document.createElement("td");
            var input = document.createElement("input");
            input.id = id;
            input.setAttribute("type", "checkbox");
            input.checked = true;
            input.onchange = function () {
                // chkBxClickFunction(!input.checked, scope.fCol, val);
                scope.addRemoveItem(input.checked, val);
            };

            // the select/unselect functions that the "Select all" and
            // "Unselect all" buttons will call
            input.select = function () {
                input.checked = true;
            };
            input.unselect = function () {
                input.checked = false;
            };

            scope.inputs.push(input);
            dataCheck.appendChild(input);
            row.appendChild(dataCheck);

            // add checkbox label
            var dataLabel = document.createElement("label");
            dataLabel.setAttribute("for", input.id);
            dataLabel.innerText = val;
            var labelTD = document.createElement("td");
            labelTD.appendChild(dataLabel);
            row.appendChild(labelTD);

            // add row to table
            table.appendChild(row);
        });

        // create remove container
        var removeContainer = document.createElement("p");
        this.layerDiv.appendChild(removeContainer);

        // create remove label
        var removeLabel = document.createElement("label");
        removeLabel.innerText = "Remove this layer";
        removeContainer.appendChild(removeLabel);

        // create remove button
        var removeButton = document.createElement("button");
        removeButton.id = "shear-layer-" + getUniqueNum() + "-delete";
        removeButton.innerText = "-";
        removeButton.onclick = function () {
            // removeClickFunction(scope.fCol);
            scope.layerDiv.remove();
            scope.layerDiv = null;
            scope.removeLayer = true;
            scope._resetSelection();
            scope.notify();
        };
        removeContainer.appendChild(removeButton);

        removeLabel.setAttribute("for", removeButton.id);
    }

    // should not be called outside of FieldSelectLayer
    FieldSelectLayer.prototype._resetSelection = function() {
    	this.selectedValues = [];
    	this.unselectedValues = [];
    };

    FieldSelectLayer.prototype.selectAll = function() {
    	this._resetSelection();

    	var scope = this;
    	// select all check boxes
    	_.each(scope.inputs, function (input) {
                input.select();
        });

        // set all values as selected
    	_.each(this.valueList, function(val) {
    		scope.selectedValues.push(val);
    	});
    	this.notify();
    };

    FieldSelectLayer.prototype.unselectAll = function() {
    	this._resetSelection();

    	var scope = this;

    	// unselect all check boxes
    	 _.each(scope.inputs, function (input) {
                input.unselect();
        });

    	// set all values as unselected
    	_.each(this.valueList, function(val) {
    		scope.unselectedValues.push(val);
    	});
    	this.notify();
    };

    FieldSelectLayer.prototype.addRemoveItem = function(selected, val) {
 		var selectedIndx = this.selectedValues.indexOf(val);
 		var unselectedIndx = this.unselectedValues.indexOf(val);

 		// add item to selectValues and remove from unselectedValues
    	if (selected) {
    		if (selectedIndx < 0) {
	    		this.selectedValues.push(val);
	    	}
	    	if (unselectedIndx >= 0) {
	    		this.unselectedValues.splice(unselectedIndx, 1)
	    	}
    	} else if (!selected) {
    		if (selectedIndx >= 0) {
    			this.selectedValues.splice(selectedIndx, 1);
    		}
    		if (unselectedIndx < 0) {
	    		this.unselectedValues.push(val);
	    	}
    	}
    	this.notify();
    }
    FieldSelectLayer.prototype.registerObserver = function(obs) {
    	this.observers.push(obs);
    }

    FieldSelectLayer.prototype.notify = function() {};

	return FieldSelectLayer;
});