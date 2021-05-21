// Common functions
function $(str) {
	return document.getElementById(str);
}

function $tag(str,target) {
	target = target || document;
	return target.getElementsByTagName(str);
}

function addEventHandler(obj,eType,fuc){
	if(obj.addEventListener){ 
		obj.addEventListener(eType,fuc,false); 
	}else if(obj.attachEvent){ 
		obj.attachEvent("on" + eType,fuc); 
	}else{ 
		obj["on" + eType] = fuc; 
	} 
} 

function removeEventHandler(obj,eType,fuc){
	if(obj.removeEventListener){ 
		obj.removeEventListener(eType,fuc,false); 
	}else if(obj.attachEvent){ 
		obj.detachEvent("on" + eType,fuc); 
	} 
}

function randowNum(start,end) {
	return Math.floor(Math.random()*(end - start)) + start;
}

Array.prototype.remove=function(dx) {
	if(isNaN(dx)||dx>this.length){return false;}
	for(var i=0,n=0;i<this.length;i++)
	{
		if(this[i]!=this[dx])
		{
			this[n++]=this[i]
		}
	}
	this.length-=1
}

function getElemPos(target,reference) {
	reference = reference || document;
	var left = 0,top = 0;
	return getPos(target);
	function getPos(target) {
		if(target != reference) {
			left += target.offsetLeft;
			top += target.offsetTop;
			return getPos(target.parentNode);
		} else {
			return [left,top];
		}
	}
}

function setStyle() {
	if(arguments.length == 2 &&  typeof arguments[1] == "object") {
		for(var key in arguments[1]) {
			arguments[0].style[key] = arguments[1][key];
		}
	} else if (arguments.length > 2) {
		arguments[0].style[arguments[1]] = arguments[2];
	}
}

function setPos(obj,x,y) {
	obj.style.left = x + "px";
	obj.style.top = y + "px";
}


function show(obj) {
	setStyle(obj,"display","block");
}

function hide(obj) {
	setStyle(obj,"display","none");
}

function drawDot(wrap,x,y) {
	var elem = document.createElement("div");
	setStyle(elem,{
		position: "absolute",
		width: "3px",
		height: "3px",
		fontSize: "3px",
		background: "black"
	});
	setPos(elem,x,y);
	wrap.appendChild(elem);
}

function fadeIn(obj){
	var fromY = 230,
		posStep = [8,14,19,23,26,28,29,29,30,30,30],
		opaStep = [0,0.05,0.1,0.15,0.2,0.25,0.3,0.4,0.5,0.6,0.8],
		fromOpa = 0,
		t = 0,
		step = posStep.length,
		inTimer = window.setInterval(showIn,20),
		outTimer;
	
	function showIn() {
		setOpacity(obj,opaStep[t]);
		obj.style.top = fromY + posStep[t] + "px";
		t++;
		if(t>=step) {
			window.clearInterval(inTimer);
			outTimer = window.setInterval(fadeOut,50);
		}	
	}
	
	function fadeOut() {
		t--;
		setOpacity(obj,opaStep[t]);
		obj.style.top = fromY + posStep[t] + "px";
		if(t <= 0) {
			window.clearInterval(outTimer);
			hide(obj);
		}
	}
	
}

function setOpacity(obj,n) {
	obj.style.cssText = "filter:alpha(opacity="+ n*100 +"); -moz-opacity:"+ n +"; opacity:"+ n;
}