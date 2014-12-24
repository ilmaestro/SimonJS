var b = require("octalbonescript"),
    Q = require("q"),
    config = require("./config.js");

var _ = exports.Bone = function(readyCallback) {
    var self = this;
    this.leds = config.leds;
    this.buttons = config.buttons;
    this.piezos = config.piezos;
    this.colors = config.colors;
    this.interruptsEnabled = false;
    this.buttonHandler = function(color){self.bleep(color,1000)};   //default button handler
    this.initGPIO();
    setTimeout(function(){self.ready(readyCallback);}, 1000);       //slight delay before interrupts are enabled.
}
_.prototype = {
	initGPIO: function(){
	    var self = this;
	    //outputs
	    for(var i in this.leds) {
            b.pinMode(this.leds[i], b.OUTPUT);
        }
        //inputs
        for(var i in this.buttons) {
            b.pinMode(this.buttons[i], b.INPUT, function(){
                b.attachInterrupt(self.buttons[i], true, b.RISING, function(t){self.onInterrupt(i)});
            });
        }
        //piezos
        for(var i in this.piezos) {
            b.pinMode(this.piezos[i], b.OUTPUT);
        }
	},
	ready: function(readyCallback){
	    this.interruptsEnabled = true;  
	    readyCallback();
	},
	setButtonHandler: function(handler){
	    this.buttonHandler = handler;  
	},
	onInterrupt: function(i){
	    var self = this;
	    if(this.interruptsEnabled){
	        var color = this.colors[i];
	        this.disableInterrupts(config.btnBounceTime);
	        this.buttonHandler(color);
	    }
	},
	/** Temporarily Disable Interrupts, helps to alleviate bounceback **/
	disableInterrupts: function(time){
	    var self = this;
	    this.interruptsEnabled = false;
	    setTimeout(function(){self.interruptsEnabled = true;},time);
	},
	blinkTest: function(){
	    var self = this,
	        timeout = 0,
	        bleeptime = 1000;
	    // bleep each light consecutively
	    this.colors.forEach(function(color){
	        setTimeout(function(){self.bleep(color, bleeptime, function(){});},timeout);
	        timeout += bleeptime;
	    });
	},
	getLedFromColor: function(color){
	    return this.leds[this.colors.indexOf(color)];
	},
	setPiezo: function(piezo, dutycycle, freq){
	    var deferred = Q.defer();
        b.analogWrite(piezo, dutycycle, freq, function(x){
            if (x.err) {
                deferred.reject(x.err);
            }
            else {
                deferred.resolve();
            }
        });
        return deferred.promise;
	},
	setLedOn: function(led){
	    b.digitalWrite(led, b.HIGH);
	},
	setLedOff: function(led){
	    b.digitalWrite(led, b.LOW);
	},
	bleep: function(color, bleepTime, callback){
	    console.log("Bleeping " + color + "...");
	    var self    = this,
	        led     = this.getLedFromColor(color),
	        piezo   = this.piezos[0];
	    this.setLedOn(led);
	    this.setPiezo(piezo, 0.5, config.sounds[color]).then(function(){
	        setTimeout(function(){
    	        self.setLedOff(led);
    	        self.setPiezo(piezo,0.0,0.0).then(function(){
    	            callback();    
    	        });
    	    }, bleepTime);
	    });
	    
	}
}