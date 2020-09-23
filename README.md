# star-wars-planets
[![Build Status](https://travis-ci.org/masgritz/star-wars-planets.svg?branch=master)](https://travis-ci.org/masgritz/star-wars-planets)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

This is a REST API developed in Node.JS and Express to manage planets from the Star Wars universe. It supports GET, POST, DELETE and UPDATE operations through the the /api/planets route.

## How to use?

In order to use this API from your local machine, install all dependencies running the command below at the root of the project:
```
npm install
```

And then run one of the following commands to start it:

Run under the production environment:
```
npm start  
```
Run under the development environment:
```
npm run dev  
```
Run the test suit:
```
npm test
```
It is necessary to set up a .env file at the root of the project with links to your local MongoDB (`MONGODB_URL, DEV_MONGODB_URL and TEST_MONGODB_URL`) and the port (`PORT`) you desire to run it in order for it function as intended.

Alternatively, this API is acessible on https://swplanet-api.herokuapp.com/api/planets.

## Examples

### POST
Create a new planet, film appearances are automatically assigned by the middleware:    
```
POST locahost:3000/api/planets
{
    "name": "Mustafar",
    "climate": "scorching hot",
    "terrain": "volcanic plains"
}
```
  
### GET
Read the 10 first planets in the database:    
```
GET locahost:3000/api/planets
```

Read the 10 following planets in the database:    
```
GET locahost:3000/api/planets?skip=10
```

Read the fourth page of results with a 5 results per page:
```
GET locahost:3000/api/planets?limit=5&skip=15
```
Find a planet in the database:    
```
GET locahost:3000/api/planets/search?name=yavin
```

Read a planet by id (example, non-existing ObjectId):   
```
GET locahost:3000/api/planets/5f66d428cf8603693fc0221e   
GET locahost:3000/api/planets/search?id=5f66d428cf8603693fc0221e
```

### PATCH
Update an existing planet (example, non-existing ObjectId):
```
PATCH locahost:3000/api/planets/5f66d428cf8603693fc0221e
{
  "planet": "Yavin VI"
  "climate": "temperate"
}
```

### DELETE
Remove an existing planet (example, non-existing ObjectId):
```
DELETE locahost:3000/api/planets/5f66d428cf8603693fc0221e
```
