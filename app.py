import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv()) # This is to load your env variables from .env

app = Flask(__name__, static_folder='./build/static')
# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models

#Global array for users
global boardUsers;
boardUsers = [];

#Flask socket IO documentation
cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')
    all_people = models.Person.query.all()
    #List of users in DB
    users = []
    for person in all_people:
        users.append(person.username)
    print(users)
    
    scores = []
    for person in all_people:
        scores.append(person.score)
    print(scores)

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

# When a client emits the event 'login' to the server, this function is run
# 'login' is a custom event name that we just decided
@socketio.on('login')
def on_login(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    
    all_people = models.Person.query.all()
    #List of users in DB
    users = []
    for person in all_people:
        users.append(person.username)
    print(users)
    
    scores = []
    for person in all_people:
        scores.append(person.score)
    print(scores)
    
    #if username is in database don't add it again.    
    if(data["username"] in users):
        
        boardUsers.append(data["username"]);
        print(data["username"]);
        socketio.emit('login',  boardUsers, broadcast=True, include_self=False)
    
    else:
        #new user of person class, add new user and commit to add to DB.
        new_user = models.Person(username=data["username"], score=100)
        db.session.add(new_user)
        db.session.commit()
        all_people = models.Person.query.all()
        print(all_people)
        
        boardUsers.append(data["username"]);
        print(data["username"]);
        socketio.emit('login',  {'boardUsers': boardUsers, 'dbUsers': users, 'dbScores': scores}, broadcast=True, include_self=False)

# When a client emits the event 'board' to the server, this function is run
# 'board' is a custom event name that we just decided
@socketio.on('board')
def on_board(data):
    print(data)
    socketio.emit('board',  data, broadcast=True, include_self=False)

# When a client emits the event 'reset_game' to the server, this function is run
# 'reset_game' is a custom event name that we just decided    
@socketio.on('reset_game')
def on_reset_game(data):
    print(data)
    #clear array when we receie the reset game event from the client.
    boardUsers.clear();
    socketio.emit('reset_game',  data, broadcast=True, include_self=False)
    
# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    db.create_all()
    
# Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )