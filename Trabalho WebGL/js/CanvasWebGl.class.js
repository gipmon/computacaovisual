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

	//this.initBackground();
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

	//this.back.drawScene(this.sx, this.sy, this.sz);
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
