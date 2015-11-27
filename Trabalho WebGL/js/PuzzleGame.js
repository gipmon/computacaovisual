// © RRTeam

var webgl = null;

// first puzzle

var puzzle1 = new Puzzle("img/puzzles/puzzle1.png");

puzzle1.addPiece(new Piece("modelos/puzzle_triangulocubo/triangulo.txt",
													 "triangulo",
												 	 "Triângulo",
												 	 [0, 0, 0],
												   [0, 0, 0]));

puzzle1.addPiece(new Piece("modelos/puzzle_triangulocubo/cubo_1.txt",
													 "cubo_1",
												 	 "Cubo",
												 	 [-0.2, 0, 0],
												   [0, 0, 0]));

function runWebGL(){
	webgl = new CanvasWebGl(puzzle1);
 	setScreenPuzzle(puzzle1);
	setEventListeners();
}
