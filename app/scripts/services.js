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

        var sortByHits = function (a, b) {
            if (a.hits < b.hits) {
                return 1;
            }
            if (a.hits > b.hits) {
                return -1;
            }

            return 0;
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
            data.topHosts = data.topHosts.sort(sortByHits);

            // Do the same process for the `uriMap`.
            data.topUris = [];
            angular.forEach(uriMap, function (hits, uri) {
                data.topUris.push({uri: uri, hits: hits});
            });
            data.topUris = data.topUris.sort(sortByHits);
        });

        return {
            getTopHosts: function () {
                var defer = $q.defer();

                // We return a promise which we resolves once we know the data
                // from Varnish is loaded.
                dataReady.then(function () {
                    defer.resolve(data.topHosts);
                }, defer.reject);

                return defer.promise;
            },
            getTopUris: function () {
                var defer = $q.defer();

                dataReady.then(function () {
                    defer.resolve(data.topUris);
                }, defer.reject);

                return defer.promise;
            }
        };
    })
    .factory('rss', function (x2js) {
        return {
            // Parse an RSS feed, and return it as Object.
            parse: function (rss) {
                // Convert the XML feed into plain objects.
                var feedData = x2js.xml_str2json(rss);

                // Ensure dates are actual Date objects, so they can be
                // formatted easily.
                feedData.rss.channel.lastBuildDate = new Date(feedData.rss.channel.lastBuildDate);
                feedData.rss.channel.item = feedData.rss.channel.item.map(function (item) {
                    item.pubDate = new Date(item.pubDate);

                    return item;
                });

                return feedData;
            }
        };
    })
    .factory('dateParser', function () {
        var nbDates = [
            'januar', 'februar', 'mars', 'april', 'mai', 'juni',
            'juli', 'august', 'september', 'oktober', 'november', 'desember'
        ];

        return {
            // Takes a date formatted in Norwegian, and converts it into a
            // `Date` object.
            // Example: '3 Mars 2012 19:47'
            parse: function (date, time) {
                // Parse the date, and extract the day, name of the month and
                // the yar.
                var parseDate = date.match(/^(\d+) (\w+) (\d+)$/);
                var day = parseDate[1];
                var year = parseDate[3];

                // Look up the month name in the `nbDates` array to figure out
                // the month number.
                var monthName = parseDate[2].toLowerCase();
                var month = nbDates.indexOf(monthName) + 1;

                // Extract the hour and minutes from the time
                var parseTime = time.match(/^(\d+):(\d+)$/);
                var hour = parseTime[1];
                var minutes = parseTime[2];

                return new Date(year, month, day, hour, minutes);
            }
        };
    });
