precision mediump float;

varying vec4 vertexColor;

void main(void) {

	// Using the passed vertex color

	gl_FragColor = vertexColor;
}
