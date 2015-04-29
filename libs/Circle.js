var fb = fb || {};

fb.Circle = function(attrs) {

	fb.Primitive.call(this, attrs);
	
	attrs = attrs || {};
	
	this.center = attrs.center || [0, 0];
	this.radius = attrs.radius || 0;
};
fb.Circle.prototype = fb.Primitive.getPrototype();
fb.Circle.constructor = fb.Circle;

fb.Circle.prototype.valid = function() {
	
	return true;
};

fb.Circle.prototype.draw = function(context) {
	
	// Fill styles, stroke styles, transformations, etc. will be set
	// appropriately by Flipbook or Painter before this function is invoked.
	
	if(!this.valid()) return;
	
	context.beginPath();
	context.arc(this.center[0], this.center[1], this.radius, 0, Math.PI * 2, false);
	context.closePath();
	
	context.stroke();
	context.fill();
};