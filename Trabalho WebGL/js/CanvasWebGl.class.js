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

	for(var i=0; i<this.puzzle.pieces.length; i++){
		this.newModel(parseTXTfile(this.puzzle.pieces[i].url), this.puzzle.pieces[i], i);
	}

	//this.initBackground();
	this.drawScene();
}

CanvasWebGl.prototype.resetValues = function(){
	this.resetGlobalValues();

	for(var model in this.models){
		this.models[model].resetValues();
	}
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

CanvasWebGl.prototype.checkIsFinished = function(){
	var win = true;

	for(var i=0; i<this.puzzle.pieces.length; i++){
		if(this.puzzle.pieces[i].finalPosition.tx != this.models[this.puzzle.pieces[i].alias].tx.round(2)){
			win &= false;
		}else if(this.puzzle.pieces[i].finalPosition.ty != this.models[this.puzzle.pieces[i].alias].ty.round(2)){
			win &= false;
		}else if(this.puzzle.pieces[i].finalPosition.tz != this.models[this.puzzle.pieces[i].alias].tz.round(2)){
			win &= false;
		}else if(this.puzzle.pieces[i].finalPosition.angleXX != this.models[this.puzzle.pieces[i].alias].angleXX){
			win &= false;
		}else if(this.puzzle.pieces[i].finalPosition.angleYY != this.models[this.puzzle.pieces[i].alias].angleYY){
			win &= false;
		}else if(this.puzzle.pieces[i].finalPosition.angleZZ != this.models[this.puzzle.pieces[i].alias].angleZZ){
			win &= false;
		}
	}

	if(win){
	  $("#informationNotice").hide();
	  $("#successNotice").show();
	}else{
	  $("#informationNotice").show();
	  $("#successNotice").hide();
	}
};

CanvasWebGl.prototype.drawScene = function(){
	this.checkIsFinished();

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

CanvasWebGl.prototype.newModel =  function(result, piece, i){
	this.models[piece.alias] = new Models(this.gl, piece.initialPosition, i, result["vertices"].slice(), result["colors"].slice());
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
