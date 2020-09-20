const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Planet = require('../models/planet.model')
const {
  initialPlanets,
  populateDatabase,
  planetsInDb
} = require('./fixtures/db')

beforeEach(populateDatabase)

describe('tests involving the initial set of planets in the database', () => {
  test('planets are in the json format and match the initial planet object length', async () => {
    const res = await api
      .get('/api/planets')
      .query({ limit: 0 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body).toHaveLength(initialPlanets.length)
  })

  test('planets have a property named "appearances" with the number of cinematic appearances of a planet', async () => {
    const res = await api.get('/api/planets')
    res.body.map(planet => expect(planet.appearances).toBeDefined())
  })
})

describe('tests for planet POST operations', () => {
  test('a planet is added and gets the correct number of appearances from the middleware', async () => {
    const testPlanet = {
      name: 'Coruscant',
      climate: 'artificial temperate',
      terrain: 'urban'
    }

    const res = await api
      .post('/api/planets')
      .send(testPlanet)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(res.body.appearances).toEqual(4)

    const planetsAtEnd = await planetsInDb()
    expect(planetsAtEnd).toHaveLength(initialPlanets.length + 1)

    const names = planetsAtEnd.map(p => p.name)
    expect(names).toContain('Coruscant')
  })

  test('a planet with a non-unique name returns a 400 status', async () => {
    const testPlanet = {
      name: 'Naboo',
      climate: 'humid',
      terrain: 'lush'
    }

    await api
      .post('/api/planets')
      .send(testPlanet)
      .expect(400)

    const planetsAtEnd = await planetsInDb()
    expect(planetsAtEnd).toHaveLength(initialPlanets.length)
  })

  test('a planet with a lowercase non-unique name returns a 400 status', async () => {
    const testPlanet = {
      name: 'naboo',
      climate: 'humid',
      terrain: 'lush'
    }

    await api
      .post('/api/planets')
      .send(testPlanet)
      .expect(400)

    const planetsAtEnd = await planetsInDb()
    expect(planetsAtEnd).toHaveLength(initialPlanets.length)
  })

  test('a planet missing a property cannot be added and returns a 400 status', async () => {
    const testPlanet = {
      name: 'Jakku',
      climate: '',
      terrain: 'desert'
    }

    await api
      .post('/api/planets')
      .send(testPlanet)
      .expect(400)

    const planetsAtEnd = await planetsInDb()
    expect(planetsAtEnd).toHaveLength(initialPlanets.length)
  })
})

describe('tests for planet GET operations', () => {
  test('returns the first 3 planets', async () => {
    const res = await api
      .get('/api/planets')
      .query({ limit: 3 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const planetsAtEnd = await planetsInDb()

    expect(res.body).toHaveLength(3)
    expect(res.body[0].name).toEqual(planetsAtEnd[0].name)
    expect(res.body[2].name).toEqual(planetsAtEnd[2].name)
  })

  test('returns the final 3 planets', async () => {
    const res = await api
      .get('/api/planets')
      .query({ limit: 3, skip: 3 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const planetsAtEnd = await planetsInDb()

    expect(res.body).toHaveLength(3)
    expect(res.body[0].name).toEqual(planetsAtEnd[3].name)
    expect(res.body[2].name).toEqual(planetsAtEnd[5].name)
  })

  test('a single planet can be acessed through its id', async () => {
    const res = await api
      .get('/api/planets')
      .query({ id: initialPlanets[2]._id.toString() })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.name).toEqual('Mustafar')
    expect(res.body.appearances).toEqual(1)
  })

  test('trying to access a planet with an invalid id should return a 404 status', async () => {
    const res = await api
      .get('/api/planets')
      .query({ id: '5a422b3a5b54f676274d17f9' })
      .expect(404)

    expect(res.body.name).toBeUndefined()
  })

  test('a single planet can be acessed through its name', async () => {
    const res = await api
      .get('/api/planets')
      .query({ name: 'Alderaan' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.name).toEqual('Alderaan')
    expect(res.body.appearances).toEqual(2)
  })

  test('trying to access a planet with an invalid name should return a 404 status', async () => {
    const res = await api
      .get('/api/planets')
      .query({ name: 'Exagol' })
      .expect(404)

    expect(res.body.name).toBeUndefined()
  })
})

describe('tests for planet UPDATE operations', () => {
  test('Mispelled "Polys" Massa planet exists in the database and has 0 appearances', async () => {
    const res = await api
      .get('/api/planets')
      .query({ id: initialPlanets[5]._id.toString() })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.name).toEqual('Polys Massa')
    expect(res.body.appearances).toEqual(0)
  })

  test('a planet can be updated successfully and the middleware assigns the number of appearances', async () => {
    const updatesToApply = {
      name: 'Polis Massa'
    }

    const res = await api
      .patch(`/api/planets/${initialPlanets[5]._id}`)
      .send(updatesToApply)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.name).toEqual('Polis Massa')
    expect(res.body.appearances).toEqual(1)
  })

  test('an invalid update returns a 400 status', async () => {
    const updatesToApply = {
      population: 1000000
    }

    const res = await api
      .patch('/api/planets/5a422bc61b54a676234d17fc')
      .send(updatesToApply)
      .expect(400)

    expect(res.body.error).toBeDefined()

    const anotherRes = await api
      .get('/api/planets')
      .query({ id: initialPlanets[5]._id.toString() })

    expect(anotherRes.body.name).toEqual('Polys Massa')
    expect(anotherRes.body.population).toBeUndefined()
  })

  test('updating a planet with a invalid id should return 404 status', async () => {
    const updatesToApply = {
      name: 'Mandalore'
    }

    await api
      .patch('/api/planets/5a422b3a5b54f676274d17f9')
      .send(updatesToApply)
      .expect(404)
  })

  test('updating a planet with a non-unique name should return 400 status', async () => {
    const updatesToApply = {
      name: 'Naboo'
    }

    await api
      .patch(`/api/planets/${initialPlanets[5]._id}`)
      .send(updatesToApply)
      .expect(400)

    const res = await api
      .get('/api/planets')
      .query({ id: initialPlanets[5]._id.toString() })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.name).toEqual('Polys Massa')
  })
})

describe('tests for planet DELETE operations', () => {
  test('a planet can be deleted and returns a 200 status', async () => {
    await api
      .delete(`/api/planets/${initialPlanets[4]._id}`)
      .expect(200)

    const planet = await Planet.findById(initialPlanets[4]._id)
    expect(planet).toBeNull()

    const planetsAtEnd = await planetsInDb()
    expect(planetsAtEnd).toHaveLength(initialPlanets.length - 1)
  })

  test('trying to delete an invalid planet returns a 404 status', async () => {
    await api
      .delete('/api/planets/5a422b3a5b54f676274d17f9')
      .expect(404)

    const planetsAtEnd = await planetsInDb()
    expect(planetsAtEnd).toHaveLength(initialPlanets.length)
  })

  test('trying to delete a planet twice returns a 404 status', async () => {
    await api
      .delete(`/api/planets/${initialPlanets[3]._id}`)
      .expect(200)

    await api
      .delete(`/api/planets/${initialPlanets[3]._id}`)
      .expect(404)

    const planetsAtEnd = await planetsInDb()
    expect(planetsAtEnd).toHaveLength(initialPlanets.length - 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})