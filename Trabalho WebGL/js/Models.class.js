function Models(gl, shaderProgram, primitiveType, vertices, colors){
  this.gl = gl;
  this.shaderProgram = shaderProgram;
  this.vertices = vertices;
  this.colors = colors;
  this.primitiveType = primitiveType;

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

  this.initBuffers();
}

// Handling the Vertex and the Color Buffers
Models.prototype.initBuffers = function(){
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

	// enable depth test
	this.gl.enable(this.gl.DEPTH_TEST);
};

//  Drawing the model
Models.prototype.drawModel = function(angleXX, angleYY, angleZZ,
				sx, sy, sz,
				tx, ty, tz,
				mvMatrix,
				primitiveType){

	mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));
	mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZZ));
	mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYY));
	mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXX));
	mvMatrix = mult(mvMatrix, scalingMatrix(sx, sy, sz));

  console.log(mvMatrix);

	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");

	this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	// Drawing the contents of the vertex buffer
	// primitiveType allows drawing as filled triangles / wireframe / vertices
};

Models.prototype.drawScene = function(sx, sy, sz, mvMatrix){
	// Instantianting the current model
	this.drawModel(this.angleXX, this.angleYY, this.angleZZ,
			           sx, sy, sz,
			           this.tx, this.ty, this.tz,
			           mvMatrix,
			           this.primitiveType);
};
