# Flask and create-react-app

Jhon Garcia - Project 3 Milestone - TicTacToe

March 1, 2021.

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`
3.  `npm install --save particles-bg`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku
*Don't do the Heroku step for assignments, you only need to deploy for Project 2*
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Issues & How I Solved them
1. Had a lot of problems with the socket connection. - Did research and watched youtube videos.
2. Logic for the board and player x and o. - Looked up methods online.
3. Spectator login not showing when they log in. - Added spectator after they log in.
4. User list would not reset after clicking play again. - use the method array.clear() in the socket
   for the reset game event.

## Database
1. If you get a problem with the database. - In the terminal, run python to open up an interactive session.
   Initialize a new database using SQLAlchemy functions. Then type in these Python lines one by one:
    >> from app import db
    >> import models
    >> db.create_all()
    >> db.session.commit()
2. Now let's make sure this was written to our Heroku remote database! Let's connect to it using: heroku pg:psql
    \d to list all our tables. person should be in there now.
3. Now let's query the data with a SQL query
    SELECT * FROM person;
4. You should be able to see the table now.

