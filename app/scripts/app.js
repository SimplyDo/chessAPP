'use strict';

angular.module('chessApp', [
  'ngRoute',
  'ngTouch',
  'ngResource',
  'ngCookies',
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
      .otherwise({
        redirectTo: '/game'
      });
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
