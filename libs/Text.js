var fb = fb || {};

fb.Text = function(attrs) {

	fb.Primitive.call(this, attrs);

	attrs = attrs || {};

	this.pos = attrs.pos || [0, 0];
	this.textBaseline = attrs.textBaseline || "top";
	this.font = attrs.font || null;
	this.text = attrs.text || "";
};
fb.Text.prototype = fb.Primitive.getPrototype();
fb.Text.constructor = fb.Text;

fb.Text.prototype.valid = function() {

	return true;
};

fb.Text.prototype.draw = function(context) {

	// Fill styles, stroke styles, transformations, etc. will be set
	// appropriately by Flipbook or Painter before this function is invoked.

	if (!this.valid())
		return;

	context.font = this.font;
	context.scale(1, -1);
	context.strokeText(this.text, this.pos[0], -this.pos[1]);
	context.fillText(this.text, this.pos[0], -this.pos[1]);
	context.scale(1, -1);

}; 