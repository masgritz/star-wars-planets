const Planet = require('../../models/planet.model')
const mongoose = require('mongoose')

const initialPlanets = [{
  _id: new mongoose.Types.ObjectId(),
  name: 'Tatooine',
  climate: 'dry',
  terrain: 'desert'
}, {
  _id: new mongoose.Types.ObjectId(),
  name: 'Naboo',
  climate: 'humid',
  terrain: 'lush'
}, {
  _id: new mongoose.Types.ObjectId(),
  name: 'Mustafar',
  climate: 'hot',
  terrain: 'volcanic'
}, {
  _id: new mongoose.Types.ObjectId(),
  name: 'Alderaan',
  climate: 'mild',
  terrain: 'mountain'
}, {
  _id: new mongoose.Types.ObjectId(),
  name: 'Geonosis',
  climate: 'arid',
  terrain: 'rocky'
}, {
  _id: new mongoose.Types.ObjectId(),
  name: 'Polys Massa',
  climate: 'artificial temperate',
  terrain: 'asteroid'
}]

const populateDatabase = async () => {
  await Planet.deleteMany({})

  const planetObjects = initialPlanets.map(planet => new Planet(planet))
  const promiseArray = planetObjects.map(planet => planet.save())

  await Promise.all(promiseArray)
}

const planetsInDb = async () => {
  const planets = await Planet.find({})
  return planets.map(planet => planet.toJSON())
}

module.exports = {
  initialPlanets,
  populateDatabase,
  planetsInDb
}