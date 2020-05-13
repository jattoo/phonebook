const mongoose = require("mongoose")


const password = process.argv[2]

const url ="your-dbcluster-connection-strings-here"

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model("Phonebook", contactSchema)

if(process.argv.length === 5){
  const contactDetails = new Phonebook({
    name: process.argv[3],
    number: process.argv[4]
  })
  contactDetails.save()
    .then(result => {
      console.log(`Added ${process.argv[3]} with number ${process.argv[4]} to phonebook collection`)
      mongoose.connection.close()
    })
} else if(process.argv.length === 3){
  Phonebook
    .find({})
    .then(result => {
      console.log("Phonebook: ")
      result.map(m => {
        console.log(m.name, m.number)
      })
      mongoose.connection.close()
    })
} else {
  console.log("This program runs only when given exactly: 3 or 5 arguments.")
  console.log(`But you gave:  ${process.argv.length} arguments`)
  process.exit(1)
}



