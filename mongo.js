const mongoose = require('mongoose')
const Table = require('easy-table')

const url = 'mongodb://heroku_3rfq74hq:ri0vrbb9hu02aq1movqv7e2uhg@ds245277.mlab.com:45277/heroku_3rfq74hq'

mongoose.connect(url);
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

const byName = (person1, person2) => person1.name - person2.name

if (process.argv.length == 4) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })
    person
        .save()
        .then(response => {
            console.log(`Lisättiinn henkilö ${response.name} numero ${response.number} luetteloon`)
            mongoose.disconnect()
        })
} else {
    Person
        .find({})
        .sort('name')
        .then(result => {
            let t = new Table
            console.log('\nPuhelinluettelo:')
            result.forEach(person => {
                t.cell('Name', person.name)
                t.cell('Number', person.number)
                t.newRow()
            })
            console.log(t.print())
            mongoose.disconnect()
        })
}
