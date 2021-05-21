const { log } = require("console");

window.onload = function() {

}

function initGame() {
	initBall();
	addEventHandler(table,"mousemove",dragCueBall);
	addEventHandler(table,"mouseup",setCueBall);
}

function initTable() {
	table = document.getElementById("table");
	var dotWrapDiv = document.createElement("div"),
		guideBallDiv = document.createElement("div");
	dotWrapDiv.id = "refLine";
	guideBallDiv.className = "guide ball";
	setStyle(guideBallDiv,"display","none");
	refLine = table.appendChild(dotWrapDiv);
	guideBall = table.appendChild(guideBallDiv);
}

function initBall() {
	//add cue ball
	cueBall = new Ball("cue",170,table_height/2);
	balls.push(cueBall);
	//add object ball
	var ball_1 = new Ball("target_1",520 + 0*2*ball_r, table_height/2 - ball_r*0 + 0*2*ball_r);
	var ball_2 = new Ball("target_2",520 + 1*2*ball_r, table_height/2 - ball_r*1 + 0*2*ball_r);
	var ball_3 = new Ball("target_3",520 + 1*2*ball_r, table_height/2 - ball_r*1 + 1*2*ball_r);
	var ball_4 = new Ball("target_4",520 + 2*2*ball_r, table_height/2 - ball_r*2 + 0*2*ball_r);
	var ball_5 = new Ball("target_5",520 + 2*2*ball_r, table_height/2 - ball_r*2 + 1*2*ball_r);
	var ball_6 = new Ball("target_6",520 + 2*2*ball_r, table_height/2 - ball_r*2 + 2*2*ball_r);
	var ball_7 = new Ball("target_7",520 + 3*2*ball_r, table_height/2 - ball_r*3 + 0*2*ball_r);
	var ball_8 = new Ball("target_8",520 + 3*2*ball_r, table_height/2 - ball_r*3 + 1*2*ball_r);
	var ball_9 = new Ball("target_9",520 + 3*2*ball_r, table_height/2 - ball_r*3 + 2*2*ball_r);
	var ball_10 = new Ball("target_10",520 + 3*2*ball_r, table_height/2 - ball_r*3 + 3*2*ball_r);
	var ball_11 = new Ball("target_11",520 + 4*2*ball_r, table_height/2 - ball_r*4 + 0*2*ball_r);
	var ball_12 = new Ball("target_12",520 + 4*2*ball_r, table_height/2 - ball_r*4 + 1*2*ball_r);
	var ball_13 = new Ball("target_13",520 + 4*2*ball_r, table_height/2 - ball_r*4 + 2*2*ball_r);
	var ball_14 = new Ball("target_14",520 + 4*2*ball_r, table_height/2 - ball_r*4 + 3*2*ball_r);
	var ball_15 = new Ball("target_15",520 + 4*2*ball_r, table_height/2 - ball_r*4 + 4*2*ball_r);
	balls.push(ball_1);
	balls.push(ball_2);
	balls.push(ball_3);
	balls.push(ball_4);
	balls.push(ball_5);
	balls.push(ball_6);
	balls.push(ball_7);
	balls.push(ball_8);
	balls.push(ball_9);
	balls.push(ball_10);
	balls.push(ball_11);
	balls.push(ball_12);
	balls.push(ball_13);
	balls.push(ball_14);
	balls.push(ball_15);

}

function recoverBall(ball_pos) {
	'use strict';
	//add cue ball
	//add object ball
	for (const [key, value] of Object.entries(ball_pos)) {
		if (key == "cue"){
			cueBall = new Ball(key,value.x,value.y);
			balls.push(cueBall);
		}
		else{
			balls.push(new Ball(key,value.x,value.y));
		}
	}
}


