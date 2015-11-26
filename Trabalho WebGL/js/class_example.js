// Constructor
function Foo(bar) {
  // always initialize all instance properties
  this.bar = bar;
  this.baz = 'baz'; // default value
}

// class methods
Foo.prototype.fooBar = function() {
	return this.bar;
};
Foo.prototype.print = function(){
	console.log("print");
}
Foo.prototype.setBar = function(set) {
	this.print();
	return this.bar = set;
};

var object = new Foo('Hello');

object.setBar("ok");
console.log(object.fooBar());
