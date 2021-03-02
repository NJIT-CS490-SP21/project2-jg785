# Flask and create-react-app

Jhon Garcia - Project 2 Milestone 1 - TicTacToe

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

