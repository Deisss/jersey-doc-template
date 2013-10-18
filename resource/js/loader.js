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
	a.page.template.get("resource/html/list.html");
	a.page.template.get("resource/html/test.html");
	a.page.template.get("resource/html/detail.html");


	// Handle the logged part (when user sign in successfully)
	var content = {
		bootOnLoad : true,
		id   : "root",
		data : {},
		converter : function(data) {
			a.storage.memory.setItem("api", data);
		},
		children : [
			{
				id : "list",
				hash : "list",
				title: "Documentation - list",
				load : __replaceById("page-content"),
				data : {
					api : "{{memory: api}}"
				},
				include : {
					html : "resource/html/list.html"
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
				},
				preLoad : function(result) {
					document.getElementById("menu-test").style.display="none";
					document.getElementById("menu-list").style.display="block";
					a.storage.memory.setItem("gotry", true);
					result.done();
				}
			},
			{
				// TODO : currently switching from list to test is not well done, as root lost html elements doing this ! we should avoid test here so ! Correct that, and make a better version of this !
				id   : "test",
				hash : "test/{{type: [a-zA-Z]+}}/{{path : .+}}",
				title: "Documentation - test request",
				load : __replaceById("page-content"),
				data : {
					type : "{{type}}",
					path : "{{path}}",
					api  : "{{memory : api}}"
				},
				include : {
					html : "resource/html/test.html"
				},
				converter : function(data) {
					// Rendering
					var arr = [];
					for(var i in data.api) {
						var tmp = jerseyDocPrettify(data.api[i]);
						arr = arr.concat(tmp);
					}

					data.content = null;
					for(var i=0, l=arr.length; i<l; ++i) {
						var el = arr[i];
						// See Handlebars - safe url function in boot.js
						var tmp = el.path.replace(/\\/g, "-").replace(/\//g, "-");
						if(tmp == data.path && el.type == data.type) {
							data.content = el;
							break;
						}
					}

					// If we found some data, now we proceed input list to find relation
					// between url, and inputList
					if(data.content) {
					
					}
				},
				preLoad : function(result) {
					document.getElementById("menu-list").style.display="none";
					document.getElementById("menu-test").style.display="block";
					result.done();
				},
				postLoad : function(result) {
					// Store parsed content
					a.storage.memory.setItem("current", result.getData("content"));
					a.storage.memory.setItem("gotry", false);

					// Loading left state
					a.state.loadById("detail");
					result.done();
				}
			}
		]
	};

	var detail = {
		id : "detail",
		load : __replaceById("rest-content"),
		data : {
			api   : "{{memory: current}}",
			gotry : "{{memory: gotry}}"
		},
		include : {
			html : "resource/html/detail.html"
		}
	};

	// Populate tree data
	for(var i=0, l=jerseyDocGenerator.length; i<l; ++i) {
		content.data[i] = jerseyDocGenerator[i];
	}

	// Finally we add elements to system
	a.state.add(content);
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

/**
 * Request to active a different tab from the default one
 *
 * @param current {String} The tab name to activate
*/
function changeTestTab(current) {
	var opposite = "";
	if(current === "response") {
		opposite = "request";
	} else {
		opposite = "response";
	}

	// Content
	addClass(document.getElementById("content-" + current), "active");
	removeClass(document.getElementById("content-" + opposite), "active");

	// Menu
	addClass(document.getElementById("menu-" + current), "active");
	removeClass(document.getElementById("menu-" + opposite), "active");
};


/**
 * Perform a test on given parameters
*/
function testRequest() {
	var dom  = document.getElementById("test-request"),
		form = a.form.get(dom);

	var notParsedUrl = form["url-server"];
	// Remove last char if it's not well positioned
	if(notParsedUrl.substr(notParsedUrl.length - 1) == "/") {
		notParsedUrl = notParsedUrl.substr(0, notParsedUrl.length - 1);
	}
	// Add "http"
	if(notParsedUrl.substr(0, 7) != "http://") {
		notParsedUrl = "http://" + notParsedUrl;
	}
	notParsedUrl += form["content-path"];

	// Now the url is in "final" mode, we can bind param to it
	// To do so, we will use parsing from Appstorm, as it is ready for that !
	var preparedUrl = notParsedUrl.replace(/\{/, "{{").replace(/\}/, "}}");

	// TODO: the good things is that URL is close to be OK for appstorm too from state... deal with it
	var parsedUrl = preparedUrl;

	// Building basic Ajax request options
	var options = {
		url:     parsedUrl,
		type:    "raw",
		method:  form["content-method"],
		cache:   false,
		data:    form["text-request-body"] || "",
		header:  {}
	};

	if(form["accept"]) {
		options.header["accept"] = form["accept"];
	}
	if(form["content-type"]) {
		options.header["content-type"] = form["content-type"];
		// Set in JSON mode
		if(form["content-type"].toLowerCase() === "application/json") {
			options.type = "json";
		} else if(form["content-type"].toLowerCase() === "application/xml") {
			options.type = "xml";
		}
	}
	if(form["basic-auth"]) {
		options.header["authorization"] = "Basic " + Base64.encode(form["basic-auth"]);
	}

	// Preparing request for sending
	var request = new a.ajax(options,
		function(result) {
			// we can retrieve all header data from request
			var text = document.getElementById("text-response");

			// Erase
			text.innerHTML = "";

			// Put header
			text.innerHTML += request.request.getAllResponseHeaders().toString();

			// Escape chars
			text.innerHTML += "\n\n\n";

			// Body response
			console.log("done:" + result);
			text.innerHTML += result;
		}, function(result) {
			// we can retrieve all header data from request
			var text = document.getElementById("text-response");

			// Erase
			text.innerHTML = "";

			// Put header
			console.log(request.request.getAllResponseHeaders());
			text.innerHTML += request.request.getAllResponseHeaders().toString();
		});

	// Starting request
	request.send();
};