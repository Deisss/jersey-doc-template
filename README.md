jersey-doc-template
===================

Template presentation for [jersey-doc-generator](https://github.com/Deisss/jersey-doc-generator/) output.
It can handle all data elements generated with [jersey-doc-generator](https://github.com/Deisss/jersey-doc-generator/) in a easy and readable
way.

### Screenshot ###

![image](http://www.kirikoo.net/images/14Anonyme-20130819-021044.png)




Installation
------------

The template does work in a pretty simple way. First you need to clone this repository:

    git clone --recursive https://github.com/Deisss/jersey-doc-template

We need to get it in recursive mode, because the template use [AppStorm.JS framework](https://github.com/Deisss/AppStorm.JS)

Now you grab a copy of it, we can make it working!




Usage
-----

First of course, you need to output a file from [jersey-doc-generator](https://github.com/Deisss/jersey-doc-generator/).
In our example (see `data.js`) we locate it to __/resource/data/result.json__.

You need to edit `data.js` file at the root folder:

  * __jerseyDocGenerator__: it's the place to locate the json data returned by [jersey-doc-generator](https://github.com/Deisss/jersey-doc-generator). You can use more than one file...
  * __customDocUrl__: you can specify here your own javadoc, to link classes to your javadoc if they are not java/jersey related.

__javaDocUrl__ and __jerseyDocUrl__ refer to java documentation and jersey documentation.
You probably don't need to change them, as they are pre-configured.

After you did this, it's done, you can use it threw your favorite server, with your favorite browser!




Licence
-------

This project is licensed under MIT licence.
