const mongoose = require('mongoose')
const axios = require('axios')
const uniqueValidator = require('mongoose-unique-validator')

const planetSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  climate: {
    type: String,
    required: true,
    trim: true
  },
  terrain: {
    type: String,
    required: true,
    trim: true
  },
  appearances: {
    type: Number
  }
}, {
  collation: { locale: 'pt', strength: 2 }
})

planetSchema.plugin(uniqueValidator)

planetSchema.pre('save', async function (next) {
  const planet = this

  if (planet.isModified('name')) {
    try {
      const request = await axios.get(`https://swapi.dev/api/planets/?search=${planet.name}`)
      const { results } = request.data
      planet.appearances = results[0] ? Object.keys(results[0].films).length : 0
    } catch (e) {
      console.log(e)
    }
  }
  next()
})

const Planet = mongoose.model('Planet', planetSchema)

module.exports = Planet