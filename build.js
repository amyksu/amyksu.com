
/**
 * Module dependencies.
 */

var Metalsmith = require('metalsmith');
var permalinks = require('metalsmith-permalinks');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var matters = require('metalsmith-matters');
var inPlace = require('metalsmith-in-place');

/**
 * Metalsmith.
 */

var metalsmith = new Metalsmith(__dirname)
  .metadata({
    sitename: "Amy's blog",
    siteurl: "amyksu.com",
    description: "My website"
  })
  .frontmatter(false) 
  .use(matters())
  .source('./blog')
  .destination('./docs/blog')
  .clean(false)
  .use(markdown({
    gfm: true,
    smartLists: true,
    smartypants: true,
    tables: true
  }))
  .use(inPlace({
    suppressNoFilesError: true,
    engineOptions: {
      highlight: code => require('highlight.js').highlightAuto(code).value
    }
  }))
  .use(layouts({
    default: 'blog-post.hbs',
    directory: './templates',
    suppressNoFilesError: true
  }))
  .build(function(err) {
    if (err) throw err;
  });

