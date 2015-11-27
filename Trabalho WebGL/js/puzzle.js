// © RRTeam

var webgl = null;

function runWebGL(){
	webgl = new CanvasWebGl([
													["modelos/puzzle_triangulocubo/triangulo.txt", "triangulo", [0, 0, 0]],
													["modelos/puzzle_triangulocubo/cubo_1.txt", "cubo_1", [-0.3, 0, 0]]
													]);
 	setEventListeners();
}
