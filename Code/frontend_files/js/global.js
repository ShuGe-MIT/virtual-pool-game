//Global variables
var ball_r = 15, //radius of balls
	pkt_d = 25, // diameter of pockets
	table_width = 710, 
	table_height = 454, 
	rail_width =  45, 
	RATE = 100, //call rate of roll
	friction = 0.01, // coefficient of friction
	cllsn_loss = 0.15; // coefficient of collision loss
var table, 
	cueBall,
	guideBall, //invisible ball at the clicked position as guidance
	refLine, //line for shooting reference
	speed = 12,
	rollUp = 0,
	rollRight = 0,
	timer,
	balls = [],
	movingBalls = [],
	pokes = [[0,0],[table_width/2,-5],[table_width,0],[0,table_height],[table_width/2,table_height+5],[table_width,table_height]],
	hasShot = false;
	shots = 0; //number of shots completed by a single player in a roll