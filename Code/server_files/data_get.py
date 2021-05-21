import sqlite3
import datetime
import json

game_db = '/var/jail/home/team48/game1.db'

def request_handler(request):
    if request['method'] == 'POST':
        game_id = int(request['form']['game_id'])
        player_1 = request['form']['player1'].lower()
        player_2 = request['form']['player2'].lower()
        conn = sqlite3.connect(game_db)  # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # move cursor into database (allows us to execute commands)
        c.execute('''CREATE TABLE IF NOT EXISTS player_table (game_id int, player_1 text, player_2 text);''') # run a CREATE TABLE command
        
        joined_users = c.execute('''SELECT * FROM player_table WHERE game_id == ?;''',(game_id,)).fetchall()
        # return joined_users
        output = c.execute('''SELECT * FROM player_table;''').fetchall()
        # return output

        if len(joined_users) == 0:
            # return 'hi'
            c.execute('''INSERT into player_table VALUES (?,?,?);''', (game_id, player_1, player_2))
            output_data = {"is_new": True, "can_start": True, "data":[], "hint": "New game started."}
            
        if len(joined_users) > 0:
            # need to get all ball positions from database
            latest_data = c.execute('''SELECT game_state FROM game_table WHERE game_id == ? ORDER BY timing DESC;''',(game_id,)).fetchone()
            
            output_data = {"is_new": False, "can_start": True, "data": json.loads(latest_data[0]), "hint": "Old game loaded."}
        
        conn.commit() # commit commands
        conn.close() # close connection to database
        return json.dumps(output_data)