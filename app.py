'''
APP.py is the server.
'''
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())  # This is to load your env variables from .env

APP = Flask(__name__, static_folder='./build/static')
# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)
# IMPORTANT: This must be AFTER creating DB variable to prevent
# circular import issues
import models

#Global array for users
global BOARDUSERS
BOARDUSERS = []

#Flask socket IO documentation
cors = CORS(APP, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    '''
    Index function receives filename
    '''
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    '''
    Function for Connect socket
    '''
    print('User connected!')

    ordered_users = DB.session.query(models.Person).order_by(
        models.Person.score.desc()).all()
    DB.session.commit()

    users = []
    scores = []
    for person in ordered_users:
        users.append(person.username)
        scores.append(person.score)

    print("newUsers", users)
    print("newScores", scores)

    socketio.emit('first_list', {'dbusers': users, 'dbscores': scores})

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    '''
    Function for Disconnect socket
    '''
    print('User disconnected!')


# When a client emits the event 'login' to the server, this function is run
# 'login' is a custom event name that we just decided
@socketio.on('login')
def on_login(
        data):  # data is whatever arg you pass in your emit call on client
    '''
    Function for Login socket
    '''
    print(str(data))

    ordered_users = DB.session.query(models.Person).order_by(
        models.Person.score.desc()).all()
    DB.session.commit()

    users = []
    for person in ordered_users:
        users.append(person.username)
    print("newUsers", users)

    #if username is in database don't add it again.
    if (data["username"] in users):

        BOARDUSERS.append(data["username"])
        print(data["username"])
        socketio.emit('login', BOARDUSERS, broadcast=True, include_self=False)

    else:
        #new user of person class, add new user and commit to add to DB.
        #new_user = models.Person(username=data["username"], score=100)
        users = add_user(data["username"])
        #DB.session.add(new_user)
        #DB.session.commit()
        #all_people = models.Person.query.all()
        #print(all_people)

        ordered_users = DB.session.query(models.Person).order_by(
            models.Person.score.desc()).all()
        DB.session.commit()

        #users = []
        scores = []
        for person in ordered_users:
            #users.append(person.username)
            scores.append(person.score)

        #print("newUsers", users)
        #print("newScores", scores)

        BOARDUSERS.append(data["username"])
        #print(data["username"])
        socketio.emit('login', {
            'BOARDUSERS': BOARDUSERS,
            'dbUsers': users,
            'dbScores': scores
        },
                      broadcast=True,
                      include_self=False)

def add_user(username):
    '''
    This function will receieve a string username and will add
    it to a list and return it.
    '''
    new_user = models.Person(username=username, score=100)
    DB.session.add(new_user)
    DB.session.commit()

    #ordered_users = DB.session.query(models.Person).order_by(
     #   models.Person.score.desc()).all()
    #DB.session.commit()

    all_people = models.Person.query.all()

    users = []
    for person in all_people:
        users.append(person.username)

    return users

# When a client emits the event 'board' to the server, this function is run
# 'board' is a custom event name that we just decided
@socketio.on('board')
def on_board(data):
    '''
    Function for Board socket
    '''
    print(data)
    socketio.emit('board', data, broadcast=True, include_self=False)


@socketio.on('setwinlosedraw')
def on_setwinlosedraw(data):
    '''
    Function for Setwinlosedraw socket
    '''
    print("Game ended, received winlosedrainfo: ", data)

    winner = DB.session.query(
        models.Person).filter_by(username=data['winner']).first()
    winner.score = plusOne(winner.score)
    DB.session.commit()

    loser = DB.session.query(
        models.Person).filter_by(username=data['loser']).first()
    loser.score = loser.score - 1
    DB.session.commit()

    ordered_users = DB.session.query(models.Person).order_by(
        models.Person.score.desc()).all()
    DB.session.commit()

    users = []
    scores = []
    for person in ordered_users:
        users.append(person.username)
        scores.append(person.score)

    print("newUsers", users)
    print("newScores", scores)

    #include_self sends data to all clients if set to true will also
    #send data to the client that data was first received from.
    socketio.emit('new_scores', {
        'endGameUsers': users,
        'endGameScores': scores
    },
                  broadcast=True,
                  include_self=True)


def plusOne(score):
    '''
    Function receives an int and adds 1 to it, return.
    '''
    return score + 1


# When a client emits the event 'reset_game' to the server, this function is run
# 'reset_game' is a custom event name that we just decided
@socketio.on('reset_game')
def on_reset_game(data):
    '''
    Function for Reset game socket
    '''
    print(data)
    #clear array when we receie the reset game event from the client.
    clearArray(BOARDUSERS)
    #gameState = True;
    socketio.emit('reset_game', data, broadcast=True, include_self=False)

def clearArray(fullarr):
    '''
    Function receives an array and returns empty array.
    '''
    return fullarr.clear()


# Note we need to add this line so we can import APP in the python shell
if __name__ == "__main__":
    DB.create_all()

    # Note that we don't call APP.run anymore. We call socketio.run with APP arg
    socketio.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
