'use strict';

angular.module('vgApp')
    .controller('VarnishCtrl', function ($scope, $http) {
        $http.get('http://crossorigin.me/http://tech.vg.no/intervjuoppgave/varnish.log', {
            transformResponse: function (data) {
                // Each request in the log is separated by a new line,
                // split on it, to get an array of all the requests.
                var rows = data.split("\n");

                // Map the request into readable data
                return rows.map(function(row) {
                    // Parse the row. This will give us the ip, date, HTTP method
                    // and URL.
                    var match = row.match(/^(\S+) \S+ \S+ \[([^\]]+)\] "([A-Z]+) ([^ ]+) ([^"])*"/);
                    var parsed;

                    if (match) {
                        parsed = {
                            ip: match[1],
                            date: match[2],
                            method: match[3],
                            url: match[4]
                        };

                        // Parse the URL, to extract the host name and URI.
                        var matchUrl = parsed.url.match(/^\w+:\/\/([^\/]+)\/?(.+)?$/);
                        parsed.host = matchUrl[1];
                        parsed.uri = matchUrl[2];
                    }

                    return parsed;
                });
            }
        }).then(function (response) {
            // Will contain data about how many requests each host name has
            // had. The key is the host name, and the value is number of hits.
            var hostMap = {};

            angular.forEach(response.data, function (request) {
                if (!request) {
                    return;
                }

                // Add the hostname to the `hostMap` if it isn't added yet,
                // and keep incrementing it's counter every time we see it.
                if (typeof hostMap[request.host] !== 'undefined') {
                    hostMap[request.host]++;
                } else {
                    hostMap[request.host] = 1;
                }
            });

            // Turn the `hostMap` object into an array of objects. This will
            // allow us to easily sort the items with `orderBy`. `orderBy` will
            // not work on plain objects.
            $scope.hostMap = [];
            angular.forEach(hostMap, function (hits, host) {
                $scope.hostMap.push({
                    host: host,
                    hits: hits
                });
            });
        });
    });
