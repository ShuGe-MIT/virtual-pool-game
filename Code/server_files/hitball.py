import sqlite3
#from main import ball, player, game
#from util import Vector
import json
import datetime

#game_db = '/game.db'
# hit_db = '/var/jail/home/team48/hit.db'
hit_db = '/var/jail/home/team48/game1.db'
    
def request_handler(request):
    if request['method'] == 'POST':
        # ESP32 posts initial velocities --> game id, ball to hit, velocity
        if request["content-type"] == "application/x-www-form-urlencoded":
            game_id = int(request["form"]["game_id"])
            velocity= float(request["form"]["stick_vel"])
            angle= float(request["form"]["stick_ang"])
            player = request["form"]["username"].lower()
        

        #SQL
        conn = sqlite3.connect(hit_db)
        c = conn.cursor()  # move cursor into database (allows us to execute commands)
        c.execute('''CREATE TABLE IF NOT EXISTS hit_table (game_id int, player text, vel real, ang real, hit_time timestamp);''') 
        correct_player = c.execute('''SELECT next_player FROM next_player_table WHERE game_id == ? ORDER BY timing DESC;''',(game_id,)).fetchone()[0]
        # return (player, correct_player)

        if player == correct_player:
            # return 'hi'
            c.execute('''INSERT into hit_table VALUES (?,?,?,?,?);''', (game_id, player, velocity, angle, datetime.datetime.now() ))
        else:
            conn.commit() # commit commands
            conn.close() # close connection to database
            return "Please wait for your turn."

        conn.commit() # commit commands
        conn.close() # close connection to database
        return "Hit info sent!"
    else:
        conn = sqlite3.connect(hit_db)
        c = conn.cursor()

        last_hit = c.execute('''SELECT * FROM hit_table ORDER BY hit_time DESC;''',).fetchone()

        conn.commit() # commit commands
        conn.close()
        hit_data = {"game_id": last_hit[0], "user_name": last_hit[1], "hit_vel": last_hit[2], "hit_ang": last_hit[3], "hit_time": last_hit[4]}
        return json.dumps(hit_data)
