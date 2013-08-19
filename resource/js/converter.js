/**
 * Convert the system type before rendering
 *
 * @param data {String} The data to replace
*/
function convertType(data) {
	if(a.isString(data)) {
		return data.replace("javax.ws.rs.", "");
	} else {
		return data;
	}
};


/**
 * Sort between 2 string
 *
 * @param a {String} The first string
 * @param b {String} The second string
*/
function __sortString(a,b) {
	if(a < b) {
		return -1;
	} else if(a > b) {
		return 1;
	}
	return 0;
};


/**
 * Sort elements by type (HTTP Verb)
 *
 * @param data {Array} The array to sort
*/
function sortByType(data) {
	if(a.isArray(data)) {
		return data.sort(function(a,b) {
			var typeA = a.type.toLowerCase(),
				typeB = b.type.toLowerCase();

			// Change delete string to appear on bottom (place "z" at beginning)
			if(typeA === "delete") {	typeA = "zdelete";	}
			if(typeB === "delete") {	typeB = "zdelete";	}

			// Same with head and options (place at first)
			if(typeA === "head") {	typeA = "zhead";	}
			if(typeB === "head") {	typeB = "zhead";	}
			if(typeA === "options") {	typeA = "zoptions";	}
			if(typeB === "options") {	typeB = "zoptions";	}

			return __sortString(typeA, typeB);
		});
	}
	return data;
};

/**
 * Sort elements by path (HTTP Path)
 *
 * @param data {Array} The array to sort
*/
function sortByPath(data) {
	if(a.isArray(data)) {
		return data.sort(function(a,b) {
			var typeA = a.path.toLowerCase(),
				typeB = b.path.toLowerCase();

			return __sortString(typeA, typeB);
		});
	}
	return data;
};

/**
 * Sort elements by output (HTTP Return)
 *
 * @param data {Array} The array to sort
*/
function sortByOutput(data) {
	if(a.isArray(data)) {
		return data.sort(function(a,b) {
			var typeA = a.output.toLowerCase(),
				typeB = b.output.toLowerCase();

			return __sortString(typeA, typeB);
		});
	}
	return data;
};