// © RRTeam

var cubo_1 = null;
var cubo_2 = null;

function runWebGL(){
	cubo_1 = new CanvasWebGl("modelos/puzzle_cubo/cubo_1.txt", "cubo_1");
	cubo_2 = new CanvasWebGl("modelos/puzzle_cubo/cubo_2.txt", "cubo_2");
}

setEventListeners();
