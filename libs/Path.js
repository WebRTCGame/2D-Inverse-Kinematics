var fb = fb || {};

fb.Path = function(attrs) {

	fb.Primitive.call(this, attrs);
	
	attrs = attrs || {};
	
	this.vers = attrs.vers || [];
	this.close = attrs.close || false;	
};
fb.Path.prototype = fb.Primitive.getPrototype();
fb.Path.constructor = fb.Path;

fb.Path.prototype.valid = function() {
	
	return this.vers.length > 0;
};

fb.Path.prototype.draw = function(context) {
	
	// Fill styles, stroke styles, transformations, etc. will be set
	// appropriately by Flipbook or Painter before this function is invoked.
	
	if(!this.valid()) return;
	
	context.beginPath();

	context.moveTo(this.vers[0][0], this.vers[0][1]);
	for(var i = 1; i < this.vers.length; ++i) {
		var ver = this.vers[i];
		switch(ver[0]) {
            case "b":
                context.bezierCurveTo(ver[1][0], ver[1][1], ver[1][2], ver[1][3], ver[1][4], ver[1][5]);
                break;
            case "q":
                context.quadraticCurveTo(ver[1][0], ver[1][1], ver[1][2], ver[1][3]);
                break;
            default:
                context.lineTo(ver[0], ver[1]);
                break;
		}
	}
	
	if(this.close) context.closePath();
	
	context.stroke();
	context.fill();
};