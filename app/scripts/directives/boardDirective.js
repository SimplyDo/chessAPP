'use strict';
angular.module('chessBoardDirective',[])
.directive('board', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      board: '=',
      rotate: '='
    },
    templateUrl:'../../views/boardDirective.html'
  };
});
