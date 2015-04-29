var fb = fb || {};

fb.Composite = function(attrs) {
	
	fb.Primitive.call(this, attrs);
	
	attrs = attrs || {};
	
	this.children = attrs.children || [];
};
fb.Composite.prototype = fb.Primitive.getPrototype();
fb.Composite.constructor = fb.Composite;

fb.Composite.prototype.draw = function(context) {
	
	// The transforms of this composite has already been applied by
	// the painter. Now it should individually apply the transforms
	// of each element nested in it as its children.
	
	var children = this.children;
	for(var i = 0; i < children.length; ++i) {
		
		var elem = children[i];
		context.save();
		fb.Primitive.transform(context, elem.transforms);
		fb.Primitive.setStyle(context, elem);
		elem.draw(context);
		context.restore();
	}
};
