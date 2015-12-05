var deslocamento = 0.01;
var angle = 45;

function setEventListeners(){
  $("#confetti").hide();
  $("#nextLevel").hide();

  var timeoutGoAnimation = null;

  $("a[data-toggle='nextLevel']").click(function(){
    var puzzleName = $(this).attr("href").replace("#", "");

    for(var i=0; i<puzzles.length; i++){
      if(puzzles[i].humanName==puzzleName){
        break;
      }
    }

    selectedPuzzle = i;

    $("#aBtn").removeClass("success-circle-button");
    $("#aBtn").addClass("orange-circle-button");
    $("#spanBtn").removeClass("succcess-circle-greater-than");
    $("#spanBtn").addClass("orange-circle-greater-than");

    $("body").unbind();
  	webgl = new CanvasWebGl(puzzles[selectedPuzzle]);
   	setScreenPuzzle(puzzles[selectedPuzzle]);
  	//setEventListeners();
  });

  $("#nextLevelBtn").click(function(){
    $("#nextLevel").hide();
		$("#confetti").hide();
		confetti.stop();

    $("#aBtn").removeClass("success-circle-button");
    $("#aBtn").addClass("orange-circle-button");
    $("#spanBtn").removeClass("succcess-circle-greater-than");
    $("#spanBtn").addClass("orange-circle-greater-than");

    // go to the next level
    selectedPuzzle = ++selectedPuzzle;
    $("body").unbind();
  	webgl = new CanvasWebGl(puzzles[selectedPuzzle]);
   	setScreenPuzzle(puzzles[selectedPuzzle]);
  	//setEventListeners();
  });

  (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id))
          return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_EN/all.js";
      fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  window.fbAsyncInit = function() {
      FB.init({
          appId: '1121300931213333',
          status: true,
          xfbml: true,
          cookie: true
      });
  };

  $('#aBtn').click(function() {
      FB.ui({
          method: 'feed',
          name: 'I made '+$("#score").text()+' points in the Puzzle game!',
          link: 'http://puzzle.rafaelferreira.pt/',
          picture: 'http://puzzle-gustdev.rhcloud.com/img/logo.png',
          description: 'The Puzzle is a game made by two students from the University of Aveiro for the course Visual Computation. Made by Rafael Ferreira and Rodrigo Cunha'
      });
  });

  $('#endLevelsBtn').click(function() {
      $("#endLevels").hide();
  		$("#confetti").hide();
  		confetti.stop();

      FB.ui({
          method: 'feed',
          name: 'I just finished all the puzzles of the Puzzle game!',
          link: 'http://puzzle.rafaelferreira.pt/',
          picture: 'http://puzzle-gustdev.rhcloud.com/img/logo.png',
          description: 'The Puzzle is a game made by two students from the University of Aveiro for the course Visual Computation. Made by Rafael Ferreira and Rodrigo Cunha'
      });
  });

  $("#pausePosition").click(function(){
    clearInterval(timeoutGoAnimation);
    $(this).hide();
    $("#correctPosition").show();
  });

  $("#correctPosition").click(function(){
    var intervalTime = 100;

    $(this).hide();
    $("#pausePosition").show();

    timeoutGoAnimation = setInterval(function () {
      if(webgl.models[selectedCube].tx.round(2) > webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.tx){
        webgl.models[selectedCube].tx -= deslocamento;
        webgl.drawScene();
        updateFigurePosition();
      }else if (webgl.models[selectedCube].tx.round(2) < webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.tx) {
        webgl.models[selectedCube].tx += deslocamento;
        webgl.drawScene();
        updateFigurePosition();
      }else if(webgl.models[selectedCube].ty.round(2) > webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.ty){
        webgl.models[selectedCube].ty -= deslocamento;
        webgl.drawScene();
        updateFigurePosition();
      }else if (webgl.models[selectedCube].ty.round(2) < webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.ty) {
        webgl.models[selectedCube].ty += deslocamento;
        webgl.drawScene();
        updateFigurePosition();
      }else if(webgl.models[selectedCube].tz.round(2) > webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.tz){
        webgl.models[selectedCube].tz -= deslocamento;
        webgl.drawScene();
        updateFigurePosition();
      }else if (webgl.models[selectedCube].tz.round(2) < webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.tz) {
        webgl.models[selectedCube].tz += deslocamento;
        webgl.drawScene();
        updateFigurePosition();
      }else if (webgl.models[selectedCube].angleXX < webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.angleXX) {
        webgl.models[selectedCube].angleXX = (webgl.models[selectedCube].angleXX + angle) % 360;
        webgl.drawScene();
        updateFigurePosition();
      }else if (webgl.models[selectedCube].angleYY < webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.angleYY) {
        webgl.models[selectedCube].angleYY = (webgl.models[selectedCube].angleYY + angle) % 360;
        webgl.drawScene();
        updateFigurePosition();
      }else if (webgl.models[selectedCube].angleZZ < webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.angleZZ) {
        webgl.models[selectedCube].angleZZ = (webgl.models[selectedCube].angleZZ + angle) % 360;
        webgl.drawScene();
        updateFigurePosition();
      }else if (webgl.models[selectedCube].angleXX > webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.angleXX) {
        webgl.models[selectedCube].angleXX = (webgl.models[selectedCube].angleXX - angle) % 360;
        webgl.drawScene();
        updateFigurePosition();
      }else if (webgl.models[selectedCube].angleYY > webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.angleYY) {
        webgl.models[selectedCube].angleYY = (webgl.models[selectedCube].angleYY - angle) % 360;
        webgl.drawScene();
        updateFigurePosition();
      }else if (webgl.models[selectedCube].angleZZ > webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.angleZZ) {
        webgl.models[selectedCube].angleZZ = (webgl.models[selectedCube].angleZZ - angle) % 360;
        webgl.drawScene();
        updateFigurePosition();
      }else{
        clearInterval(timeoutGoAnimation);
        $("#pausePosition").hide();
        $("#correctPosition").show();
      }
    }, intervalTime);
  });

  $("#xM45").click(function(){
    webgl.models[selectedCube].angleXX = (webgl.models[selectedCube].angleXX + angle) % 360;
    webgl.drawScene();
    updateFigurePosition();
  });

  $("#xm45").click(function(){
    webgl.models[selectedCube].angleXX = (webgl.models[selectedCube].angleXX - angle) % 360;
    webgl.drawScene();
    updateFigurePosition();
  });

  $("#yM45").click(function(){
    webgl.models[selectedCube].angleYY = (webgl.models[selectedCube].angleYY + angle) % 360;
    webgl.drawScene();
    updateFigurePosition();
  });

  $("#ym45").click(function(){
    webgl.models[selectedCube].angleYY  = (webgl.models[selectedCube].angleYY - angle) % 360;
    webgl.drawScene();
    updateFigurePosition();
  });

  $("#zM45").click(function(){
    webgl.models[selectedCube].angleZZ = (webgl.models[selectedCube].angleZZ + angle) % 360;
    webgl.drawScene();
    updateFigurePosition();
  });

  $("#zm45").click(function(){
    webgl.models[selectedCube].angleZZ  = (webgl.models[selectedCube].angleZZ - angle) % 360;
    webgl.drawScene();
    updateFigurePosition();
  });

  $("#resetLevel").click(function(){
    webgl.resetValues();
    for(var model in webgl.models){
      webgl.models[model].globalAngleXX = 0.0;
      webgl.models[model].globalAngleYY = 0.0;

    }
    webgl.back.globalAngleXX = 0.0;
    webgl.back.globalAngleYY = 0.0;
    setScreenPuzzle(puzzles[selectedPuzzle]);
    $("#score").text(parseInt($("#score").text())+1);
    webgl.drawScene();
    updateFigurePosition();
  });

  $("#resetValues").click(function(){
    webgl.models[selectedCube].resetValues();
    webgl.drawScene();
    updateFigurePosition();
  });

  $("#zoomm").click(function(){
    webgl.globalTz -= 0.1
    webgl.drawScene();
  });

  $("#zoomM").click(function(){
    webgl.globalTz += 0.1
    webgl.drawScene();
  });

  // keydown events

  var map = {37: false, // left key
             38: false, // up key
             39: false, // right key
             40: false, // down key
             90: false, // z key
            };

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
            updateFigurePosition();
          }
          return false;
        }else if (map[90] && map[40]) {
          if(testConditionScreen(webgl.models[selectedCube].tz, -1)){
            webgl.models[selectedCube].tz -= deslocamento;
            webgl.drawScene();
            updateFigurePosition();
          }
          return false;
        }else if (map[37]){ // left
          if(testConditionScreen(webgl.models[selectedCube].tx, -1)){
            webgl.models[selectedCube].tx -= deslocamento;
            webgl.drawScene();
            updateFigurePosition();
          }
          return false;
        }else if (map[38]) { // up
          if(testConditionScreen(webgl.models[selectedCube].ty, 1)){
            webgl.models[selectedCube].ty += deslocamento;
            webgl.drawScene();
            updateFigurePosition();
          }
          return false;
        }else if (map[39]) { // right
          if(testConditionScreen(webgl.models[selectedCube].tx, 1)){
            webgl.models[selectedCube].tx += deslocamento;
            webgl.drawScene();
            updateFigurePosition();
          }
          return false;
        }else if (map[40]) { // down
          if(testConditionScreen(webgl.models[selectedCube].ty, -1)){
            webgl.models[selectedCube].ty -= deslocamento;
            webgl.drawScene();
            updateFigurePosition();
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
