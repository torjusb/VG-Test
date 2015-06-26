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
        'ngRoute',
        'xml'
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
            .when('/rss', {
                templateUrl: 'views/rss.html',
                controller: 'RssCtrl'
            })
            .when('/json', {
                templateUrl: 'views/json.html',
                controller: 'JsonCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
