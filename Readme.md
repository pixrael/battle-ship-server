# Battleship game

In order to run this game you need a server and a client, the server is developed in node js and the client is developed in react.

Code repository for the server, click [here](https://github.com/pixrael/battle-ship-server)

Code repository for the client, click [here](https://github.com/pixrael/battle-ship-client)

## Installation

Download every project in different directories:

1-Download or clone the [server](https://github.com/pixrael/battle-ship-server) repository:
<ol>
    <li><a href="#usage">Execute `$ git clone https://github.com/pixrael/battle-ship-server.git `</a></li>
    <li><a href="#roadmap">Access to the folder of the project and execute `$ npm install ` to install all the dependencies</a></li>    
  </ol>

2-Download or clone the [client](https://github.com/pixrael/battle-ship-client) repository:

<ol>
    <li><a href="#usage">Execute git clone https://github.com/pixrael/battle-ship-client.git</a></li>
    <li><a href="#roadmap">Access to the folder of the project and execute `$ npm install ` to install all the dependencies</a></li>    
  </ol>

## Run the project

### Executing the project

1-To run the server, inside the folder of the project execute the command `$ npm start ` that way the server will be running at port 3001

2-To run the client, inside the folder of the project execute the command `$ npm start ` your browser should start and point to 'http://localhost:3000' showing the main page of the game

IMPORTANT: Client will connect with a socket located at 'http://localhost:3001' location and the server will allow only connections with the client at 'http://localhost:3000'

### Run Server in development mode

1-Execute the command `$ npm run dev` this command should run the server at port 3001

2-Execute `$ npm run watch-dev` this command should watch any change in the server code and update the running server without need of restarting the server

### Run Client in development mode

1-Execute the command `$ npm start` this command should run the client and any change in the code will update the front app

### Execute Server unit tests and coverage

1-Execute the command `$ npm test` this command should run the test of the server

2-Execute the command `$ npm run test-coverage` this command should run the test and generate the coverage report, the coverage report should be generated at server\coverage\index.html, open the index.html from a browser to see the report

### Execute Client unit tests and coverage

Client has no test, they are pending for the future
