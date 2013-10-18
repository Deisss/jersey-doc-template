// This part allow system to startup (decide what to startup, in which situation)

/*
-------------------------------
  THE FUNCTIONS FROM JQUERY NEEDED...
-------------------------------
*/
/**
 * Get the element no matter if it's and id or the element
 *
 * @param el {String | DOMElement} The element to get
 * @return {DOMElement | null} The element found
*/
function elOrId(el) {
	if(a.isString(el)) {
		return document.getElementById(el);
	}
	return el;
};

/**
 * Detect if element got classname or not
 *
 * @param el {String | DOMElement} The element to check
 * @param cls {String} The classname to check
 * @return {Boolean} True if element got classname, false in other case
*/
function hasClass(el, cls) {
	return elOrId(el).className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
};

/**
 * Add a class to given element
 *
 * @param el {String | DOMElement} The element to change
 * @param cls {String} The classname to add
*/
function addClass(el,cls) {
	if(!this.hasClass(el,cls)) {
		elOrId(el).className += " " + cls;
	}
};

/**
 * Remove a class from given element
 *
 * @param el {String | DOMElement} The element to change
 * @param cls {String} The classname to remove
*/
function removeClass(el,cls) {
	el = elOrId(el);
	if(hasClass(el,cls)) {
		var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
		el.className = el.className.replace(reg, " ");
	}
};

/**
 * Toggle a class on a given element
 *
 * @param el {String | DOMElement} The element to change
 * @param cls {String} The classname to add/remove
*/
function toggleClass(el, cls) {
	el = elOrId(el);
	if(hasClass(el, cls)) {
		removeClass(el, cls);
	} else {
		addClass(el, cls);
	}
};

/*
-------------------------------
  GLOBAL ERROR CATCH
-------------------------------
*/
(function() {
	var oldErrorHandler = window.onerror;
	if(a.environment.get("debug") === true) {
		window.onerror = function(message, url, line) {
			if(oldErrorHandler) {
				return oldErrorHandler(message, url, line);
			}

			alert("DEBUG MODE, an error occurs\n Message: " + message + "\n url:" + url + "\n line:" + line);
			return false;
		};
	}
})();


/*
-------------------------------
  CLICK CATCH
-------------------------------
*/

// Bind li click
(function() {
	// Search all li in the page
	var liList = document.getElementsByTagName("li");

	for(var i=0, l=liList.length; i<l; ++i) {
		var li = liList[i];

		if(hasClass(li, "sort-action")) {
			var children = li.childNodes;

			for(var j=0, m=children.length; j<m; ++j) {
				var child = children[j];

				if(child.tagName.toUpperCase() === "A") {
					// Binding a to click
					child.onclick = function() {
						var parent = this.parentNode;
						toggleClass(parent, "active");
						a.state.forceReloadById("list");
					};
				}
			}
		}
	}
}());

document.getElementById("search").onkeyup = function() {
	a.storage.memory.setItem("search", this.value);
	a.state.forceReloadById("list");
};

/*
------------------------
  HANDLEBARS.JS
------------------------
*/
Handlebars.registerHelper("toLowerCase", function(object) {
	if(!a.isNull(object) && !a.isString(object.toLowerCase)) {
		return new Handlebars.SafeString(object.toLowerCase());
	} else if(a.isString(object)) {
		return new Handlebars.SafeString(object);
	} else {
		return object;
	}
});
Handlebars.registerHelper("ifCond", function(v1, v2, options) {
	if(v1 === v2) {
		return options.fn(this);
	}
	return options.inverse(this);
});
Handlebars.registerHelper("safeUrl", function(object) {
	if(a.isString(object)) {
		return object.replace(/\\/g, "-").replace(/\//g, "-");
	}
	return object;
});
Handlebars.registerHelper("printDefault", function(object) {
	if(a.isNull(object) || !a.isString(object) || object.length === 0) {
		return new Handlebars.SafeString("--noname--");
	} else {
		return new Handlebars.SafeString(object);
	}
});
Handlebars.registerHelper("booleanToString", function(object) {
	return (object === true) ? "true" : "false";
});
Handlebars.registerHelper("deprecated", function(object) {
	return (object === true) ? "deprecated" : "";
});
Handlebars.registerHelper("unimplemented", function(object) {
	return (object === true) ? "unimplemented" : "";
});

// Produce doc url for given data
Handlebars.registerHelper("produceDoc", function(object) {
	if(a.isString(object) && object.length > 0) {
		// Jersey check
		if(
			object.indexOf("com.sun.jersey") !== -1           ||
			object.indexOf("javax.ws.rs") !== -1              ||
			object.indexOf("org.glassfish.jersey") !== -1     ||
			object.indexOf("com.sun.research.ws.wadl") !== -1
		) {
			return jerseyDocUrl + object.replace(/\./g, "/") + ".html";
		}

		// Java check
		if(
			object.indexOf("javax") === 0        ||
			object.indexOf("java") === 0         ||
			object.indexOf("org.xml.sax") === 0  ||
			object.indexOf("org.w3c.dom") === 0
		) {
			return javaDocUrl + object.replace(/\./g, "/") + ".html";
		}

		// Nothing found we try default
		if(a.isString(customDocUrl) && customDocUrl.length > 0) {
			return customDocUrl + object.replace(/\./g, "/") + ".html";
		}
	} else {
		return "";
	}
});



Handlebars.registerHelper("count", function(object) {
	return object.length;
});
Handlebars.registerHelper("debug", function(object) {
	console.log("Current Context");
	console.log("====================");
	console.log(this);

	if(object) {
		console.log("Value");
		console.log("====================");
		console.log(object);
	}
});


/*
------------------------
  APPSTORM.JS
------------------------
*/
(function() {
	a.environment.set("console", "warn");
	a.environment.set("verbose", 1);

	var currentHash = a.page.event.hash.getHash(),
		timerId = null,
		max = 1000;

	// Initialise page event hash system
	a.page.event.hash.setPreviousHash("");
	window.location.href = "#loading_application";

	/**
	 * handle "state change" for every browser
	*/
	function firstHandle() {
		if(a.page.event.hash.getHash() !== currentHash) {
			window.location.href = "#" + currentHash;
			max = 0;
		}
		if(max-- <= 0) {
			a.timer.remove(timerId);
		}
	};

	// The main starter is here, we will customize it soon
	if(currentHash === null || currentHash === "" || !a.state.hashExists(currentHash)) {
		currentHash = "list";
	}

	// Some browser don't get hash change with onHashchange event, so we decide to use timer
	// Note : a.page.event.hash is more complex, here is little example
	timerId = a.timer.add(firstHandle, null, 10);
})();