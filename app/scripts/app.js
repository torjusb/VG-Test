'use strict';

/**
 * @ngdoc overview
 * @name vgApp
 * @description
 * # vgApp
 *
 * Main module of the application.
 */
angular
    .module('vgApp', [
        'ngAnimate',
        'ngResource',
        'ngRoute'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/varnish', {
                templateUrl: 'views/varnish.html',
                controller: 'VarnishCtrl'
            })
            .when('/json', {
                templateUrl: 'views/json.html',
                controller: 'JsonCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
