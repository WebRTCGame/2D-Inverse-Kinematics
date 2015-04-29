var fb = fb || {};

fb.Painter = function(options) {
	
	options = options || {};

	if(options.canvasId) {
		this.canvas = document.getElementById(options.canvasId);
	} else if (options.canvas) {
		this.canvas = options.canvas;
	} else {
		this.canvas = undefined;
	}
	
	if(this.canvas) this.context = this.canvas.getContext("2d");
	
	// Viewport.
	if(options.cx == undefined) options.cx = 0;
	if(options.cy == undefined) options.cy = 0;
	if(options.w == undefined) options.w = 1;
	if(options.h == undefined) options.h = 1;
	if(options.vw == undefined) options.vw = this.canvas.width;
	if(options.vh == undefined) options.vh = this.canvas.height;
	this.setView(options);
};

fb.Painter.prototype.valid = function() {
	
	return this.canvas != undefined;
};

fb.Painter.prototype.setView = function(options) {
	
	if(!this.valid()) return;
	
	options = options || {};	

	this.cx = options.cx == undefined ? this.cx : options.cx;
	this.cy = options.cy == undefined ? this.cy : options.cy;
	this.w = options.w == undefined ? this.w : options.w;
	this.h = options.h == undefined ? this.h : options.h;
	this.vw = options.vw == undefined ? this.vw : options.vw;
	this.vh = options.vh == undefined ? this.vh : options.vh;
	
	var sx = this.vw / this.w;
	var sy = this.vh / this.h;

	this.context.setTransform(1, 0, 0, 1, 0, 0);
	this.context.scale(sx, -sy);
	this.context.translate(
		(-this.cx + this.w / 2),
		-(this.cy + this.h / 2));
};

fb.Painter.prototype.clear = function() {
	
	var w = this.w;
	var h = this.h;
	
	this.context.clearRect(-w / 2 + this.cx, -h / 2 + this.cy, w, h);
};

fb.Painter.prototype.draw = function(elem) {
	
	if(!this.valid()) return;
	
	var context = this.context;

	context.save();
	
	this.setTransform(elem);
	this.setStyle(elem);
	
	// Draw the visual elements.
	elem.draw(context);
	
	context.restore();
};

fb.Painter.prototype.setTransform = function(elem) {
	
	var transforms = elem.transforms;
	var context = this.context;
	
	fb.Primitive.transform(context, transforms);
};

fb.Painter.prototype.setStyle = function(elem) {
	
	fb.Primitive.setStyle(this.context, elem); 
};