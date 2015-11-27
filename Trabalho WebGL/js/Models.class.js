function Models(gl, initialPosition, i, vertices, colors, background){
  this.gl = gl;
  this.i = i;
  
  this.vertices = vertices;
  this.colors = colors;
  this.globalAngleYY = 0.0;
  this.globalAngleXX = 0.0;

  if(background){
    this.background = true;
  }else{
    this.background = false;
  }

  this.initialPosition = initialPosition;

	// The translation vector
	this.tx = initialPosition.tx;
	this.ty = initialPosition.ty;
	this.tz = initialPosition.tz;

	// The rotation angles in degrees
	this.angleXX = initialPosition.angleXX;
	this.angleYY = initialPosition.angleYY;
	this.angleZZ = initialPosition.angleZZ;

	this.triangleVertexPositionBuffer = this.gl.createBuffer();
	this.triangleVertexColorBuffer = this.gl.createBuffer();

  if(this.background){
    this.cubeVertexTextureCoordBuffer = this.gl.createBuffer();

    this.textureCoords = [
                          0.0, 0.0,
                          1.0, 0.0,
                          1.0, 1.0,
                          0.0, 1.0,
                          ];

    var textureVertexIndices = [
        0, 1, 2,      0, 2, 3,
    ];

    this.cubeVertexIndexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(textureVertexIndices),
                       this.gl.STATIC_DRAW);
    this.cubeVertexIndexBuffer.itemSize = 1;
    this.cubeVertexIndexBuffer.numItems = 6;

    function handleTextureLoaded(texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    this.texture = gl.createTexture();
    this.texture.image = new Image();
    this.texture.onload = function() { handleTextureLoaded(this.texture); }
    this.texture.image.src = "img/background.jpg";
  }else{

  }
}

Models.prototype.resetValues = function(){
  this.tx = this.initialPosition.tx;
  this.ty = this.initialPosition.ty;
  this.tz = this.initialPosition.tz;

  this.angleXX = this.initialPosition.angleXX;
  this.angleYY = this.initialPosition.angleYY;
  this.angleZZ = this.initialPosition.angleZZ;
};

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

  if(this.background){
    // Textures
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), this.gl.STATIC_DRAW);
    this.cubeVertexTextureCoordBuffer.itemSize = 2;
    this.cubeVertexTextureCoordBuffer.numItems = 4;
  }

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

	var mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
  this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	// Passing the Model View Matrix to apply the current transformation
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
  this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,
                        			this.triangleVertexPositionBuffer.itemSize,
                        			this.gl.FLOAT, false, 0, 0);

  if(this.background){
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.cubeVertexTextureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);

    // The vertex indices

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);

	  this.gl.drawElements(this.gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
  }else{
  	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);

    this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute,
                                this.triangleVertexColorBuffer.itemSize,
                                this.gl.FLOAT, false, 0, 0);
   	this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
  }


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
  mvMatrix = mult(translationMatrix(0, 0, globalTz),
	                rotationYYMatrix(this.globalAngleYY));
  mvMatrix = mult(mult(translationMatrix(0, 0, globalTz),
	                rotationYYMatrix(this.globalAngleYY)),
	                rotationXXMatrix(this.globalAngleXX));

	// Instantianting the current model
	this.drawModel(this.angleXX, this.angleYY, this.angleZZ,
			           sx, sy, sz,
			           this.tx, this.ty, this.tz,
			           mvMatrix);
};
