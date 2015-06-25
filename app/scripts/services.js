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
                    var matchUrl = parsed.url.match(/^\w+:\/\/([^\/]+)\/?(.+)?$/);
                    parsed.host = matchUrl[1];
                    parsed.uri = matchUrl[2];
                }

                return parsed;
            }
        };
    });
