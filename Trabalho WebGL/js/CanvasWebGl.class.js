// © RR Team

// defination of the canvas webgl class
function CanvasWebGl(puzzle){
	this.puzzle = puzzle;

	this.gl = null; // WebGL context

	// models
	this.models = {};

	// background
	this.back = null;


	// canvas
	this.canvas = document.getElementById("webgl-id");

	var result = null;

	this.resetGlobalValues();

	this.initWebGL();

	for(var i=0; i<this.puzzle.length; i++){
		var result = parseTXTfile(this.puzzle[i][0]);
		this.newModel(result, this.puzzle[i]);
	}

	this.initBackground();
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

	this.back.drawScene(this.sx, this.sy, this.sz);
};

CanvasWebGl.prototype.initBackground = function(){
	var result = parseTXTfile("modelos/back.txt");
	this.back = new Models(this.gl, [0, 0, 0], result["vertices"].slice(), result["colors"].slice(), true);
};

CanvasWebGl.prototype.newModel =  function(result, puzzle){
	this.models[puzzle[1]] = new Models(this.gl, puzzle[2], result["vertices"].slice(), result["colors"].slice());
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

function parseOBJfile(url){
	var result = null;

	$.ajax({
	  url: url,
	  type: 'get',
	  dataType: 'text',
	  async: false,
	  success: function(data) {
	      result = data;
	  }
	});

	var lines = result.split('\n');

	// The new vertices
	var newVertices = [];

	// The new normal vectors
	var newNormals = [];

	// Check every line and store
	for(var line = 0; line < lines.length; line++){
			var tokens = lines[line].split(/\s\s*/);
			if(tokens[0] == "v"){
				for(j = 1; j < 4; j++) {
				newVertices.push(parseFloat(tokens[j]));
				}
			}

			if(tokens[0] == "vn"){
				for(j = 1; j < 4; j++){
					newNormals.push(parseFloat(tokens[j]));
				}
			}
	}

	return {"vertices": newVertices.slice(), "normals": newNormals.slice()};
}

function parseTXTfile(url){
	var result = null;

	$.ajax({
	  url: url,
	  type: 'get',
	  dataType: 'text',
	  async: false,
	  success: function(data) {
	      result = data;
	  }
	});

	// Entire file read as a string
	// The tokens/values in the file
	// Separation between values is 1 or mode whitespaces
	var tokens = result.split(/\s\s*/);

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

	return {"vertices": newVertices.slice(), "colors": newColors.slice()};
}
