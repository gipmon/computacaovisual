// © RR Team
// z_index of webgl modules
var z_index = 1;

// defination of the canvas webgl class
function CanvasWebGl(url_param_list){
	this.urls = url_param_list;

	this.gl = null; // WebGL context
	this.shaderProgram = null;

	// To allow choosing the way of drawing the model triangles
	this.primitiveType = null;

	// To allow choosing the projection type
	this.projectionType = 1;

	// models
	this.models = {};

	// canvas
	this.canvas = document.getElementById("webgl-id");

	var result = null;

	this.resetGlobalValues();

	this.initWebGL();
	this.initShaderProgram();

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

	//  Drawing the 3D scene
	var pMatrix;
	var mvMatrix = mat4();

	// A standard view volume.
	// Viewer is at (0,0,0)
	// Ensure that the model is "inside" the view volume
	pMatrix = perspective(45, 1, 0.05, 15);

	// Global transformation!
	globalTz = -2.5;

	// Passing the Projection Matrix to apply the current projection
	var pUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");

	this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	mvMatrix = translationMatrix(0, 0, globalTz);

	var numItems = 0;

	for(var model in this.models){
		this.models[model].drawScene(this.sx, this.sy, this.sz, mvMatrix);
		numItems += this.models[model].triangleVertexPositionBuffer.numItems;
	}

	console.log(numItems);

	this.gl.drawArrays(this.primitiveType, 0, numItems);
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
	this.models[alias] = new Models(this.gl, this.shaderProgram, this.primitiveType,
		 															newVertices.slice(), newColors.slice());

	// this.resetGlobalValues();
};

// WebGL Initialization
CanvasWebGl.prototype.initWebGL =  function(){
	try{
		// Create the WebGL context
		// Some browsers still need "experimental-webgl"
		this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");

		// DEFAULT: The viewport occupies the whole canvas
		// DEFAULT: The viewport background color is WHITE
		// NEW - Drawing the triangles defining the model
		this.primitiveType = this.gl.TRIANGLES;

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

CanvasWebGl.prototype.initShaderProgram =  function(){
	this.shaderProgram = initShaders(this.gl);
};
