var _ = exports.Game = function(gamestate, bone) {
	var self = this;
	this.gamestate = gamestate;
	this.bone = bone;
	//this.bone.setButtonHandler(this.onPlayerButton);
};

_.prototype = {
    startGame: function(){
        this.gamestate.reset();
        this.newRound();
    },
	newRound: function(){
		var self = this,
		    round = this.gamestate.nextRound(),
		    beepTime = this.gamestate.getRoundTime();
		    
		if(this.gamestate.hasPlayerWon()){
			this.wonRound();
		} else {
			this.playRound(round, beepTime, function(){
				//start players turn
				//self.gamestate.startPlayersTurn();
				console.log("players turn now...");
			});
		}
	},
	playRound: function (round, beepTime, callback) {
		console.log("Starting round: " + round);
		var self = this, 
		    timeout = 0, 
		    bleeptime = this.gamestate.getPlayerTime(),
		    pauseTime = 100;
		var playStack = function(index){
			if(index >= round){
				callback();
			}
			else {
				var color = self.gamestate.getColorFromStack(index);
				setTimeout(function(){
				    self.bone.bleep(color, bleeptime, function(){
				        //go to the next item when done
				        playStack(index+1);
				    });
				},timeout);
	            timeout += (bleeptime + pauseTime);
			}
		}			
		playStack(0);
	},
	onPlayerButton: function(color){
		var self = this;
		if(this.gamestate.isPlayerTurn && !this.isButtonBleeping){
			console.log("Player move: " + color);
			var move = this.gamestate.playerMove(color);
			if(move.succeeded){
				//continue
				this.bleepButtonOn(color, 500, function(){
					//check for next round
					if(move.roundIsOver){
						self.newRound();
					}
				});

			} else {
				//game over
				this.bleepButtonOn("red", 2000, function(){
					self.gameOver();	
				});					
			}
			
		}
	},
	gameOver: function(){
		console.log("Score: " + this.gamestate.getScore());
	},
	wonRound: function(){
		console.log("You won!");
	}

};