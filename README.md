jersey-doc-template
===================

Template presentation for jersey-doc-generator output. It can handle all jersey-doc-generator data in a easy and readable
way.

![image](http://www.kirikoo.net/images/14Anonyme-20130819-021044.png)



Installation
------------

The template does work in a pretty simple way. First you need to clone this repository:

    git clone --recursive https://github.com/Deisss/jersey-doc-template

We need to get it in recursive mode, because the template use [AppStorm.JS framework](https://github.com/Deisss/AppStorm.JS)

Now you grab a copy of it, we can make it working!


Usage
-----

To make it working, you need to edit `data.js` file at the root folder:

  * __jerseyDocGenerator__: it's the place to locate the json data returned by [jersey-doc-generator](https://github.com/Deisss/jersey-doc-generator). You can use many...
  * __customDocUrl__: you can specify here your own javadoc, to link classes to your javadoc if they are not java/jersey related.

__javaDocUrl__ and __jerseyDocUrl__ refer to java documentation and jersey documentation.
You probably don't need to change this. As it allow template to redirect people on thoose documentation on element click.

After you did this, it's done, you can use it threw your favorite server, with your favorite browser!
