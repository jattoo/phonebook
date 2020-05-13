const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
mongoose.set("useCreateIndex", true)
mongoose.set("useFindAndModify", true)


const url = process.env.MONGODB_URI
console.log("Connecting to Database...")

mongoose.connect(url,  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log("Connected to MongoDB")
  })
  .catch(error => {
    console.log("Error connecting to MongoDB: ", error.message)
  })


const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 12
  },
})

//apply uniquevalidator on our schema
contactSchema.plugin(uniqueValidator)

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("phonebook", contactSchema)
