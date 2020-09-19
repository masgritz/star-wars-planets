const express = require('express')
const Planet = require('../models/planet.model')
const router = new express.Router()

router.post('/', async (req, res) => {
  const { name, climate, terrain } = req.body
  const planet = new Planet({
    name,
    climate,
    terrain
  })

  try {
    await planet.save()
    res.status(201).send(planet)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/', async (req, res) => {
  const { id, name } = req.query
  try {
    if (name) {
      const planet = await Planet.findOne({ name })
      return planet ? res.send(planet) : res.status(404).end()
    }

    if (id) {
      const planet = await Planet.findById(id)
      return planet ? res.send(planet) : res.status(404).end()
    }

    const planets = await Planet.find({})
    res.send(planets)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'climate', 'terrain']
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Invalid updates'
    })
  }

  try {
    const planet = await Planet.findById(req.params.id)

    if (!planet) {
      return res.status(404).end()
    }
    updates.forEach((update) => planet[update] = req.body[update])
    await planet.save()
    res.send(planet)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const planet = await Planet.findByIdAndDelete(req.params.id)

    if (!planet) {
      return res.status(404).end()
    }
    res.send(planet)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router