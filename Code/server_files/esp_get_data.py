import sqlite3
import datetime
import json

game_db = '/var/jail/home/team48/game1.db'

def request_handler(request):
    game_id = int(request['values']['game_id'])
    username = request['values']['username']
    conn = sqlite3.connect(game_db)  # connect to that database (will create if it doesn't already exist)
    c = conn.cursor()  # move cursor into database (allows us to execute commands)
    c.execute('''CREATE TABLE IF NOT EXISTS game_table (game_id int, game_state text, timing timestamp);''') # run a CREATE TABLE command
    latest_data = c.execute('''SELECT game_state FROM game_table WHERE game_id == ? ORDER BY timing DESC;''',(game_id,)).fetchone()[0]
    data=json.loads(latest_data)
    send={}
    send["cur_player"]=data["cur_player"]
    string=""
    for ball in data["ball_pos"]:
        string=string+str(127-int(data["ball_pos"][ball]["y"]/540*127))+","+str(int(data["ball_pos"][ball]["x"]/800*159))+"&"
    send["positions"]=string
    conn.commit() # commit commands
    conn.close() # close connection to database
    # latest_data is in json format; need to parse on ESP
    return send