// © RR Team
// z_index of webgl modules
var z_index = 1;

// defination of the canvas webgl class
function CanvasWebGl(url_param, cname_param){
	this.url = url_param;
	this.canvasName = cname_param;

	this.gl = null; // WebGL context
	this.shaderProgram = null;

	this.triangleVertexPositionBuffer = null;
	this.triangleVertexColorBuffer = null;

	// The GLOBAL transformation parameters
	this.globalAngleYY = 0.0;
	this.globalTz = 0.0;

	// The translation vector
	this.tx = 0.0;
	this.ty = 0.0;
	this.tz = 0.0;

	// The rotation angles in degrees
	this.angleXX = 0.0;
	this.angleYY = 0.0;
	this.angleZZ = 0.0;

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

	// To allow choosing the way of drawing the model triangles
	this.primitiveType = null;

	// To allow choosing the projection type
	this.projectionType = 0;
	this.vertices = [];
	this.colors = [];

	// canvas
	$("#whereGoesCanvas").append('<canvas id="' + this.canvasName + '" style="z-index: ' + z_index + '" width="600" height="600"></canvas>');
	this.canvas = document.getElementById(this.canvasName);

	var result = null;
	var url = this.url;
	$.ajax({
	  url: url,
	  type: 'get',
	  dataType: 'text',
	  async: false,
	  success: function(data) {
	      result = data;
	  }
	});

	this.parseFile(result);
	this.initWebGL();
	this.initShaderProgram();
	this.initBuffers();
	this.drawScene();
}

// Handling the Vertex and the Color Buffers
CanvasWebGl.prototype.initBuffers = function() {
	// Coordinates
	this.triangleVertexPositionBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
	this.triangleVertexPositionBuffer.itemSize = 3;
	this.triangleVertexPositionBuffer.numItems = this.vertices.length / 3;

	// Associating to the vertex shader
	this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,
			this.triangleVertexPositionBuffer.itemSize,
			this.gl.FLOAT, false, 0, 0);

	// Colors
	this.triangleVertexColorBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
	this.triangleVertexColorBuffer.itemSize = 3;
	this.triangleVertexColorBuffer.numItems = this.colors.length / 3;

	// Associating to the vertex shader
	this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute,
			this.triangleVertexColorBuffer.itemSize,
			this.gl.FLOAT, false, 0, 0);
};


//  Drawing the model
CanvasWebGl.prototype.drawModel = function(angleXX, angleYY, angleZZ,
				sx, sy, sz,
				tx, ty, tz,
				mvMatrix,
				primitiveType){

	mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));
	mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZZ));
	mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYY));
	mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXX));
	mvMatrix = mult(mvMatrix, scalingMatrix(sx, sy, sz));

	// Passing the Model View Matrix to apply the current transformation

	var mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");

	this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	// Drawing the contents of the vertex buffer

	// primitiveType allows drawing as filled triangles / wireframe / vertices

	if(primitiveType == this.gl.LINE_LOOP){
		// To simulate wireframe drawing!
		// No faces are defined! There are no hidden lines!
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		var i;

		for(i = 0; i < this.triangleVertexPositionBuffer.numItems / 3; i++){

			this.gl.drawArrays(primitiveType, 3 * i, 3);
		}
	}else{
		this.gl.drawArrays(primitiveType, 0, this.triangleVertexPositionBuffer.numItems);
	}
};

CanvasWebGl.prototype.drawScene = function(){

	//  Drawing the 3D scene
	var pMatrix;
	var mvMatrix = mat4();

	// Clearing the frame-buffer and the depth-buffer
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Computing the Projection Matrix
	if(this.projectionType == 0){
		//For now, the default orthogonal view volume
		pMatrix = ortho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);

		// Global transformation!
		this.globalTz = 0;
	}else{
		// A standard view volume.
		// Viewer is at (0,0,0)
		// Ensure that the model is "inside" the view volume
		pMatrix = perspective(45, 1, 0.05, 15);

		// Global transformation!
		this.globalTz = -2.5;
	}

	// Passing the Projection Matrix to apply the current projection
	var pUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");

	this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	mvMatrix = translationMatrix(0, 0, this.globalTz);

	// Instantianting the current model
	this.drawModel(this.angleXX, this.angleYY, this.angleZZ,
	          this.sx, this.sy, this.sz,
	          this.tx, this.ty, this.tz,
	          mvMatrix,
	          this.primitiveType);
};

CanvasWebGl.prototype.parseFile =  function(data){
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
	this.vertices = newVertices.slice();
	this.colors = newColors.slice();

	// RESET the transformations - NEED AUXILIARY FUNCTION !!
	this.tx = this.ty = this.tz = 0.0;
	this.angleXX = this.angleYY = this.angleZZ = 0.0;
	this.sx = this.sy = this.sz = 0.5;
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
