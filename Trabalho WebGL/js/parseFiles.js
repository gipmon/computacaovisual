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
