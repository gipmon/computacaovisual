// © RRTeam

// z_index
var z_index = 1;

function CanvasWebGl(url_param, cname_param){
	this.url = null;
	this.canvasName = null;

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
	this.canvas = null;

	// Handling the Vertex and the Color Buffers
	function initBuffers(){
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
	}

	//  Drawing the model
	function drawModel(angleXX, angleYY, angleZZ,
						sx, sy, sz,
						tx, ty, tz,
						mvMatrix,
						primitiveType){

	  // Pay attention to transformation order !!

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
	}

	function drawScene(){
		console.log(this.tx);
		console.log(this.canvasName);

		//  Drawing the 3D scene
		console.log(this.gl);
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
		var pUniform = this.gl.getUniformLocation(shaderProgram, "uPMatrix");

		this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

		// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
		mvMatrix = translationMatrix(0, 0, this.globalTz);

		// Instantianting the current model
		drawModel(this.angleXX, this.angleYY, this.angleZZ,
		           this.sx, this.sy, this.sz,
		           this.tx, this.ty, this.tz,
		           mvMatrix,
		           this.primitiveType);
	};

	//  read file from an url
	function readFile(url){
		return $.get(url, function(data){
			parseFile(data);
		});
	}

	function parseFile(data){
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
				newVertices[3 * i + j] = parseFloat(tokens[ aux++ ]);
			}

			for(j = 0; j < 3; j++){

				newColors[3 * i + j] = parseFloat(tokens[ aux++ ]);
			}
		}

		// Assigning to the current model
		this.vertices = newVertices.slice();
		this.colors = newColors.slice();

		// Rendering the model just read

		// RESET the transformations - NEED AUXILIARY FUNCTION !!

		this.tx = this.ty = this.tz = 0.0;

		this.angleXX = this.angleYY = this.angleZZ = 0.0;

		this.sx = this.sy = this.sz = 0.5;
	}

	// WebGL Initialization
	function initWebGL(canvas){
		try{
			// Create the WebGL context
			// Some browsers still need "experimental-webgl"
			this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

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
	}

	function constructor(r, c){
			this.canvasName = c;
			this.url = r;
			readFile(r, c).then(function(){setupWebGL(c);});
	}

	function setupWebGL(c){
			$("#whereGoesCanvas").append('<canvas id="' + c + '" style="z-index: ' + z_index + '" width="600" height="600"></canvas>');
			this.canvas = document.getElementById(c);
			initWebGL(this.canvas);
			shaderProgram = initShaders(this.gl);
			setEventListeners();
			initBuffers();
			drawScene();
	}

	constructor(url_param, cname_param);
}

var cubo_1 = null;
var cubo_2 = null;

function runWebGL(){
	cubo_1 = new CanvasWebGl("modelos/puzzle_cubo/cubo_1.txt", "cubo_1");
	cubo_2 = new CanvasWebGl("modelos/puzzle_cubo/cubo_2.txt", "cubo_2");
}
