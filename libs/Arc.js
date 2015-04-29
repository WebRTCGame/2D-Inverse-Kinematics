var fb = fb || {};

fb.Arc = function(attrs) {

	fb.Primitive.call(this, attrs);
	
	attrs = attrs || {};
	
	this.center = attrs.center || [0, 0];
	this.radius = attrs.radius || 0;
	this.angle0 = attrs.angle0 || 0;
	this.angle1 = attrs.angle1 || 0;
};
fb.Arc.prototype = fb.Primitive.getPrototype();
fb.Arc.constructor = fb.Arc;

fb.Arc.prototype.valid = function() {
	
	return true;
};

fb.Arc.prototype.draw = function(context) {
	
	// Fill styles, stroke styles, transformations, etc. will be set
	// appropriately by Flipbook or Painter before this function is invoked.
	
	if(!this.valid()) return;
	
	context.beginPath();
	context.arc(this.center[0], this.center[1], this.radius, this.angle0, this.angle1, false);
	context.closePath();
	
	context.stroke();
	context.fill();
};