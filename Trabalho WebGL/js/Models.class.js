function Models(gl, vertices, colors){
  this.gl = gl;
  this.vertices = vertices;
  this.colors = colors;

	// The translation vector
	this.tx = 0.0;
	this.ty = 0.0;
	this.tz = 0.0;

	// The rotation angles in degrees
	this.angleXX = 45.0;
	this.angleYY = 0.0;
	this.angleZZ = 0.0;

	this.triangleVertexPositionBuffer = null;
	this.triangleVertexColorBuffer = null;
  
	this.triangleVertexPositionBuffer = this.gl.createBuffer();
	this.triangleVertexColorBuffer = this.gl.createBuffer();
}

// Handling the Vertex and the Color Buffers
Models.prototype.initBuffers = function(){
	// Coordinates
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
	this.triangleVertexPositionBuffer.itemSize = 3;
	this.triangleVertexPositionBuffer.numItems = this.vertices.length / 3;

	// Associating to the vertex shader
	this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,
                        			this.triangleVertexPositionBuffer.itemSize,
                        			this.gl.FLOAT, false, 0, 0);

	// Colors
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
	this.triangleVertexColorBuffer.itemSize = 3;
	this.triangleVertexColorBuffer.numItems = this.colors.length / 3;

	// Associating to the vertex shader
	this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute,
                        			this.triangleVertexColorBuffer.itemSize,
                        			this.gl.FLOAT, false, 0, 0);

	// enable depth test
	this.gl.enable(this.gl.DEPTH_TEST);
};

//  Drawing the model
Models.prototype.drawModel = function(angleXX, angleYY, angleZZ,
                              				sx, sy, sz,
                              				tx, ty, tz,
                              				mvMatrix){

	mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));
	mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZZ));
	mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYY));
	mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXX));
	mvMatrix = mult(mvMatrix, scalingMatrix(sx, sy, sz));

	// Passing the Model View Matrix to apply the current transformation
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
  this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,
                        			this.triangleVertexPositionBuffer.itemSize,
                        			this.gl.FLOAT, false, 0, 0);

	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);

  this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute,
                              this.triangleVertexColorBuffer.itemSize,
                              this.gl.FLOAT, false, 0, 0);

	var mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");

	this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
 	this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
};

Models.prototype.drawScene = function(sx, sy, sz){
  this.shaderProgram = initShaders(this.gl);
  this.initBuffers();
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

	// Instantianting the current model
	this.drawModel(this.angleXX, this.angleYY, this.angleZZ,
			           sx, sy, sz,
			           this.tx, this.ty, this.tz,
			           mvMatrix);
};
