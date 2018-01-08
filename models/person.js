const mongoose = require('mongoose')

const url = 'mongodb://heroku_3rfq74hq:ri0vrbb9hu02aq1movqv7e2uhg@ds245277.mlab.com:45277/heroku_3rfq74hq'

mongoose.connect(url);
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person