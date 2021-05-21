// ball class
function Ball(type,x,y) {
	var div = document.createElement("div");
	div.className = type + " ball";
	this.elem = table.appendChild(div);
	this.type = type;
	this.x = x; //x position
	this.y = y;
	this.angle = 0; //angle of velocity
	this.v = 0; //velocity
	setBallPos(this.elem,x,y);
	return this;
}
