'use strict';

angular.module('vgApp')
    .controller('RssCtrl', function ($scope, $http, x2js) {
        $http.get('http://crossorigin.me/http://www.vg.no/rss/feed/forsiden/?frontId=1').then(function (response) {
            // Convert the XML feed into plain objects.
            var feedData = x2js.xml_str2json(response.data);
            $scope.articles = feedData.rss.channel.item;
        });
    });
