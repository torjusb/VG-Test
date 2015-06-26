'use strict';

angular.module('vgApp')
    .controller('VarnishCtrl', function ($scope, varnishStats) {
        // Displays loading spinners
        $scope.loadingHosts = $scope.loadingUris = true;

        varnishStats.getTopHosts().then(function (hosts) {
            $scope.hosts = hosts;
        }, function () {
            $scope.hostsError = 'Could not load top hosts.';
        });

        varnishStats.getTopUris().then(function (uris) {
            $scope.uris = uris;
        }, function () {
            $scope.urisError = 'Could not load top URIs.';
        });
    });
