import sqlite3
import datetime
import json

game_db = '/var/jail/home/team48/game1.db'

def request_handler(request):
    if request['method'] == 'POST':
        """
        Front end posts game result at the end of a game; should store the results in a database
        """
        game_id = int(request['form']["game_id"])
        winner = request['form']['winner']
        loser = request['form']['loser']
        
        conn = sqlite3.connect(game_db)  # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # move cursor into database (allows us to execute commands)
        c.execute('''CREATE TABLE IF NOT EXISTS results_table (game_id int, winner text, lower text);''') # run a CREATE TABLE command
        c.execute('''INSERT into results_table VALUES (?,?,?);''', (game_id, winner, loser))
        conn.commit() # commit commands
        conn.close() # close connection to database
        return "Game result stored!"
    
    else:
        game_id = int(request['values']['game_id'])
        conn = sqlite3.connect(game_db)  # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # move cursor into database (allows us to execute commands)
        results = c.execute('''SELECT * FROM results_table WHERE game_id == ?;''',(game_id,)).fetchall()
        conn.commit() # commit commands
        conn.close() # close connection to database
        return results
