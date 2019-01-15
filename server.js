const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const User = require('.//models/user')
const mongoose = require('mongoose')
mongoose.connect('mongodb://victor:victor1234@cluster0-shard-00-00-mgep6.mongodb.net:27017,cluster0-shard-00-01-mgep6.mongodb.net:27017,cluster0-shard-00-02-mgep6.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true')
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
  User.findOne({username: req.body.username} ,(err, user)=>{if (err){
    res.send(err)
  }}).then((user) => {
    if(!user ){
      saveuser.save().then(function(result){
        res.json(result)
      })
    }
    else{
      res.send("User already exists");
    }
  })
  }
)
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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
