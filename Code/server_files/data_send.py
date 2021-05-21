import sqlite3
import datetime
import json

game_db = '/var/jail/home/team48/game1.db'

def request_handler(request):
    if request['method'] == 'POST':
        """
        Front end posts positions of the balls and in_hole after a hit.
        Need to store these information in database
        """
        datastr = request['data']
        data = json.loads(datastr)
        next_player = data["cur_player"].lower()
        game_id = int(data["game_id"])
        conn = sqlite3.connect(game_db)  # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # move cursor into database (allows us to execute commands)
        c.execute('''CREATE TABLE IF NOT EXISTS game_table (game_id int, game_state text, timing timestamp);''') # run a CREATE TABLE command
        c.execute('''CREATE TABLE IF NOT EXISTS next_player_table (game_id int, next_player text, timing timestamp);''') # run a CREATE TABLE command
        c.execute('''INSERT into game_table VALUES (?,?,?);''', (game_id, datastr, datetime.datetime.now()))
        c.execute('''INSERT into next_player_table VALUES (?,?,?);''', (game_id, next_player, datetime.datetime.now()))
        conn.commit() # commit commands
        conn.close() # close connection to database
        return "Game info updated! XD"

    elif request['method'] == 'GET':
        """
        Front end posts positions of the balls and in_hole after a hit.
        Need to store these information in database
        """
        game_id = int(request['values']['game_id'])
        conn = sqlite3.connect(game_db)  # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # move cursor into database (allows us to execute commands)
        c.execute('''CREATE TABLE IF NOT EXISTS game_table (game_id int, game_state text, timing timestamp);''') # run a CREATE TABLE command
        latest_data = c.execute('''SELECT game_state FROM game_table WHERE game_id == ? ORDER BY timing DESC;''',(game_id,)).fetchone()
        # output1 = c.execute('''SELECT * FROM game_table;''').fetchall()
        # output2 = c.execute('''SELECT * FROM next_player_table;''').fetchall()
        # output = 'game_table' + str(output1) + 'next_player_table' + str(output2)
        conn.commit() # commit commands
        conn.close() # close connection to database
        # return output2
        return latest_data
