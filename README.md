# virtual-pool-game
Play virtual pool game using ESP32 and website display

Introduction:
=======================================================================================
This project is a virtual pool game that allows two players to game together at different locations. Each of them simply needs an ESP32 to perform cue hits. They can also have a laptop to display the webpage, but this is optional, and it is just to see the animation of the balls moving after a shot.

Video Demo:
---------------------------------------------------------------------------------------
https://youtu.be/dQsGcX01YW8

In this video, we first access the front end webpage to enter a gameid and usernames of the two players. This lets us view the pool table on the webpage.

Then, each of the players keys in their username and the gameid on the ESP32. They take turns hitting the ball -- when it is their turn, the pool table will load on the screen. Otherwise, there will be a message -- "Waiting for other player..." displayed. Notice that if a player fails to hit any ball in or pockets the cue ball, it will be the other player's turn. Otherwise, if they pocket a ball, the next turn is still theirs. Also, when the cue ball is pocketed, it reappears on the table. 

To hit the ball, the players rotate the ESP32 to change the angle of the cue stick and press the button to select the angle. After that, they hit the cue ball by mimicing a cue shot and pushing the ESP32 forward. The hit is then registered on the front end, and we see the animation displayed on the screen.

When the game ends, there is a pop-up on the webpage saying that the game ended, and both players' ESP32 restarts automatically.

Technical Overview:
=======================================================================================
System block diagram
---------------------------------------------------------------------------------------
<figure>
    <img src="https://i.ibb.co/Q6dwh8N/189139048-1775900755926274-4292546695778922304-n-1.png"
     style="float: left; margin-right: 10px;" />
    <figcaption style="text-align: center;font-weight:bold;">
        block diagram
    </figcaption>
</figure>

During gameplay, after a hit, the ESP sends a POST request to the server, consisting of (username, gameid, stick_velocity, stick_angle). The server stores this tuplet in the database. 

The front end makes periodic GET requests to the server to check for new hits. Once a new hit is stored in the database, the front end can retrieve it and simulate the ball hit, and this will be animated on the webpage. Then, after the simulation is complete, the front end sends a POST request to the server consisting of a json string with information on the ball positions and who the next player is. The string is stored in the database. 

After the hit, the ESP makes periodic GET requests to the server to check if there is a new string in the database. It parses the json string to check if it is the next player -- if it is, it displays the balls on a mini pool table on the LCD screen, and allows the player to make the next hit.


Parts List
---------------------------------------------------------------------------------------
* ESP32
* IMU
* Buzzer
* LCD Screen
* Buttons
