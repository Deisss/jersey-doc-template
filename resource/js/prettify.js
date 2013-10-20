/**
 * Default templating object, used internally
 * NOTE: must be cloned (using a.clone) before any use
*/
var jerseyDocObject = {
    // The final path (concat of every sub path)
    path: "",

    // Merge all consumes/produces found to extract list of available one
    consumeList: [],
    produceList: [],

    // General documentation (overriden by latest everytimes exect docList and nameList)
    author: "",
    version: "",
    docList: [],
    nameList: [],

    // One resource/subresource declare this, the full sub-line(s) get this state
    deprecated: false,
    unimplemented: false,

    // Final ending (method content)
    inputList: [],
    output: "",
    // GET, POST, PUT, DELETE, ...
    type: "GET"
};

/**
 * Main prettify class
*/
var jerseyDocPrettify = (function() {
    "use strict";

    /**
     * Detect a class type
     *
     * @param data {Mixed} The data to check
    */
    function __detectClass(data) {
        return (!a.isNull(data) && !a.isNull(data.methodList));
    };

    /**
     * Check is a string is valid (and contains data) or not
     *
     * @param data {Mixed}
     * @return {Boolean} True or false, if it's a valid with data string or not
    */
    function __validString(data) {
        return (a.isString(data) && data.length > 0);
    };

    /**
     * From two part of path, create a single concat version
     *
     * @param path1 {String} The first path to concat
     * @param path2 {String} The second path to concat
     * @return {String} The concat version
    */
    function __concatPath(path1, path2) {
        if(path1.charAt(path1.length - 1) != "/") {
            path1 += "/";
        }

        if(__validString(path2)) {
            // Sanitize url (remove all double //)
            path2 = path2.replace(new RegExp("//+", "g"), "/");

            // Remove first char if it does not fit
            if(path2.charAt(0) === "/") {
                path2 = path2.substr(1);
            }

            path1 += path2;
        }

        return path1;
    };

    /**
     * Parse common data between method and class
     *
     * @param result {jerseyDocObject} The current object parsed for this path
     * @param data {Object} The server side object
    */
    function __parseDefault(result, data) {
        // Get the current showed path
        result.path = __concatPath(result.path, data.path);

        // ConsumeList && ProduceList
        if(a.isArray(data.consumeList) && data.consumeList.length > 0) {
            var i = data.consumeList.length;
            while(i--) {
                result.consumeList.push(data.consumeList);
            }
        }
        if(a.isArray(data.produceList) && data.produceList.length > 0) {
            var i = data.produceList.length;
            while(i--) {
                result.produceList.push(data.produceList);
            }
        }

        // Author & version
        if(__validString(data.author)) {
            result.author = data.author;
        }
        if(__validString(data.version)) {
            result.version = data.version;
        }

        // docList
        if(__validString(data.doc)) {
            result.docList.push(data.doc);
        }

        // Deprecated & unimplemented
        if(data.deprecated === true) {
            result.deprecated = true;
        }
        if(data.unimplemented === true) {
            result.unimplemented = true;
        }
    };

    /**
     * Parse data to get method presentation
     *
     * @param result {jerseyDocObject} The current object parsed for this path
     * @param data {Object} The server side object
    */
    function __parseMethod(result, data) {
        __parseDefault(result, data);

        if(__validString(data.name) && result.nameList.length > 0) {
            result.nameList[result.nameList.length - 1] += " | " + data.name;
        }


        // InputList
        result.inputList = result.inputList.concat(data.inputList);

        if(data.subResource === true) {
            return __parseClass(a.clone(result), data.output);
        } else {
            // Output
            result.output = data.output.name;

            // type
            result.type = convertType(data.type);

            // We can print data
            return result;
        }
    };

    /**
     * Parse data to get class presentation
     *
     * @param result {jerseyDocObject} The current object parsed for this path
     * @param data {Object} The server side object
    */
    function __parseClass(result, data) {
        __parseDefault(result, data);

        if(__validString(data.name)) {
            result.nameList.push(data.name);
        }

        // Getting method content
        var i = data.methodList.length,
            arr = [];
        while(i--) {
            var tmp = __parseMethod(a.clone(result), data.methodList[i]);
            if(a.isArray(tmp)) {
                arr = arr.concat(tmp);
            } else {
                arr.push(tmp);
            }
        }
        return arr;
    };


    /**
     * Main presentation parser to handle json content
     *
     * @param json {Object | array} Data recieve from server side
    */
    return function(json) {
        if(a.isNull(json)) {
            alert("Some data recieve where empty, can't proceed");
            return;
        }

        // Processing array as sub resource
        if(a.isArray(json)) {
            var i = json.length;
            while(i--) {
                jerseyDocPrettify(json[i]);
            }
            return;
        }

        if(a.isObject(json) && __detectClass(json)) {
            return __parseClass(a.clone(jerseyDocObject), json);
        } else {
            alert("unknow data given, can't proceed");
        }
    };
})();

