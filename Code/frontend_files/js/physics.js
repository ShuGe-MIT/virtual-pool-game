function roll() {
	if(movingBalls.length <= 0) {
		if(!hasShot) shots = 0;
		else shots ++; //count number of shots
		hasShot = false;
        window.clearInterval(timer);
		if(shots >= 1)
		{
			showScore(shots); //display number of shots
			$("remark").style.display = "block";
		}
		else{
			if(cur_player == players[0]){
				cur_player = players[1];
			}
			else{
				cur_player = players[0];
			}
			$("cur_player").innerHTML = `Current player: ${cur_player}`;
			$("remark").style.display = "none";
		}
		update_Game();
		startShot();
	}
    //balls in motion
	for(var i = 0; i < movingBalls.length; i++) {
		var ball = movingBalls[i],
			sin = Math.sin(ball.angle),
			cos = Math.cos(ball.angle);
		ball.v -= friction;
        //remove balls that are still
		if(Math.round(ball.v) == 0) {
			ball.v = 0;
			movingBalls.remove(i);
			continue;	
		}
        //move ball
		var vx = ball.v * sin,
			vy = ball.v * cos;
		ball.x += vx;
		ball.y += vy;
				
		//detect whether the ball goes into a pocket
        ball_in_Pocket(ball);

		//detect ball's collision with the rails
        ball_cllsn_rail(ball);

        //ball's collision with other balls
		for(var j = 0; j < balls.length; j++) {
			var obj = balls[j];
			if(obj == ball) continue;
			var disX = obj.x - ball.x,
				disY = obj.y - ball.y,
				gap = 2 * ball_r;
			if(disX <= gap && disY <= gap) {
				var dis = Math.sqrt(Math.pow(disX,2)+Math.pow(disY,2));
				if(dis <= gap) {

					//if the hitted ball is still, add to moving list
					if(Math.round(obj.v) == 0)	
					movingBalls.push(obj);
					
					//simulate collision on edge
					ball.x -= (gap - dis)*sin;
					ball.y -= (gap - dis)*cos;
					disX = obj.x - ball.x;
					disY = obj.y - ball.y;
					
					// calculate angles
					var angle = Math.atan2(disY, disX),
						hitsin = Math.sin(angle),
						hitcos = Math.cos(angle),
						objVx = obj.v * Math.sin(obj.angle),
						objVy = obj.v * Math.cos(obj.angle);
						//trace(angle*180/Math.PI);
						
					// rotate
					var x1 = 0,
						y1 = 0,
						x2 = disX * hitcos + disY * hitsin,
						y2 = disY * hitcos - disX * hitsin,
						vx1 = vx * hitcos + vy * hitsin,
						vy1 = vy * hitcos - vx * hitsin,
						vx2 = objVx * hitcos + objVy * hitsin,
						vy2 = objVy * hitcos - objVx * hitsin;
					
					//velocity and position after collision
					var plusVx = vx1 - vx2;
					vx1 = vx2;
					vx2 = plusVx + vx1;
					
					//cueball rotation
					if(ball.type == "cue")	{
						vx1 += rollUp;
						rollUp *= 0.2;
					}				
					
					x1 += vx1;
					x2 += vx2;
					
					// rotate back position
					var x1Final = x1 * hitcos - y1 * hitsin,
						y1Final = y1 * hitcos + x1 * hitsin,
						x2Final = x2 * hitcos - y2 * hitsin,
						y2Final = y2 * hitcos + x2 * hitsin;
					obj.x = ball.x + x2Final;
					obj.y = ball.y + y2Final;
					ball.x = ball.x + x1Final;
					ball.y = ball.y + y1Final;
					
					// rotate back velocity
					vx = vx1 * hitcos - vy1 * hitsin;
					vy = vy1 * hitcos + vx1 * hitsin;
					objVx = vx2 * hitcos - vy2 * hitsin;
					objVy = vy2 * hitcos + vx2 * hitsin; 
					
					//final celocity
					ball.v = Math.sqrt(vx*vx + vy*vy) * (1 - 0);
					obj.v = Math.sqrt(objVx*objVx + objVy*objVy) * (1 - 0);
					
					// final angle
					ball.angle = Math.atan2(vx , vy);
					obj.angle = Math.atan2(objVx , objVy);	

				}
			}
		}					
		setBallPos(ball,ball.x,ball.y);	
	}
}

