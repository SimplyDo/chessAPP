'use strict';

angular.module('chessBoardDirective',[])
.directive('board', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl:'../../views/boardDirective.html',
    scope: {
      rotate: '=',
      board: '=',
      selected: '=',
      side: '=',
      check: '=',
      checkmate: '=',
      moves: '='
    },
    controller: function($scope) {
      
      $scope.$watch('board', function(value) {
        updateBoard(value);
      });

      $scope.$watch('selected', function(value) {
        updateHighlights(value);
      });
      
      $scope.clickSquare = function(fileLetter, rank) {
        $scope.$emit('squareClicked', {file:fileLetter, rank:rank});
      };

      $scope.fileLabels = ['a','b','c','d','e','f','g','h'];
      var fileMap = {a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7};
      var notationMap = {white:{rook:'R',knight:'N',bishop:'B',queen:'Q',king:'K',pawn:'P'},black:{rook:'r',knight:'n',bishop:'b',queen:'q',king:'k',pawn:'p'}};

      var init = function () {
        //clears selection
        $scope.selected = false;

        //creates 8 ranks x 8 files (empty)
        if (!$scope.ranks) {
          $scope.ranks = new Array(8);
        }
        var color = 'black';
        for (var r = 0; r < 8; r++) {
          if (!$scope.ranks[r]) {
            $scope.ranks[r] = new Array(8);
          }
          if (color === 'white') { //changing the color at the begingin of each line
            color = 'black';
          } else {
            color = 'white';
          }
          for (var f = 0; f < 8; f++) {
            $scope.ranks[r][f] = {color: color, piece: false, highlight: false, rank: 8-r, file: f};
            if (color === 'white') { //changing the color for each square
              color = 'black';
            } else {
              color = 'white';
            }
          }
        }
        console.log('Board initialized');
      };
      
      var updateHighlights = function(selected) {
        if ($scope.ranks) {
          for (var r = 0; r < 8; r++) {
            for (var f = 0; f < 8; f++) {
              $scope.ranks[r][f].highlight = '';
            }
          }
          if (selected) {
            $scope.ranks[8-selected.rank][fileMap[selected.file]].highlight = 'selected';
          }
          if ($scope.moves) {
            var dest;
            for (var i = 0; i < $scope.moves.length; i++) {
              dest = $scope.moves[i].dest;
              if (dest.piece === null) {
                $scope.ranks[8-dest.rank][fileMap[dest.file]].highlight = 'move';
              } else {
                $scope.ranks[8-dest.rank][fileMap[dest.file]].highlight = 'attack';
              }
            }
          }
        }
      };

      var updateBoard = function (boardData) {
        var file, rank, piece, notation;
        if (boardData !== undefined) {
          for (var i = 0; i < boardData.length; i++) {
            file = fileMap[boardData[i].file];
            rank = 8-boardData[i].rank;
            piece = boardData[i].piece;
            if (piece === null) {
              $scope.ranks[rank][file].piece = false;
            } else {
              notation = notationMap[piece.side.name][piece.type];
              $scope.ranks[rank][file].piece = notation;
            }
          }
        }
      };

      $scope.reverseArray = function(array,reverse) {
        if (reverse === true) {
          return array.slice().reverse();
        } else {
          return array;
        } 
      };
      
      init();

    }
  };
});
