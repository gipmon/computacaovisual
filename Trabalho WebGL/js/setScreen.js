var selectedCube = null;

function setScreenPuzzle(puzzle){
  var classes = ["info", "warning", "success", "default"];
  var classes_i = 0;

  $("#puzzleImg").attr("src", puzzle.image);
  $("#puzzleImgModal").attr("src", puzzle.image);
  
  selectedCube = puzzle.pieces[0].alias;

  $("#btns").html("");

  for(var i=0; i<puzzle.pieces.length; i++){
    $("#btns").append('<button id="'+ puzzle.pieces[i].alias + 'Btn" class="btn btn-'+classes[classes_i]+' btn-sm btn3d">'+puzzle.pieces[i].humanName+'</button>');

    classes_i = (classes_i + 1) % classes.length;

    $("#" + puzzle.pieces[i].alias + "Btn").click(function(){
      $('#'+ selectedCube +'Btn').addClass("btn3d");
      $('#'+ selectedCube +'Btn').removeClass("btn3ddisabled");
      $('#'+ selectedCube +'Btn').prop('disabled', false);

      selectedCube = $(this).attr("id").replace("Btn", "");

      $('#'+ selectedCube +'Btn').removeClass("btn3d");
      $('#'+ selectedCube +'Btn').addClass("btn3ddisabled");
      $('#'+ selectedCube +'Btn').prop('disabled', true);

      updateFigurePosition();
    });
  }

  $('#'+ selectedCube +'Btn').removeClass("btn3d");
  $('#'+ selectedCube +'Btn').addClass("btn3ddisabled");
  $('#'+ selectedCube +'Btn').prop('disabled', true);

  updateFigurePosition();
  $("#informationNotice").show();
  $("#successNotice").hide();
}

function updateFigurePosition(){
  $("#angleX").attr("value", webgl.models[selectedCube].angleXX);
  $("#angleY").attr("value", webgl.models[selectedCube].angleYY);
  $("#angleZ").attr("value", webgl.models[selectedCube].angleZZ);
  $("#posX").attr("value", webgl.models[selectedCube].tx.round(2));
  $("#posY").attr("value", webgl.models[selectedCube].ty.round(2));
  $("#posZ").attr("value", webgl.models[selectedCube].tz.round(2));

  // background
  if(webgl.models[selectedCube].angleXX == webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.angleXX){
    $("#angleX").removeClass("input-danger");
    $("#angleX").addClass("input-green");
  }else{
    $("#angleX").addClass("input-danger");
    $("#angleX").removeClass("input-green");
  }

  if(webgl.models[selectedCube].angleYY == webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.angleYY){
    $("#angleY").removeClass("input-danger");
    $("#angleY").addClass("input-green");
  }else{
    $("#angleY").addClass("input-danger");
    $("#angleY").removeClass("input-green");
  }

  if(webgl.models[selectedCube].angleZZ == webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.angleZZ){
    $("#angleZ").removeClass("input-danger");
    $("#angleZ").addClass("input-green");
  }else{
    $("#angleZ").addClass("input-danger");
    $("#angleZ").removeClass("input-green");
  }

  if(webgl.models[selectedCube].tx.round(2) == webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.tx){
    $("#posX").removeClass("input-danger");
    $("#posX").addClass("input-green");
  }else{
    $("#posX").addClass("input-danger");
    $("#posX").removeClass("input-green");
  }

  if(webgl.models[selectedCube].ty.round(2) == webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.ty){
    $("#posY").removeClass("input-danger");
    $("#posY").addClass("input-green");
  }else{
    $("#posY").addClass("input-danger");
    $("#posY").removeClass("input-green");
  }

  if(webgl.models[selectedCube].tz.round(2) == webgl.puzzle.pieces[webgl.models[selectedCube].i].finalPosition.tz){
    $("#posZ").removeClass("input-danger");
    $("#posZ").addClass("input-green");
  }else{
    $("#posZ").addClass("input-danger");
    $("#posZ").removeClass("input-green");
  }
}
