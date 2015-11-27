// © RRTeam

function Piece(url, alias, humanName, initialPosition, finalPosition){
	this.url = url;
	this.alias = alias;
	this.initialPosition = initialPosition;
	this.humanName = humanName;
	this.finalPosition = finalPosition;
}

function Puzzle(image){
	this.image = image;
	this.pieces = [];
}


Puzzle.prototype.addPiece = function(piece){
	this.pieces.push(piece);
};
