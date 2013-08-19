/*
 * This file allow to setup base path for searching data
 * You should change here for putting your custom documentation path
*/

// The documentation output from jersey-doc-generator
var jerseyDocGenerator = [
	"resource/data/result.json"
];

// Allow documentation to send back to a javadoc like, if possible
// IMPORTANT : end it with /, always and without index.html
var javaDocUrl   = "http://docs.oracle.com/javase/7/docs/api/";
var jerseyDocUrl = "https://jersey.java.net/apidocs/1.17/jersey/";

// You can add your custom javadoc url, it will be launched after testing javadoc and jerseydoc one
var customDocUrl = "";