'use strict';

angular.module('vgApp')
    .controller('JsonCtrl', function ($scope, $http, dateParser) {
        $http.get('http://crossorigin.me/http://rexxars.com/playground/testfeed/', {
            transformResponse: function (data) {
                data = angular.fromJson(data);
                angular.forEach(data, function (item) {
                    item.dateTime = dateParser.parse(item.date, item.time);
                });

                return data;
            }
        }).then(function (response) {
            $scope.articles = response.data;
        }, function (err) {
            $scope.errorMsg = 'Could not load articles.';
        });
    });
