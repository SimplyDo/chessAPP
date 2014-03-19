'use strict';

angular.module('chessApp')
  .controller('gameCtrl', function ($scope) {

    $scope.board = {

      art: {
        p: 'Chess_pdt45.svg',
        P: 'Chess_plt45.svg',
        b: 'Chess_bdt45.svg',
        B: 'Chess_blt45.svg',
        k: 'Chess_kdt45.svg',
        K: 'Chess_klt45.svg',
        n: 'Chess_ndt45.svg',
        N: 'Chess_nlt45.svg',
        q: 'Chess_qdt45.svg',
        Q: 'Chess_qlt45.svg',
        r: 'Chess_rdt45.svg',
        R: 'Chess_rlt45.svg'
      },

      selected: false,

      setSquare: function (fileLetter, rankNumber, piece) {
        var fileNumber = this.getFileNumber(fileLetter);
        this.ranks[8-rankNumber][fileNumber].piece = piece;
        console.log(fileLetter+''+rankNumber+' set: '+piece);
      },

      highlightSquare: function (fileLetter, rankNumber, highlight) {
        var fileNumber = this.getFileNumber(fileLetter);
        this.ranks[8-rankNumber][fileNumber].highlight = highlight;
        console.log(fileLetter+''+rankNumber+' highlight toggled.');
      },

      getSquare: function (fileLetter, rankNumber) {
        var fileNumber = this.getFileNumber(fileLetter);
        console.log('Get '+fileLetter+''+rankNumber+': '+this.ranks[8-rankNumber][fileNumber].piece);
        return this.ranks[8-rankNumber][fileNumber];
      },

      getFileNumber: function (fileLetter) {
        return this.fileLabels.indexOf(fileLetter);
      },

      selectSquare: function (fileLetter, rankNumber) {
        if (!this.getSquare(fileLetter, rankNumber).piece && this.selected) {
          // checks if the selected square is empty and if there was a previous selection

          // move piece by getting slected piece
          var piece = this.getSquare(this.selected.fileLetter, this.selected.rankNumber).piece;
          // removing selected piece
          this.setSquare(this.selected.fileLetter, this.selected.rankNumber, false);
          // adding selected piece to new position
          this.setSquare(fileLetter, rankNumber, piece);
          // clear any previous selection
          this.highlightSquare(this.selected.fileLetter, this.selected.rankNumber, false);
          this.selected = false;

        } else if (!this.selected && this.getSquare(fileLetter, rankNumber).piece) {
          // checks if the selected square has a piece and if there was no previous selection
          this.selected = {fileLetter: fileLetter, rankNumber: rankNumber};
          this.highlightSquare(fileLetter, rankNumber, true);
        } else {
          // clear any previous selection
          this.highlightSquare(this.selected.fileLetter, this.selected.rankNumber, false);
          this.selected = false;
        }
      },

      init: function () {
        //clears selection
        this.selected = false;

        //creates 8 ranks x 8 files (empty)
        if (!this.ranks) {
          this.ranks = new Array(8);
        }
        var color = 'black';
        for (var r = 0; r < 8; r++) {
          if (!this.ranks[r]) {
            this.ranks[r] = new Array(8);
          }
          if (color === 'white') { //changing the color at the begingin of each line
            color = 'black';
          } else {
            color = 'white';
          }
          for (var f = 0; f < 8; f++) {
            this.ranks[r][f] = {color: color, piece: false, highlight: false};
            if (color === 'white') { //changing the color for each square
              color = 'black';
            } else {
              color = 'white';
            }
          }
        }
        console.log('Board initialized');
      },

      reset: function () {
        this.parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 2');
      },

      replaceNumberWithDashes : function(str) {
        var numSpaces = parseInt(str);
        var newStr = '';
        for (var i = 0; i < numSpaces; i++) { newStr += '-'; }
        return newStr;
      },

      parseFen : function(fen) {
        if (fen) {
          this.init();
          var fenParts = fen.replace(/^\s*/, '').replace(/\s*$/, '').split(/\/|\s/);
          for (var r = 0;r < 8; r++) {
            var rank = fenParts[r].replace(/\d/g, this.replaceNumberWithDashes);
            for (var f=0;f<8;f++) {
              if (rank.substr(f, 1) !== '-') {
                this.ranks[r][f].piece = rank.substr(f, 1);
              } else {
                this.ranks[r][f].piece = false;
              }
            }
          }
          console.log('Fen loaded: '+fen);
        } else {
          console.log('No fen supplied.');
        }
      },

      exportFen: function () {
        var fen = '';
        for (var r = 0; r < 8; r++) {
          var emptySquares = 0;
          for (var f = 0; f < 8; f++) {
            if (!this.ranks[r][f].piece) {
              emptySquares++;
            } else if (emptySquares !== 0) {
              fen = fen + emptySquares;
              emptySquares = 0;
            }
            if (this.ranks[r][f].piece) {
              fen = fen + this.ranks[r][f].piece;
            }
          }
          if (emptySquares !== 0) {
            //insert empty suqares count at the end of rank if any
            fen = fen + emptySquares;
          }
          if (r < 7) {
            // add a slash at the end of each rank unless it is the last
            fen = fen + '/';
          }
        }
        console.log('Fen generated: ' + fen);
        return fen;
      },

      fileLabels: ['a','b','c','d','e','f','g','h']
    };

    $scope.board.reset();


  });
