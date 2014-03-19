'use strict';

angular.module('chessApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/board', {
        templateUrl: 'views/board.html',
        controller: 'gameCtrl'
      })
      .otherwise({
        redirectTo: '/board'
      });
  })
  .filter('reverse', function() {
    return function(items) {
        return items.slice().reverse(); // Create a copy of the array and reverse the order of the items
      };
  });
