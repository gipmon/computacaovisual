var deslocamento = 0.01;

function setEventListeners(){
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
      webgl.back.globalAngleXX += radians( 10 * deltaX);
      webgl.back.globalAngleYY += radians( 10 * deltaY);

      webgl.drawScene();


      lastMouseX = newX

      lastMouseY = newY;
    }

}
