var deslocamento = 0.01;

function setEventListeners(){
  var selectedCube = "triangulo";

  $("#trianguloBtn").click(function(){
    selectedCube = "triangulo";
  });

  $("#cuboBtn").click(function(){
    selectedCube = "cubo_1";
  });

  var angle = 45;

  $("#xM45").click(function(){
    webgl.models[selectedCube].angleXX += angle;
    webgl.drawScene();
  });

  $("#xm45").click(function(){
    webgl.models[selectedCube].angleXX -= angle;
    webgl.drawScene();
  });

  $("#yM45").click(function(){
    webgl.models[selectedCube].angleYY += angle;
    webgl.drawScene();
  });

  $("#ym45").click(function(){
    webgl.models[selectedCube].angleYY -= angle;
    webgl.drawScene();
  });

  $("#zM45").click(function(){
    webgl.models[selectedCube].angleZZ += angle;
    webgl.drawScene();
  });

  $("#zm45").click(function(){
    webgl.models[selectedCube].angleZZ -= angle;
    webgl.drawScene();
  });

  // keydown events

  var map = {37: false, // left key
             38: false, // up key
             39: false, // right key
             40: false, // down key
             90: false, // z key
            };

  // deslocamento
  $(document).on('click', '.number-spinner button', function () {
    deslocamento = 0.01 * $("#desc").val();
  });

  $(document).keydown(function(e) {
    function testConditionScreen(coordinate, increment){
      return coordinate+increment*deslocamento >= -0.98 && coordinate+increment*deslocamento <= 0.98;
    }

    if (e.keyCode in map) {
        map[e.keyCode] = true;
        if (map[90] && map[38]) {
          if(testConditionScreen(webgl.models[selectedCube].tz, 1)){
            webgl.models[selectedCube].tz += deslocamento;
            webgl.drawScene();
          }
          return false;
        }else if (map[90] && map[40]) {
          if(testConditionScreen(webgl.models[selectedCube].tz, -1)){
            webgl.models[selectedCube].tz -= deslocamento;
            webgl.drawScene();
          }
          return false;
        }else if (map[37]){ // left
          if(testConditionScreen(webgl.models[selectedCube].tx, -1)){
            webgl.models[selectedCube].tx -= deslocamento;
            webgl.drawScene();
          }
          return false;
        }else if (map[38]) { // up
          if(testConditionScreen(webgl.models[selectedCube].ty, 1)){
            webgl.models[selectedCube].ty += deslocamento;
            webgl.drawScene();
          }
          return false;
        }else if (map[39]) { // right
          if(testConditionScreen(webgl.models[selectedCube].tx, 1)){
            webgl.models[selectedCube].tx += deslocamento;
            webgl.drawScene();
          }
          return false;
        }else if (map[40]) { // down
          if(testConditionScreen(webgl.models[selectedCube].ty, -1)){
            webgl.models[selectedCube].ty -= deslocamento;
            webgl.drawScene();
          }
          return false;
        }
    }
  }).keyup(function(e) {
      if (e.keyCode in map) {
          map[e.keyCode] = false;
      }
  });

  webgl.canvas.onmousedown = handleMouseDown;

  document.onmouseup = handleMouseUp;

  document.onmousemove = handleMouseMove;

  var mouseDown = false;

  var lastMouseX = null;

  var lastMouseY = null;

  function handleMouseDown(event) {

      mouseDown = true;

      lastMouseX = event.clientX;

      lastMouseY = event.clientY;
  }

  function handleMouseUp(event) {

      mouseDown = false;
  }

  function handleMouseMove(event) {

      if (!mouseDown) {

        return;
      }

      // Rotation angles proportional to cursor displacement

      var newX = event.clientX;

      var newY = event.clientY;

      var deltaX = newX - lastMouseX;

      var deltaY = newY - lastMouseY;

      for(var model in webgl.models){
        webgl.models[model].globalAngleXX += radians( 10 * deltaX);
        webgl.models[model].globalAngleYY += radians( 10 * deltaY);
      }

      webgl.drawScene();


      lastMouseX = newX

      lastMouseY = newY;
    }

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
