'use strict';

angular.module('chessApp')
  .controller('gameCtrl', function ($cookieStore,$location,$scope,$resource,$routeParams) {
    
    $scope.rotateBoard = $cookieStore.get('rotateBoard');

    var apiRoot = 'http://api.dxc4.com';

    var gameApi =  $resource(apiRoot + '/game', {}, {
      update: { method: 'POST' }
      });

    var updateUrlHistory = function (historyArray) {
      var urlString;
      if (historyArray.length > 0) {
        urlString = '/game/' + historyArray.join('_');
      } else {
        urlString = '/game';
      }
      $location.path(urlString, false);
    };

    var assignGameData = function(data) {
      $scope.board = data.board;
      $scope.currentHistory = data.previousMoves;
      $scope.status = {};
      $scope.status.isCheck = data.isCheck;
      $scope.status.isCheckmate = data.isCheckmate;
      $scope.status.isRepetition = data.isRepetition;
      $scope.status.isStalemate = data.isStalemate;
      $scope.fullMoves = data.peviousFullMoves;
      $scope.status.side = data.side;
      $scope.fen = data.fen;
      $scope.exportPgn = data.pgn;
      $scope.availableMoves = data.availableFullMoves;
      $scope.availableMovesCount = Object.keys(data.availableFullMoves).length;
      $scope.apicallinprogress = false;
      updateUrlHistory(data.previousMoves);
      deselectSquare();
      autoTurn($scope.status.side);
      popUpMessage($scope.status);
    };
    
    var popUpMessage = function(status) {
      if (status.isCheck) {
        // sweetAlert({
        //   title: status.side + " is in check!",
        //   timer: 2000,
        //   type: "warning"
        // });
      } else if (status.isCheckmate) {
        sweetAlert({
          title: status.side + ' is checkmate!',
          type: 'success',
          confirmButtonColor: '#69F'
        });
      } else if (status.isRepetition) {
        // sweetAlert({
        //   title: "Repetition",
        //   type: "warning",
        //   timer: 2000,
        // });
      } else if (status.isStalemate) {
        sweetAlert({
          title: 'Stalemate!',
          type: 'warning',
          confirmButtonColor: '#69F'
        });
      }
    };
   
    var squareHasOwnPiece = function(square) {
      var move;
      for (var property in $scope.availableMoves) {
        if ($scope.availableMoves.hasOwnProperty(property)) {
          move = $scope.availableMoves[property];
          if (move.src.file === square.file && move.src.rank === square.rank) {
            return true;
          }
        }
      }
      return false;
    };
   
    var checkSquare = function(source,destination) {
      var move;
      var possibleMoves = [];
      for (var property in $scope.availableMoves) {
        if ($scope.availableMoves.hasOwnProperty(property)) {
          move = $scope.availableMoves[property];
          if (move.src.file === source.file && move.src.rank === source.rank) {
            if (!destination) {
              possibleMoves.push(move);
            } else if (move.dest.file === destination.file && move.dest.rank === destination.rank) {
              return property.replace(/(\w*)([RNB])+(\+)?$/g, '$1Q$3'); //this makes sure thatif the move is a pormition to always promote for a queen TODO: add selector to the UI
            }
          }
        }
      }
      if (destination) {
        return false; // not a valid move otherwise the above would have returned already
      } else {
        return possibleMoves; // returns all allowed move for the current aquare
      }
    };

    $scope.newGame = function(pgn) {
      console.log('New game');
      $scope.apicallinprogress = true;
      noAi();
      gameApi.update({ pgn: pgn, includes: 'fen,side,status,previousMoves,previousFullMoves,pgn,availableFullMoves,board'}, function (data) {
        assignGameData(data);
        $scope.history = data.previousMoves;
        $scope.historyLength = data.previousMoves.length;
        $scope.historyStep = data.previousMoves.length;
      });
    };
    
    
    $scope.rewindGame = function(movecount, relative) {
      noAi();
      if (!$scope.apicallinprogress) {
        console.log('rewinding/forwarding: ' + movecount);
        if (relative) {
          var newHistoryStep = $scope.historyStep + movecount;
          if (newHistoryStep > $scope.historyLength || newHistoryStep < 0) {
            return;
          } else {
            $scope.historyStep = newHistoryStep;
          }
        } else {
          $scope.historyStep = movecount;
        }
        $scope.apicallinprogress = true;
        gameApi.update({ pgn: $scope.history.join(' '), moveCount: $scope.historyStep, includes: 'fen,side,status,previousMoves,previousFullMoves,pgn,availableFullMoves,board'}, function (data) {
          assignGameData(data);
        });
      }
    };

    var makeMove = function(moveToMake) {
      if (!$scope.apicallinprogress) {
        console.log('making move: ' + moveToMake);
        $scope.apicallinprogress = true;
        gameApi.update({ pgn: $scope.currentHistory.join(' '), nextMove: moveToMake, includes: 'fen,side,status,previousMoves,previousFullMoves,pgn,availableFullMoves,board'}, function (data) {
          assignGameData(data);
          $scope.history = data.previousMoves;
          $scope.historyLength = data.previousMoves.length;
          $scope.historyStep = data.previousMoves.length;
        });
      }
    };
    
    $scope.playBestMove = function() {
      if (!$scope.status.isCheckmate && !$scope.apicallinprogress) {
        $scope.apicallinprogress = true;
        gameApi.update({ pgn: $scope.currentHistory.join(' '), stockfish: true, includes: 'fen,side,status,previousMoves,previousFullMoves,pgn,availableFullMoves,board'}, function (data) {
          assignGameData(data);
          $scope.history = data.previousMoves;
          $scope.historyLength = data.previousMoves.length;
          $scope.historyStep = data.previousMoves.length;
        });
      }
    };


    $scope.currentUrl = function() {
      return $location.absUrl();
    };

    $scope.rotate = function() {
      $scope.rotateBoard = !$scope.rotateBoard;
      $cookieStore.put('rotateBoard', $scope.rotateBoard);
    };

    $scope.$watch('computer', function(newValue, oldValue) {
      if (newValue !== 'none') {
        autoTurn($scope.status.side);
      }
    });

    var autoTurn = function(side) {
      // checks if the AI is turned on for the current player and makes the turn if so
      if ($scope.status && side) {
        if ($scope.computer === side) {
          if (!$scope.status.isCheckmate && !$scope.status.isRepetition && !$scope.status.isStalemate) {
            $scope.playBestMove();
          }
        }
      }
    };

    var noAi = function() {
      $scope.computer = 'none';
    };

    var deselectSquare = function() {
      $scope.selectedSquare = false;
      $scope.selectedMoves = [];
    };


    $scope.$on('squareClicked', function(event, data) { 
      var square = data;
      if ($scope.selectedSquare && square.rank === $scope.selectedSquare.rank && square.file === $scope.selectedSquare.file) {
        deselectSquare();
        return;
      } else if ($scope.selectedSquare) {
        var validMove = checkSquare($scope.selectedSquare,square);
        if (validMove) {
          console.log('valid move: ' + validMove);
          makeMove(validMove);
          deselectSquare();
          return;
        }
      } 
      if (squareHasOwnPiece(square)) { 
        console.log('square selected');
        $scope.selectedSquare = square;
        $scope.selectedMoves = checkSquare(square);
      } else {
        deselectSquare();
      }
    });

    $scope.newGame($routeParams.urlmoves);
    noAi();

  });
