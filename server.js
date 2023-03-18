require("dotenv").config()

const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const { logEvents, logger } = require("./middleware/logEvents")
const errorHandler = require("./middleware/errorHandler")
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')

const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')

const PORT = process.env.PORT || 3500

// Connect to MongDB
connectDB()

//custom middleware logger, must use next()
app.use(logger)

app.use(credentials)  //need to be placed before Cors

app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: app;lication/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

//build-in middleware for json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")))
//app.use("/subdir", express.static(path.join(__dirname, "publlic")))

// routes
app.use("/", require("./routes/root"))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT)  //for all routes beloq, will be verified
//app.use("/subdir", require("./routes/subdir"))
app.use("/employees", require("./routes/api/employees"))

//Route handlers
// app.get(
//   "/hello(.html)?",
//   (req, res, next) => {
//     console.log("attempted to load hello.html")
//     next()
//   },
//   (req, res) => {
//     res.send("Hello World!")
//   }
// )

// // chaining route handlers
// const one = (req, res, next) => {
//   console.log("one")
//   next()
// }

// const two = (req, res, next) => {
//   console.log("two")
//   next()
// }

// const three = (req, res) => {
//   console.log("three")
//   res.send("Finished")
// }

//app.get("/chain(.html)?", [one, two, three])

app.all("*", (req, res) => {
  res.status(404)
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"))
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" })
  } else {
    res.type("txt").send("404 Not Found")
  }
})

//handle error
app.use(errorHandler)

mongoose.connection.once('open', ()=> {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

})
