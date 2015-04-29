var fb = fb || {};

fb.Rect = function(attrs) {

	fb.Primitive.call(this, attrs);
	
	attrs = attrs || {};
	
	this.vert = attrs.vert || [0, 0];
	this.width = attrs.width || 0;
	this.height = attrs.height || 0;
};
fb.Rect.prototype = fb.Primitive.getPrototype();
fb.Rect.constructor = fb.Rect;

fb.Rect.prototype.valid = function() {
	
	return true;
};

fb.Rect.prototype.draw = function(context) {
	
	// Fill styles, stroke styles, transformations, etc. will be set
	// appropriately by Flipbook or Painter before this function is invoked.
	
	if(!this.valid()) return;
	
	context.strokeRect(this.vert[0], this.vert[1], this.width, this.height);
	context.fillRect(this.vert[0], this.vert[1], this.width, this.height);
};