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

            alert("DEBUG MODE, an error occurs\n Message: " + 
                        message + "\n url:" + url + "\n line:" + line);
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
    // Bind element to respond on click to change class
    a.dom.cls('sort-action').tag("a").bind('click', function() {
        var el = a.dom.el(this);
        el.parent().toggleClass('active');
        a.state.forceReloadById("list");
    });
}());

a.dom.id("search").bind("keyup", function() {
    a.storage.memory.setItem("search", this.value);
    a.state.forceReloadById("list");
});

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
    if(
            currentHash === null
        ||  currentHash === ""
        ||  !a.state.hashExists(currentHash)
    ) {
        currentHash = "list";
    }

    /*
     * Some browser don't get hash change with onHashchange event,
     * so we decide to use timer.
     * Note : a.page.event.hash is more complex, here is little example
    */
    timerId = a.timer.add(firstHandle, null, 10);
})();