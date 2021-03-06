const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const moment = require('moment')

const User = require('.//models/user')
const Exercise = require('.//models/exercie')
const mongoose = require('mongoose')

mongoose.connect('mongodb://victor:victor1234@cluster0-shard-00-00-vfoph.mongodb.net:27017,cluster0-shard-00-01-vfoph.mongodb.net:27017,cluster0-shard-00-02-vfoph.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true' || 'mongodb://localhost:27017/pandora', {
  useNewUrlParser: true
});
app.use(cors())

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
// Create a New User endpoint
app.post('/api/exercise/new-user', function (req, res) {

  let saveuser = new User({
    username: req.body.username
  })
  //check if user exists. If not create a new user
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) {
      res.send(err)
    }
  }).then((user) => {
    if (!user) {
      saveuser.save().then(function (result) {
        res.json(result)
      })
    } else {
      res.send("User already exists");
    }
  })
})
// add excercise
app.post('/api/exercise/add', function (req, res) {

  let userId = req.body.userId;
  let description = req.body.description;
  let duration = req.body.duration;
  let date = req.body.date;
  User.findById({
    _id: req.body.userId
  }, (err, user) => { // check f date is null then use the default date (date.now)
    if (err) {
      res.send(err)
    }
    if (!user) {
      res.json({
        error: "UserId is not found"
      })
    } else {
      if (!description) {
        res.json({
          description: "Please input a description"
        })
      }
      if (!duration) {
        res.json({
          duration: " Please input duration of the exercise"
        })
      }
      if (!date) {
        let xer = new Exercise({
          userId,
          description,
          duration,
          date: Number(Date.now())
        })
        xer.save().then((err, exercise) => {
          if (exercise) {
            res.json({
              userId,
              description,
              duration,
              date: moment(date).format('D MMM, YYYY')
            })
          } else {
            res.send("Exercise could not be saved")
          }
        })
      } else {
        let saveExercise = new Exercise({
          userId,
          description,
          duration,
          date
        })
        saveExercise.save().then((exercise) => {
          if (exercise) {
            res.json({
              userId,
              description,
              duration,
              date: moment(date).format('D MMM, YYYY')
            })
          } else {
            res.send("Exercise could not be saved")
          }
        })
      }
    }
  })

})

//log of exercises

app.get('/api/exercise/log', function (req, res) {
  let user = req.query.userId
  let from = req.query.from
  let end = req.query.end
  let limit = parseInt(req.query.limit)

  Exercise.find({
    userId: user
  }).where('date').gte(from).lte(end).limit(limit).exec((err, response) => {
    if (err) {
      res.send(err)
    } else {
      res.send(response)
    }
  })
})

// Not found middleware
app.use((req, res, next) => {
  return next({
    status: 404,
    message: 'not found'
  })
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})
const port = process.env.PORT
app.listen(port, function () {
  console.log('Node.js listening ... ' + port);
});