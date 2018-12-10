
/**
 * Module dependencies.
 */

var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var matters = require('metalsmith-matters');

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
  .use(layouts({
    default: 'blog-post.hbs',
    directory: './templates',
    suppressNoFilesError: true
  }))
  .build(function(err) {
    if (err) throw err;
  });

