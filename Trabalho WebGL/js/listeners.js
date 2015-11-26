function setEventListeners(){
  $("#cuboBtn1").click(function(){
    cubo_1.tx += 0.01;
  	cubo_1.drawScene();
  });

  $("#cuboBtn2").click(function(){
    cubo_2.tx -= 0.01;
  	cubo_2.drawScene();
  });

  //
  //   // NEW --- Mesh subdivision buttons
  //
  //   document.getElementById("mid-rec-depth-1-button").onclick = function(){
  //
  //       midPointRefinement( vertices, colors, 1 );
  //
  //       initBuffers();
  //
	// };
  //
  //   document.getElementById("mid-rec-depth-2-button").onclick = function(){
  //
  //       midPointRefinement( vertices, colors, 2 );
  //
  //       initBuffers();
  //
	// };
  //
  //   document.getElementById("mid-rec-depth-3-button").onclick = function(){
  //
  //       midPointRefinement( vertices, colors, 3 );
  //
  //       initBuffers();
  //
	// };
  //
  //   document.getElementById("cent-rec-depth-1-button").onclick = function(){
  //
  //       centroidRefinement( vertices, colors, 1 );
  //
  //       initBuffers();
  //
	// };
  //
  //   document.getElementById("cent-rec-depth-2-button").onclick = function(){
  //
  //       centroidRefinement( vertices, colors, 2 );
  //
  //       initBuffers();
  //
	// };
  //
  //   document.getElementById("cent-rec-depth-3-button").onclick = function(){
  //       centroidRefinement( vertices, colors, 3 );
  //
  //       initBuffers();
	// };
  //
  //   // NEW --- Sphere approximation button
  //
  //   document.getElementById("sphere-surf-button").onclick = function(){
  //
  //       moveToSphericalSurface( vertices );
  //
  //       initBuffers();
  //
	// };
  //
  // // Dropdown list
  //
	// var projection = document.getElementById("projection-selection");
  //
	// projection.addEventListener("click", function(){
  //
	// 	// Getting the selection
  //
	// 	var p = projection.selectedIndex;
  //
	// 	switch(p){
  //
	// 		case 0 : projectionType = 0;
	// 			break;
  //
	// 		case 1 : projectionType = 1;
	// 			break;
	// 	}
	// });
  //
	// // Dropdown list
  //
	// var list = document.getElementById("rendering-mode-selection");
  //
	// list.addEventListener("click", function(){
  //
	// 	// Getting the selection
  //
	// 	var mode = list.selectedIndex;
  //
	// 	switch(mode){
  //
	// 		case 0 : primitiveType = gl.TRIANGLES;
	// 			break;
  //
	// 		case 1 : primitiveType = gl.LINE_LOOP;
	// 			break;
  //
	// 		case 2 : primitiveType = gl.POINTS;
	// 			break;
	// 	}
	// });
  //
	// // Button events
  //
	// document.getElementById("XX-on-off-button").onclick = function(){
  //
	// 	// Switching on / off
  //
	// 	if( rotationXX_ON ) {
  //
	// 		rotationXX_ON = 0;
	// 	}
	// 	else {
  //
	// 		rotationXX_ON = 1;
	// 	}
	// };
  //
	// document.getElementById("XX-direction-button").onclick = function(){
  //
	// 	// Switching the direction
  //
	// 	if( rotationXX_DIR == 1 ) {
  //
	// 		rotationXX_DIR = -1;
	// 	}
	// 	else {
  //
	// 		rotationXX_DIR = 1;
	// 	}
	// };
  //
	// document.getElementById("XX-slower-button").onclick = function(){
  //
	// 	rotationXX_SPEED *= 0.75;
	// };
  //
	// document.getElementById("XX-faster-button").onclick = function(){
  //
	// 	rotationXX_SPEED *= 1.25;
	// };
  //
	// document.getElementById("YY-on-off-button").onclick = function(){
  //
	// 	// Switching on / off
  //
	// 	if( rotationYY_ON ) {
  //
	// 		rotationYY_ON = 0;
	// 	}
	// 	else {
  //
	// 		rotationYY_ON = 1;
	// 	}
	// };
  //
	// document.getElementById("YY-direction-button").onclick = function(){
  //
	// 	// Switching the direction
  //
	// 	if( rotationYY_DIR == 1 ) {
  //
	// 		rotationYY_DIR = -1;
	// 	}
	// 	else {
  //
	// 		rotationYY_DIR = 1;
	// 	}
	// };
  //
	// document.getElementById("YY-slower-button").onclick = function(){
  //
	// 	rotationYY_SPEED *= 0.75;
	// };
  //
	// document.getElementById("YY-faster-button").onclick = function(){
  //
	// 	rotationYY_SPEED *= 1.25;
	// };
  //
	// document.getElementById("ZZ-on-off-button").onclick = function(){
  //
	// 	// Switching on / off
  //
	// 	if( rotationZZ_ON ) {
  //
	// 		rotationZZ_ON = 0;
	// 	}
	// 	else {
  //
	// 		rotationZZ_ON = 1;
	// 	}
	// };
  //
	// document.getElementById("ZZ-direction-button").onclick = function(){
  //
	// 	// Switching the direction
  //
	// 	if( rotationZZ_DIR == 1 ) {
  //
	// 		rotationZZ_DIR = -1;
	// 	}
	// 	else {
	// 		rotationZZ_DIR = 1;
	// 	}
	// };
  //
	// document.getElementById("ZZ-slower-button").onclick = function(){
	// 	rotationZZ_SPEED *= 0.75;
	// };
  //
	// document.getElementById("ZZ-faster-button").onclick = function(){
	// 	rotationZZ_SPEED *= 1.25;
	// };
  //
	// document.getElementById("reset-button").onclick = function(){
	// 	// The initial values
  //
	// 	tx = 0.0;
  //
	// 	ty = 0.0;
  //
	// 	tz = 0.0;
  //
	// 	angleXX = 0.0;
  //
	// 	angleYY = 0.0;
  //
	// 	angleZZ = 0.0;
  //
	// 	sx = 0.5;
  //
	// 	sy = 0.5;
  //
	// 	sz = 0.5;
  //
	// 	rotationXX_ON = 0;
  //
	// 	rotationXX_DIR = 1;
  //
	// 	rotationXX_SPEED = 1;
  //
	// 	rotationYY_ON = 0;
  //
	// 	rotationYY_DIR = 1;
  //
	// 	rotationYY_SPEED = 1;
  //
	// 	rotationZZ_ON = 0;
  //
	// 	rotationZZ_DIR = 1;
  //
	// 	rotationZZ_SPEED = 1;
	// };
  //
	// document.getElementById("face-culling-button").onclick = function(){
  //
	// 	if( gl.isEnabled( gl.CULL_FACE ) )
	// 	{
	// 		gl.disable( gl.CULL_FACE );
	// 	}
	// 	else
	// 	{
	// 		gl.enable( gl.CULL_FACE );
	// 	}
	// };
  //
	// document.getElementById("depth-test-button").onclick = function(){
  //
	// 	if( gl.isEnabled( gl.DEPTH_TEST ) )
	// 	{
	// 		gl.disable( gl.DEPTH_TEST );
	// 	}
	// 	else
	// 	{
	// 		gl.enable( gl.DEPTH_TEST );
	// 	}
	// };
}
