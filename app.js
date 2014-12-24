/*
simon  game
by ryan kilkenny
12/22/2014
---
attempt #1 reqs:
- 10 rounds
- each round takes 2 seconds
- each round plays starts from the beginning and plays up to the next round
--
GameState

Controller
 - init gamestate
 - hookup buttons
 - gameloop
 	- Computer: play round
 	- Player: play round
 		- succes: next round
 		- fail: game over

*/
var gs = require("./GameState.js"),
    bn = require("./bone.js"),
    gm = require("./Game.js");

var bone = new bn.Bone(function(){
    console.log("BONE ready!");
    //bone.blinkTest();
    console.log("Starting Simon...");
    simon = new gm.Game(new gs.GameState(), bone);
    simon.startGame();
});

/*
setInterval(function(){
    console.log("game loop...");
    
}, 5000);
*/