//Player places the cueball to start the game
function dragCueBall(e) {
	var toX,toY;
	toX = e.clientX - table.offsetLeft - rail_width,
	toY = e.clientY - table.offsetTop - rail_width;
	
	toX = toX >= ball_r ? toX : ball_r;
	toX = toX <= 170 ? toX : 170;
	toY = toY >= ball_r ? toY : ball_r;
	toY = toY <= table_height - ball_r ? toY : table_height - ball_r;
		
	setBallPos(cueBall,toX,toY);
}

//Player gets ready to shoot
function setCueBall() {
	removeEventHandler(table,"mousemove",dragCueBall);
	removeEventHandler(table,"mouseup",setCueBall);
	setTimeout(getHit, 1000);
	//startShot();
}

function startShot() {
	show(cueBall.elem);
	//addEventHandler(table,"mousemove",showGuide);
	//addEventHandler(table,"mouseup",shootCueBall);
}

function showGuide(e) {
	var fromX,fromY,toX,toY;
	toX = e.clientX - table.offsetLeft - rail_width,
	toY = e.clientY - table.offsetTop - rail_width;
	setBallPos(guideBall,toX,toY);
	show(refLine);
	drawLine();
	//display reference line
	function drawLine() {
		var dotNum = 16,
			pos = getBallPos(cueBall.elem);
		refLine.innerHTML = "";
		fromX = pos[0];
		fromY = pos[1];
		var partX = (toX - fromX) / dotNum,
			partY = (toY - fromY) / dotNum;
		for(var i = 1; i < dotNum; i++) {
			var x = fromX + partX * i,
				y = fromY + partY * i;
			drawDot(refLine, x, y);
		}		
	}
}



function shootCueBall(e) {
	removeEventHandler(table,"mousemove",showGuide);
	removeEventHandler(table,"mouseup",shootCueBall);
	var fromX,fromY,toX,toY;
	toX = e.clientX - table.offsetLeft - rail_width,
	toY = e.clientY - table.offsetTop - rail_width;
	pos = getBallPos(cueBall.elem);
	fromX = pos[0];
	fromY = pos[1];
	speed =  Math.sqrt(Math.pow(toX-fromX,2) + Math.pow(toY-fromY,2))*0.05;
	var angle = Math.atan2(-toY +fromY,toX -fromX) - 3.1415926535 /2 ;
	hide(refLine);
	hide(guideBall);
	cueBall.v = speed;
	cueBall.angle = angle;
	console.log(angle);
	movingBalls.push(cueBall);
	timer = window.setInterval(roll,1000 / RATE);
}




function inPocket(x,y) {
	if(y < pkt_d) return checkPocket(0,2);
	else if (y > table_height - pkt_d) return checkPocket(3,5);
	else return false;
	
	function checkPocket(m,n) {
		for(var i=m; i<=n; i++) {
			if(x >= pokes[i][0] - pkt_d && x <= pokes[i][0] + pkt_d) {
				var dis = Math.sqrt(Math.pow(x - pokes[i][0],2) + Math.pow(y - pokes[i][1],2));
				if(dis <= pkt_d) return true;
				else return false;
			}
		}	
	} 
	
}

function getBallPos(obj) {
	var pos = [];
	pos.push(obj.offsetLeft - rail_width + ball_r);
	pos.push(obj.offsetTop - rail_width + ball_r);
	return pos;
}


function setBallPos(ball,x,y) {
	if(ball.constructor == Ball) {
		ball.x = x;
		ball.y = y;
		ball = ball.elem;
	}
	setPos(ball,x + rail_width - ball_r,y + rail_width - ball_r);
}


//Display score

function showScore(n) {
	var wrap = $("scoreBoard");
	if(n>1){
	var display = n + " hits!";
	wrap.textContent = display;}
	fadeIn(wrap);
}
var last_hit_time = "";

