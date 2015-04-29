var fb = fb || {};

fb.Flipbook = function(options) {
	
	options = options || {};
	
	// Interval.
	this.interval = options.interval || 3;
	
	// Scene graph.
	this.scene = options.scene || [];
		
	// Callback functions.
	this.callbacks = options.callbacks || [];
	
	// Painter.
	this.painter = new fb.Painter(options);

	// Timeline.	
	this.playing = false;
	this.nsteps = 0;
	this.playId = 0;
	this.retain = options.retain == undefined ? false : options.retain;
};

fb.Flipbook.prototype.pause = function() {
	
	if(!this.playing) return;
	
	clearInterval(this.playId);
	this.playing = false;
};

fb.Flipbook.prototype.step = function() {
	
	if(!this.retain)
		this.painter.clear();
	
	// Update.
	for(var i = 0; i < this.callbacks.length; ++i) {

		this.callbacks[i](this);
	}
	
	for(var i = 0; i < this.scene.length; ++i) {

		var elem = this.scene[i];
		this.painter.draw(elem);
		if(elem.update) elem.update(this);
		if(elem instanceof fb.Composite) {
			for(var j = 0; j < elem.children.length; ++j) {
				var child = elem.children[j]; 
				if(child.update) child.update(this);
			}
		}
	}
	
	++this.nsteps;
};

fb.Flipbook.prototype.play = function() {
	
	if(this.playing) return;
	
	this.playing = true;
	
	// Step.
	var that = this;
	this.playId = setInterval(
		function(){ that.step(); },
		this.interval);
};