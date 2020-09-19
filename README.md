# star-wars-planets
This is a REST API developed in Node.JS and Express to manage planets from the Star Wars universe. It supports GET, POST, DELETE and UPDATE operations through the the /api/planets route.

## How to use?

In order to use this API from your local machine, install all dependencies running the command below at the root of the project:

`npm install`

And then run one of the following commands to start it:

`npm start` to run under the production environment   
`npm run dev` to run under the development environment  
`npm test` to run the test suit

It is necessary to set up a .env file at the root of the project with links to your local MongoDB (`MONGODB_URL, DEV_MONGODB_URL and TEST_MONGODB_URL`) and the port (`PORT`) you desire to run it in order for it function as intended.

Alternatively, this API is acessible on https://swplanet-api.herokuapp.com/api/planets.
