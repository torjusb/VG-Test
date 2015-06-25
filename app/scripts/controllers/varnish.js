'use strict';

angular.module('vgApp')
    .controller('VarnishCtrl', function ($scope, $http, logParser) {
        $http.get('http://crossorigin.me/http://tech.vg.no/intervjuoppgave/varnish.log', {
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
                if (typeof hostMap[request.host] !== 'undefined') {
                    hostMap[request.host]++;
                } else {
                    hostMap[request.host] = 1;
                }

                // Do the same process with the URIs
                if (typeof uriMap[request.uri] !== 'undefined') {
                    uriMap[request.uri]++;
                } else {
                    uriMap[request.uri] = 1;
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

            // Do the same process for the `uriMap`.
            $scope.uriMap = [];
            angular.forEach(uriMap, function (hits, uri) {
                $scope.uriMap.push({
                    uri: uri,
                    hits: hits
                });
            });
        });
    });
