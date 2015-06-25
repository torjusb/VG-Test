'use strict';

angular
    .module('vgApp')
    .factory('logParser', function () {
        return {
            // Takes a row of a log file as a string, parses it and returns
            // a object with ip, date, HTTP method, URL, host name and URI.
            parseRow: function (row) {
                // Parse the row. This will give us the ip, date, HTTP method
                // and URL.
                var match = row.match(/^(\S+) \S+ \S+ \[([^\]]+)\] "([A-Z]+) ([^ ]+) ([^"])*"/);
                var parsed = null;

                if (match) {
                    parsed = {
                        ip: match[1],
                        date: match[2],
                        method: match[3],
                        url: match[4]
                    };

                    // Parse the URL, to extract the host name and URI.
                    var matchUrl = parsed.url.match(/^\w+:\/\/([^\/]+)(\/.*)?$/);
                    parsed.host = matchUrl[1];

                    // If we can't extract a URI, the URI is '/'.
                    parsed.uri = typeof matchUrl[2] !== 'undefined' ? matchUrl[2] : '/';
                }

                return parsed;
            }
        };
    })
    .factory('varnishStats', function ($http, $q, logParser) {
        // This will contain all the data, once the HTTP request has finished
        // and the data is parsed.
        // Both arrays will contain objects. One object per host name / URI
        // respectively.
        var data = {
            topHosts: [], // `{host: 'vg.no', hits: 3}`
            topUris: [] // `{uri: '/foo', hits: 96}`
        };

        // Store the promise in a variable, so we know when the data is ready.
        var dataReady = $http.get('http://crossorigin.me/http://tech.vg.no/intervjuoppgave/varnish.log', {
            transformResponse: function (data) {
                // Each request in the log is separated by a new line,
                // split on it, to get an array of all the requests.
                var rows = data.trim().split("\n");

                // Parse each row. This will give us an array of objects back.
                return rows.map(logParser.parseRow);
            }
        }).then(function (response) {
            // Will contain data about how many requests each host name has
            // had. The key is the host name, and the value is number of hits.
            var hostMap = {};
            var uriMap = {};

            angular.forEach(response.data, function (request) {
                // Add the hostname to the `hostMap` if it isn't added yet,
                // and keep incrementing it's counter every time we see it.
                typeof hostMap[request.host] !== 'undefined' ?
                    hostMap[request.host]++ : hostMap[request.host] = 1;

                // Do the same process with the URIs
                typeof uriMap[request.uri] !== 'undefined' ?
                    uriMap[request.uri]++ : uriMap[request.uri] = 1;
            });

            // Turn the `hostMap` object into an array of objects. This will
            // allow us to easily sort the items with `orderBy`. `orderBy` will
            // not work on plain objects.
            data.topHosts = [];
            angular.forEach(hostMap, function (hits, host) {
                data.topHosts.push({host: host, hits: hits});
            });

            // Do the same process for the `uriMap`.
            data.topUris = [];
            angular.forEach(uriMap, function (hits, uri) {
                data.topUris.push({uri: uri, hits: hits});
            });
        });

        return {
            getTopHosts: function () {
                var defer = $q.defer();

                // We return a promise which we resolves once we know the data
                // from Varnish is loaded.
                dataReady.then(function () {
                    defer.resolve(data.topHosts);
                });

                return defer.promise;
            },
            getTopUris: function () {
                var defer = $q.defer();

                dataReady.then(function () {
                    defer.resolve(data.topUris);
                });

                return defer.promise;
            }
        };
    });