function ball_in_Pocket(ball){
    if(inPocket(ball.x,ball.y)) {
        hide(ball.elem);
        if(ball.type == "cue") {
                if(!hasShot) shots = 0;
                hasShot = false;
            	window.setTimeout(function(){
                ball.v = 0;	
                setBallPos(ball,170,250);
                
            },500);
        }else {
			if (ball.type == "target_8" && balls.length != 1){
				var winner = (players[0]== cur_player) ? players[1] : players[0];
				restartGame(winner, cur_player);
			}
            //remove in-pocket balls
			else{
            hasShot = true;
            ball.v = 0;	
            for(var k = 0, l =0; k < balls.length; k++) {
                if(balls[k] != ball) {
                    balls[l++] = balls[k];
                }
            }
            balls.length -= 1;
			if (balls.length == 0){
				var loser = (players[0]== cur_player) ? players[1] : players[0];
				restartGame(cur_player, loser);
				//alert(`Congratulations ${cur_player}! You win!`);
			}
		}
        }
        return;
    }
}


function restartGame(winner, loser) {
	updatePlayerRecord(winner, loser);
	if (confirm(`Congratulations ${winner}! You win! Wanna play again?`)) {
		if (confirm("Redirect to a new game?")) {
			location.reload();
		}
	} else {
		if (confirm("Close Window?")) {
			close();
		}
	}
}

function updatePlayerRecord(winner, loser) {
	var updates = new XMLHttpRequest();
	var url = "http://608dev-2.net/sandbox/sc/team48/result_post.py";
	updates.onreadystatechange = function() {
		if (updates.readyState == 4 && updates.status == 200) {
			console.log(updates.responseText);
	}
	}
	updates.open("POST", url, true);
	updates.setRequestHeader('Content-type','application/x-www-form-urlencoded')
	updates.send(`game_id=${game_id}&winner=${winner}&loser=${loser}`);
	
}


function getPlayerRecord(players) {
	var record = new XMLHttpRequest();
		var url = "http://608dev-2.net/sandbox/sc/team48/player_data.py";
		record.onreadystatechange = function() {
			if (record.readyState == 4 && record.status == 200) {
				console.log(record.responseText);
				var playerRecord = JSON.parse(record.responseText);
				var p1r= playerRecord.player1;
				var p2r= playerRecord.player2;
				var x = $("recordTable").rows[1].cells;
				x[0].innerHTML = p1r.playerName;
				x[1].innerHTML = `${p1r.gamePlayed}`;
				x[2].innerHTML = (p1r.gamePlayed != 0) ?`${Math.floor(p1r.gameWinned/p1r.gamePlayed * 100)}` : `???`;
				x = $("recordTable").rows[2].cells;
				x[0].innerHTML = p2r.playerName;
				x[1].innerHTML = `${p2r.gamePlayed}`;
				x[2].innerHTML = (p2r.gamePlayed != 0) ?`${Math.floor(p2r.gameWinned/p2r.gamePlayed * 100)}` : `???`;
			
				$("recordTable").style.display = "block";
		}
		}
		record.open("POST", url, true);
		record.setRequestHeader('Content-type','application/x-www-form-urlencoded')
		record.send(`player1=${players[0]}&player2=${players[1]}`);
		
	}


function ball_cllsn_rail(ball){
    if(ball.x < ball_r || ball.x > table_width - ball_r) {
        ball.angle *= -1;
        ball.angle %= Math.PI;
        ball.v = ball.v * (1 - cllsn_loss);
        vx = ball.v*Math.sin(ball.angle);
        vy = ball.v*Math.cos(ball.angle);
        if(ball.x < ball_r) ball.x = ball_r;
        if(ball.x > table_width - ball_r) ball.x = table_width - ball_r;			
    }
    if(ball.y < ball_r || ball.y > table_height - ball_r) {
        ball.angle = ball.angle > 0 ? Math.PI - ball.angle : - Math.PI - ball.angle ;
        ball.angle %= Math.PI;
        ball.v = ball.v * (1 - cllsn_loss);
        vx = ball.v*Math.sin(ball.angle);
        vy = ball.v*Math.cos(ball.angle);
        if(ball.y < ball_r) ball.y = ball_r;
        if(ball.y > table_height - ball_r) ball.y = table_height - ball_r;						
    }
}

