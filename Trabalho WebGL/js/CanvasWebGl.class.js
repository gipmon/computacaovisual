// © RR Team
// z_index of webgl modules
var z_index = 1;

// defination of the canvas webgl class
function CanvasWebGl(url_param_list){
	this.urls = url_param_list;

	this.gl = null; // WebGL context

	// models
	this.models = {};

	// canvas
	this.canvas = document.getElementById("webgl-id");

	var result = null;

	this.resetGlobalValues();

	this.initWebGL();

	for(var i=0; i<this.urls.length; i++){
		var url = this.urls[i][0];

		$.ajax({
		  url: url,
		  type: 'get',
		  dataType: 'text',
		  async: false,
		  success: function(data) {
		      result = data;
		  }
		});

		this.parseFile(this.urls[i][1], result);
	}

	this.drawScene();
}

CanvasWebGl.prototype.resetGlobalValues = function() {
	// The GLOBAL transformation parameters
	this.globalAngleYY = 0.0;
	this.globalTz = 0.0;

	// The scaling factors
	this.sx = 0.5;
	this.sy = 0.5;
	this.sz = 0.5;

	// NEW - GLOBAL Animation controls
	this.globalRotationYY_ON = 1;
	this.globalRotationYY_DIR = 1;
	this.globalRotationYY_SPEED = 1;

	// rotations and animation
	this.rotationXX_ON = 1;
	this.rotationXX_DIR = 1;
	this.rotationXX_SPEED = 1;
	this.rotationYY_ON = 1;
	this.rotationYY_DIR = 1;
	this.rotationYY_SPEED = 1;
	this.rotationZZ_ON = 1;
	this.rotationZZ_DIR = 1;
	this.rotationZZ_SPEED = 1;
}

CanvasWebGl.prototype.drawScene = function(){
	// Clearing the frame-buffer and the depth-buffer
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	for(var model in this.models){
		this.models[model].drawScene(this.sx, this.sy, this.sz);
	}
};

CanvasWebGl.prototype.parseFile =  function(alias, data){
	// Entire file read as a string
	// The tokens/values in the file
	// Separation between values is 1 or mode whitespaces
	var tokens = data.split(/\s\s*/);

	// Array of values; each value is a string
	var numVertices = parseInt(tokens[0]);

	// For every vertex we have 6 floating point values
	var i, j;
	var aux = 1;
	var newVertices = [];
	var newColors = []

	for(i = 0; i < numVertices; i++){
		for(j = 0; j < 3; j++){
			newVertices[3 * i + j] = parseFloat(tokens[aux++]);
		}

		for(j = 0; j < 3; j++){
			newColors[3 * i + j] = parseFloat(tokens[aux++]);
		}
	}

	// Assigning to the current model
	this.models[alias] = new Models(this.gl, newVertices.slice(), newColors.slice());

	// this.resetGlobalValues();
};

// WebGL Initialization
CanvasWebGl.prototype.initWebGL =  function(){
	try{
		// Create the WebGL context
		// Some browsers still need "experimental-webgl"
		this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");

		// DEFAULT: Face culling is DISABLED
		// Enable FACE CULLING
		this.gl.enable(this.gl.CULL_FACE);

		// DEFAULT: The BACK FACE is culled!!
		// The next instruction is not needed...
		this.gl.cullFace(this.gl.BACK);
	} catch (e){
	}

	if (!this.gl){
		alert("Could not initialise WebGL, sorry! :-(");
	}
};
