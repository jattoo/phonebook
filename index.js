require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const phonebook = require("./models/phonebook")
const morgan = require("morgan")

//MIDDLEWARES
app.use(express.json())
app.use(express.static("build"))
app.use(cors())




//custom format token called url
morgan.token("url", function(req) {
  return req.url
})

//custom format token called body
morgan.token("body", function(req){
  phonebook
    .findById(req.params.id)
    .then(contact => {
      console.log("body: ", JSON.stringify(contact))
      return JSON.stringify(contact)
    })
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms  :body"))

//TODO: GET ALL PERSONS
app.get("/api/persons", (_req, res, next) => {
  phonebook
    .find({})
    .then(result => {
      res.json(result.map(m => m.toJSON()))
    })
    .catch(error => next(error))
})


//TODO: SEND INFO PAGE
app.get("/api/info", (_req, res, next) => {
  phonebook
    .find({})
    .then(result => {
      const info = [
        {
          "id": 1,
          "text": `Phonebook has info for ${result.length} peoples`,
          "date" : new Date().toString()
        }
      ]
      res.json(info)
    })
    .catch(error => next(error))
})


//TODO: RETRIEVE SINGLE PERSON
app.get("/api/persons/:id", (req, res, next) => {
  phonebook
    .findById(req.params.id)
    .then(found => {
      res.json(found.toJSON())
    })
    .catch(error => next(error))
})

//TODO: DELETE A SINGLE PERSON
app.delete("/api/persons/:id", (req, res, next) => {
  console.log("url: ", req.url)
  phonebook
    .findByIdAndDelete(req.params.id)
    // eslint-disable-next-line no-unused-vars
    .then(deleted => {
      res.status(204).end()
    })
    .catch(error => next(error)) //handle our errors gracefully
})

//to update a field
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const newPerson = {
    name : body.name,
    number: body.number,
  }

  phonebook
    .findByIdAndUpdate(req.params.id, newPerson, { new: true, runValidators: true, context: "query" })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

//TODO: ADD A NEW PERSON
app.post("/api/persons", (req, res, next) => {
  const body = req.body

  const newPerson = new phonebook({
    name : body.name,
    number: body.number
  })

  newPerson
    .save().
    then(newContact => {
      res.json(newContact.toJSON())
    })
    .catch(error => next(error))
})

//unknownendpoint = non existing url
const unknownendpoint = (_req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownendpoint)

//error handler middleware function
const errorHandler = (error, _req, res, next) => {
  console.log(error.message)

  if(error.name === "CastError"){
    return res.status(400).send({ error : "malformatted id" })
  } else if (error.name === "ValidationError"){
    return res.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})