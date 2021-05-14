define([], function() {
	function isRegExString(str) {
		return str.beginsWith("/") && str.endsWith("/");
	};

	function MetadataSearcherModel(cols, metadata) {
		this.cols = cols;
		this.metadata = metadata;
		this.searchResult = {};
		this.observers = [];
	};

	MetadataSearcherModel.prototype.searchMetadata = function(searchCol, searchVal) {
		var scope = this;
		var sv = searchVal.split(', ')[0];
		var lw = searchVal.split(', ')[1];
		searchVal = sv;
		this.searchResult = {
			searchCol: searchCol,
			searchVal: searchVal,
			nodeList: [],
			lw: lw
		};
		_.each(scope.cols, function(col, colIndx) {
			if (col === searchCol) {
				console.log(col)
				// TODO: use generic searcher
				_.each(scope.metadata, function(metadata, node) {
					// TODO: how to handle floats? Use delta range?
					if (metadata[colIndx] === searchVal) {
						scope.searchResult.nodeList.push(node);
					}
				})
			}
		});
		console.log("wtf", this.searchResult)
		this.notify();
	}

	MetadataSearcherModel.prototype.registerObserver = function(observer) {
		this.observers.push(observer)
	}

	MetadataSearcherModel.prototype.notify = function() {
		var scope = this;
		console.log("observers", this.observers)
		_.each(scope.observers, function(observer) {
			console.log(observer)
			observer.metadataSearcherNotify(scope.searchResult);
		})
	}

	function MetadataSearcherController(cols, metadata) {
		this.model = new MetadataSearcherModel(cols, metadata);
	};

	MetadataSearcherController.prototype.searchMetadata = function(searchCol, searchVal) {
		this.model.searchMetadata(searchCol, searchVal);
	};

	MetadataSearcherController.prototype.registerObserver = function(observer) {
		this.model.registerObserver(observer);
	};

	function MetadataSearcher(cols, metadata) {
		// TODO: figure out how to format search queries i.e. syntax + `and` `or` capability 
		this.controller = new MetadataSearcherController(cols, metadata);
		this.regEx = / => /;
	};

	MetadataSearcher.prototype.searchMetadata = function(searchCol, searchVal) {
		console.log("??", searchCol, searchVal)
		this.controller.searchMetadata(searchCol, searchVal);
	};

	MetadataSearcher.prototype.registerObserver = function(observer) {
		this.controller.registerObserver(observer);
	};

	MetadataSearcher.prototype.isSearchQuery = function(query) {
		return query.search(this.regEx) > -1;
	};

	return MetadataSearcher;
});