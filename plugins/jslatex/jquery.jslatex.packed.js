/*
 * forked from dreasgrech/jsLatex
 *     fix escape bugs in LaTex equation
 *     Bugs Report: liang3p@gmail.com
 *
 * jsLaTeX v1.2.2 - A jQuery plugin to directly embed LaTeX into your website or blog
 *
 *  Copyright (c) 2009 Andreas Grech
 *
 *  Licensed under the WTFPL license:
 *    http://www.wtfpl.net/about/
 *
 * http://dreasgrech.com
 */

(function ($) {var attachToImage = function () {return $("<img/>").attr({src: this.src,style:'margin-bottom: -4px;'});},formats = {'gif': attachToImage,'png': attachToImage,'svg': attachToImage,'swf': function () {return $("<embed/>").attr({src: this.src,type: 'application/x-shockwave-flash'});}},sections = {'{f}': 'format','{e}': 'equation'};$.fn.latex = function (opts) {opts = $.extend({},$.fn.latex.defaults, opts);opts.format = formats[opts.format] ? opts.format : 'svg'; return this.each(function () {var $this = $(this),format, s, element, url = opts.url; opts.equation = escape($.trim($this.text())); for (s in sections) {if (sections.hasOwnProperty(s) && (format = url.indexOf(s)) >= 0) {url = url.replace(s, opts[sections[s]]);}} opts.src = url; element = formats[opts.format].call(opts); $this.html('').append(element); if (opts.callback) {opts.callback.call(element); }});};$.fn.latex.defaults = { format: 'svg', url: 'http://latex.codecogs.com/{f}.latex?{e}' }; }(jQuery));

