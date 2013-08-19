// Root controller system, loading main app system here
(function() {
	/**
	 * Generate function to replace an id by the content given
	 *
	 * @param id {String} The id to perform changes
	*/
	function __replaceById(id) {
		return function(content) {
			a.page.template.replace(document.getElementById(id), content);
		}
	};



	// Preload url
	a.page.template.get("resource/html/api.html");
	a.page.template.get("resource/html/detail.html");




	// Handle the logged part (when user sign in successfully)
	var tree = {
		id   : "root",
		title: "Documentation - list",
		bootOnLoad : true,
		data : {},
		converter : function(data) {
			a.storage.memory.setItem("api", data);
		},
		children : {
			id : "list",
			hash : "list",
			load : __replaceById("rest-global"),
			data : {
				api : "{{memory: api}}"
			},
			include : {
				html : "resource/html/api.html"
			},
			converter : function(data) {
				// Rendering
				var arr = [];
				for(var i in data.api) {
					var tmp = jerseyDocPrettify(data.api[i]);
					arr = arr.concat(tmp);
				}
				// Sorting final result
				data.content = a.clone(arr);

				if(hasClass("sort-by-output", "active")) {
					data.content = sortByOutput(data.content);
				}
				if(hasClass("sort-by-path", "active")) {
					data.content = sortByPath(data.content);
				}
				if(hasClass("sort-by-type", "active")) {
					data.content = sortByType(data.content);
				}

				// Filtering deprecated & unimplemented & search
				var deprecated    = !hasClass("include-type-deprecated", "active"),
					unimplemented = !hasClass("include-type-unimplemented", "active"),
					boolSearch    = false;
					search        = a.storage.memory.getItem("search");

				if(a.isString(search) && search.length > 0) {
					boolSearch = true;
					search = search.toLowerCase();
				}

				var i = data.content.length;
				while(i--) {
					var el = data.content[i];
					// Deprecated && unimplemented
					if(
						(deprecated    && el.deprecated === true)    ||
						(unimplemented && el.unimplemented === true)
					) {
						data.content.splice(i, 1);
						continue;
					}
					// Search
					if(boolSearch) {
						if(
							el.path.toLowerCase().search(search) === -1 &&
							el.type.toLowerCase().search(search) === -1 &&
							el.output.toLowerCase().search(search) === -1
						) {
							data.content.splice(i, 1);
							continue;
						}
					}
				}

				// Store parsed content
				a.storage.memory.setItem("content", data.content);
			}
		}
	};

	var detail = {
		id : "detail",
		load : __replaceById("rest-content"),
		data : {
			api : "{{memory: current}}"
		},
		include : {
			html : "resource/html/detail.html"
		}
	};

	// Populate tree data
	for(var i=0, l=jerseyDocGenerator.length; i<l; ++i) {
		tree.data[i] = jerseyDocGenerator[i];
	}

	// Finally we add elements to system
	a.state.add(tree);
	a.state.add(detail);
})();


/**
 * Load a specific detail list
 *
 * @param type {String} The type to search
 * @param path {String} The path to search
*/
function loadDetail(type, path) {
	var data = a.storage.memory.getItem("content");
	var i = data.length;
	while(i--) {
		if(data[i].type === type && data[i].path === path) {
			a.storage.memory.setItem("current", data[i]);
			a.state.loadById("detail");
			break;
		}
	}
};