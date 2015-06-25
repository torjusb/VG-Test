'use strict';

angular
    .module('vgApp')
    // Simple directive to add navigtion elements, and ensure the 'active'
    // class is set as the location changes.
    // Usage:
    //      <nav-elem route="/foo">Foo page</nav-elem>
    .directive('navElem', function () {
        return {
            restrict: 'E',
            // Replace, to ensure bootstrap styling works.
            replace: true,
            transclude: true,
            scope: {
                route: '@'
            },
            template: '<li ng-class="{\'active\': active}"><a href="#{{route}}" ng-transclude></a></li>',
            link: function (scope, element, attrs) {
                scope.route = attrs.route;
            },
            controller: function ($scope, $location) {
                // Whenver the route changes, update `$scope.active`.
                $scope.$on('$routeChangeSuccess', function () {
                    $scope.active = $location.$$path === $scope.route;
                });
            }
        };
    });
