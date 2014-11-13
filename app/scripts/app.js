'use strict';

angular.module('chessApp', [
  'ngRoute',
  'ngResource',
  'chessBoardDirective'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/game/:urlmoves', {
        templateUrl: 'views/game.html',
        controller: 'gameCtrl'
      })
      .when('/game', {
        templateUrl: 'views/game.html',
        controller: 'gameCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'textCtrl'
      })
      .when('/api', {
        templateUrl: 'views/api.html',
        controller: 'textCtrl'
      })
      .otherwise({
        redirectTo: '/game'
      });
  })
  .filter('reverse', function() {
    return function(items) {
        return items.slice().reverse(); // Create a copy of the array and reverse the order of the items
      };
  })
  .run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}]);
