var selectedCube = null;

function setScreenPuzzle(puzzle){
  var classes = ["info", "warning", "success", "default"];
  var classes_i = 0;

  selectedCube = puzzle.pieces[0].alias;

  $("#btns").html("");

  for(var i=0; i<puzzle.pieces.length; i++){
    $("#btns").append('<button id="'+ puzzle.pieces[i].alias + 'Btn" class="btn btn-'+classes[classes_i]+' btn-md btn3d">'+puzzle.pieces[i].humanName+'</button>');

    classes_i = (classes_i + 1) % classes.length;

    $("#" + puzzle.pieces[i].alias + "Btn").click(function(){
      selectedCube = $(this).attr("id").replace("Btn", "");
    });
  }

  $("#informationNotice").show();
  $("#successNotice").hide();
}
