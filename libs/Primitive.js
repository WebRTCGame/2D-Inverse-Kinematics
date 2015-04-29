var fb = fb || {};

fb.Primitive = function(attrs) {
	
	attrs = attrs || {};
	
	// Handle common attributes of all primitives.
	
	this.strokeStyle = attrs.strokeStyle || "rgba(0, 0, 0, 0)";
	this.fillStyle = attrs.fillStyle || "rgba(0, 0, 0, 0)";
	this.lineWidth = attrs.lineWidth || 1;
	
	this.transforms = attrs.transforms || [];
	
	this.update = attrs.update || undefined;
};

fb.Primitive.getPrototype = function() {
	
	var p = new fb.Primitive();
	
	delete p.stroke;
	delete p.fill;
	delete p.transforms;
	delete p.update;
	
	return p;
};

fb.Primitive.transform = function(context, transforms) {
	
	for (var i = 0; i < transforms.length; ++i) {
		
	    var t = transforms[i];
	    
	    switch (t[0]) {
	        case "t":
	            context.translate(t[1][0], t[1][1]);
	            break;
	        case "r":
	            context.rotate(t[1][0]);
	            break;
	        case "s":
	            context.scale(t[1][0], t[1][1]);
	            break;
	        default:
	            // General transformation.
	            context.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
	            break;
	    }
	}
};

fb.Primitive.setStyle = function(context, elem) {
	
	if(elem.fillStyle != undefined)
		context.fillStyle = elem.fillStyle;
	if(elem.strokeStyle != undefined)
		context.strokeStyle = elem.strokeStyle;
	if(elem.lineWidth != undefined)
		context.lineWidth = elem.lineWidth;
};