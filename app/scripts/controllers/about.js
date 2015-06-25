'use strict';

/**
 * @ngdoc function
 * @name vgApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the vgApp
 */
angular.module('vgApp')
    .controller('AboutCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });
