import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

#Global array for users
global users;
users = [];

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

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

# When a client emits the event 'login' to the server, this function is run
# 'login' is a custom event name that we just decided
@socketio.on('login')
def on_login(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'login' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    #append username to array
    users.append(data["username"]);
    print(data["username"]);
    socketio.emit('login',  users, broadcast=True, include_self=False)

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
    users.clear();
    socketio.emit('reset_game',  data, broadcast=True, include_self=False)

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)