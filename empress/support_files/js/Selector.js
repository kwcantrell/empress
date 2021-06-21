define(["underscore"], function(_) {
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

	function Selector(selectorContainer, empress) {
		if (this.constructor === Selector) {
			throw Error("Selector is an abstract class and cannot be instantiated.");
		}
		this.selectorContainer = selectorContainer;
		this.empress = empress;
		
		var uniqueSelectorNum = getUniqueNum();
		// create optios
		var optionsP = this.selectorContainer.appendChild(
			document.createElement("p")
		);
		var optionsSelectLabel = optionsP.appendChild(
			document.createElement("label")
		);
		var optionsSelectContainer = document.createElement("label");
		optionsSelectContainer.classList.add("select-container");
		optionsP.appendChild(optionsSelectContainer);
		this.optionsSelect = optionsSelectContainer.appendChild(
			document.createElement("select")
		);
		var optionsSelectID = "selector-options-select-" + uniqueSelectorNum;
		this.optionsSelect.id = optionsSelectID;
		optionsSelectLabel.setAttribute("for", optionsSelectID);

		//fill select
		_.each

	}
});