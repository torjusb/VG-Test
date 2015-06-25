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
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
