# VG Test App

## Introduction
This is the completed task for the [full stack developer position](http://tech.vg.no/jobs/fullstack-utvikler/)
at VG.

This application displays data from three different formats: varnish log, JSON
and a RSS-feed.

### Varnish log

The varnish log is fetched via HTTP and the data is parsed with regex into
logical object. We then aggregate the data, and display the top 5 hosts and the
top 5 URIs.

### JSON

This simply displays items in a JSON-string which is fetched via HTTP. The
date formats in the JSON is formatted with Norwegian date months, so the dates
are parsed and transformed into `Date` objects. This allows sorting the items
easily.

### RSS-feed

This fetches an RSS feed, parses it and displays the items. Since parsing
RSS/XML is non-trivial, we use the [angular-xml](https://github.com/johngeorgewright/angular-xml)
service to parse the feed. The dates are transformed into `Date` objects, so
we can easily sort them.

## CORS enabling via crossorigin.me

The HTTP services used in this project is not enabled for CORS-requests. To get
around this, I've [crossorigin.me](http://crossorigin.me). This is a very simple
proxy, which will simply fetch the resource, and add CORS-headers to the
response.

This allows making this a pure front end app, which doesn't really require
a backend server.

This is obviously not a perfect solution, as it depends on a third party
service. A better solution would be to set up a simple proxy in Node.js or
similar, but I felt it was outside the scope of this project, as I wanted to
keep the focus on the actual frontend app.

## Running the app

To set up this project, first ensure you have the following:

   - Node.js and npm installed (tested with node v0.12.0 and npm v2.5.1).
   - Grunt (`npm install -g grunt-cli`) (tested with v0.1.13)

Then do the following:

  1. Clone down this repository.
  2. Run `npm install`. This will install all the required Grunt dependencies.
  3. Run `bower install`. This will install all the front end dependencies.
  4. Run `grunt serve`. This will start a simple web server on `localhost:9000`.
     Your browser should open, and you should be able to use the app. The port
     can be changed in Gruntfile.js in case it is already taken.

## Tests

The project is set up for running tests with Karma and Jasmine. Only a single
test is implemented, and in a very basic form. This is just to show that it
works, and a single test is better than no tests!

To run the tests, simply run: `grunt test`.