function getHit() {
var xmlhttp2 = new XMLHttpRequest();
    var url2 = "http://608dev-2.net/sandbox/sc/team48/hitball.py";
    xmlhttp2.onreadystatechange = function() {
     if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
        var response2 = xmlhttp2.responseText;
		console.log(response2);
        var hit_info  = JSON.parse(response2);
        if (hit_info.hit_time != last_hit_time){
			if (last_hit_time == ""){
				cueBall.v = 0;
			}
			else{
				cueBall.v = hit_info.hit_vel * 9.8 /2;
			}
			cueBall.angle = (hit_info.hit_ang/Math.PI + 0.5) * Math.PI;
			console.log(cueBall.angle);
			movingBalls.push(cueBall);
			timer = window.setInterval(roll,1000 / RATE);
			last_hit_time = hit_info.hit_time;
		}
	}
    }
    xmlhttp2.open("GET", url2, true);
	xmlhttp2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp2.send(`game_id=${game_id}&player=${cur_player}}`);
	setTimeout(getHit, 1000);
}

var players;
var cur_player;
var game_id, text;

function set_game() {
    game_id = $("game_id").value;
	players = [$("p1").value, $("p2").value];
    if (isNaN(game_id)|| game_id < 100000 || game_id > 999999) {
        text = "Please enter a 6-digit integer!";
		$("hint").innerHTML = text;
    } 
	else if (players[0].length < 1 || players[1].length < 1){
		text = " Player names can't be blank!"
		$("hint").innerHTML = text;
	}
	else if (players[0].indexOf(" ") != -1 || players[1].indexOf(" ") != -1){
		text = " Player names have no space."
		$("hint").innerHTML = text;
	}
	else{
		startGame(game_id, players);
		// $("start_sec").style.display = "none";
		// $("table").style.display = "block";
		// initTable();
		// initGame();
		// init_cur_player();
		// update_Game();
	} 

}

function init_cur_player(){
	if(Math.random() <0.5){
		cur_player = players[0];
	}
	else{
		cur_player = players[1];
	}
	$("cur_player").innerHTML = `Current player: ${cur_player}`;
	$("cur_player").style.display = "block";
}

function startGame(game_id, players) {
	var game = new XMLHttpRequest();
		var url = "http://608dev-2.net/sandbox/sc/team48/data_get.py";
		game.onreadystatechange = function() {
		if (game.readyState == 4 && game.status == 200) {
			var game_info = JSON.parse(game.responseText);
			if(game_info.is_new){
				$("start_sec").style.display = "none";
				$("table").style.display = "block";
				init_cur_player();
				initTable();
				initGame();
				last_hit_time = "";
				getPlayerRecord(players);
			}
			else if (!game_info.can_start){
				$("hint").innerHTML = game_info.hint;
				//if there is an old game, but player information mismatches
			}
			else{
				$("start_sec").style.display = "none";
				$("table").style.display = "block";
				getPlayerRecord(players);
				//And then load the old game table
				initTable();
				recoverBall(game_info.data.ball_pos);
				cur_player = game_info.data.cur_player;
				players = [game_info.data.player1, game_info.data.player2];
				$("cur_player").innerHTML = `Current player: ${cur_player}`;
				$("cur_player").style.display = "block";
				last_hit_time = "";
				setTimeout(getHit, 1000);

			}
		}
		console.log(game.responseText)
		}
		game.open("POST", url, true);
		game.setRequestHeader('Content-type','application/x-www-form-urlencoded')
		game.send(`game_id=${game_id}&player1=${players[0]}&player2=${players[1]}`);
		}

function update_Game() {
	var updates = new XMLHttpRequest();
		var url = "http://608dev-2.net/sandbox/sc/team48/data_send.py";
		updates.onreadystatechange = function() {
			if (updates.readyState == 4 && updates.status == 200) {
				console.log(updates.responseText);
		}
		}
		updates.open("POST", url, true);
		updates.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		var ball_pos = {}
		for (i = 0; i < balls.length; i++) {
			ball_pos[balls[i].type] = {"x": balls[i].x, "y": balls[i].y};
		}
		var data = {"game_id":game_id,"player1": players[0],"player2":players[1],"cur_player":cur_player, "ball_pos": ball_pos};
		updates.send(JSON.stringify(data));
		
		console.log(JSON.stringify(data));
	}