import sqlite3
import datetime
import json

game_db = '/var/jail/home/team48/game1.db'

def request_handler(request):
    if request['method'] == 'POST':
        """
        Front end posts users at the start of a game; should return the win rates of the users
        """
        player1 = request['form']['player1'].lower()
        player2 = request['form']['player2'].lower()

        conn = sqlite3.connect(game_db)  # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # move cursor into database (allows us to execute commands)

        player1_wins = c.execute('''SELECT game_id FROM results_table WHERE winner == ?;''',(player1,)).fetchall()
        player1_losses = c.execute('''SELECT game_id FROM results_table WHERE lower == ?;''',(player1,)).fetchall()
        player1_games = set()
        player1_wins_set = set()
        for game_id in player1_wins:
            player1_wins_set.add(game_id)
            player1_games.add(game_id[0])
        for game_id in player1_losses:
            player1_games.add(game_id[0])
        player1_games = list(player1_games)
        
        player2_wins = c.execute('''SELECT game_id FROM results_table WHERE winner == ?;''',(player2,)).fetchall()
        player2_losses = c.execute('''SELECT game_id FROM results_table WHERE lower == ?;''',(player2,)).fetchall()
        player2_games = set()
        player2_wins_set = set()
        for game_id in player2_wins:
            player2_wins_set.add(game_id)
            player2_games.add(game_id[0])
        for game_id in player2_losses:
            player2_games.add(game_id[0])
        player2_games = list(player2_games)
        
        conn.commit() # commit commands
        conn.close() # close connection to database

        output = {'player1': {'playerName': player1, 'gamePlayed': len(player1_games), 'gameWinned': len(player1_wins_set)}, 'player2': {'playerName': player2, 'gamePlayed': len(player1_games), 'gameWinned': len(player1_wins_set)}}
        return json.dumps(output)
    
    else:
        game_id = int(request['values']['game_id'])
        conn = sqlite3.connect(game_db)  # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # move cursor into database (allows us to execute commands)
        results = c.execute('''SELECT * FROM results_table WHERE game_id == ?;''',(game_id,)).fetchall()
        conn.commit() # commit commands
        conn.close() # close connection to database
        return results