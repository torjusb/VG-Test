'use strict';

angular.module('vgApp')
    .controller('RssCtrl', function ($scope, $http, rss) {
        $http.get('http://crossorigin.me/http://www.vg.no/rss/feed/forsiden/?frontId=1').then(function (response) {
            $scope.articles = rss.parse(response.data).rss.channel.item;
        });
    });
