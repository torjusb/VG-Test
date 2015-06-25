'use strict';

/**
 * @ngdoc function
 * @name vgApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the vgApp
 */
angular.module('vgApp')
    .controller('MainCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });
