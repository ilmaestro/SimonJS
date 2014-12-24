//Simon GameState object
var config = require("./config.js");

var _ = exports.GameState = function() {
	this.stack = [];
	this.stackSize = config.gameStacks[0];
	this.isPlayerTurn = false;
	this.currentRound = 0;
	this.playerIndex = 0;
	this.roundTime = config.startRoundTime;
	this.roundTimeDecrease = config.roundTimeDecrease;
	this.playerTime = config.playerTime;
	this.colors = config.colors;
};

_.prototype = {
	resetStack: function () {
		this.stack = [];
		for(i = 0; i<10; i++){
			var colorIndex = Math.floor(Math.random() * 4);
			this.stack.push(colorIndex);
		}
	},
	nextRound: function(){
		this.currentRound++;
		return this.currentRound;
	},
	hasPlayerWon: function(){
		return (this.currentRound >= this.stackSize);
	},
	getRoundTime: function(){
		return this.roundTime - (this.roundTimeDecrease * this.currentRound);
	},
	getColorFromStack: function(index){
		return this.colors[this.stack[index]];
	},
	getScore: function(){
		return this.currentRound;
	},
	getPlayerTime: function(){
        return this.playerTime;
	},
	startPlayersTurn: function() {
		this.playerIndex = 0;
		this.isPlayerTurn = true;
	},
	playerMove: function(color){
		var isMatch = this.colors[this.stack[this.playerIndex]] === color;
		this.playerIndex++;
		return {
			succeeded: isMatch,
			roundIsOver: (this.playerIndex >= this.currentRound)
		};
	},
	reset: function(){
		this.isPlayerTurn = false;
		this.currentRound = 4; //start in the middle of the game for now..
		this.playerIndex = 0;
		this.resetStack();
	}
};
