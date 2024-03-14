const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//need connection to mongodb


//create schemas for users/ logs

app.post('/api/users', (req,res) =>{
  // body users create new user
  // return _id from username
});

app.get('/api/users', (req,res) => {
  // return list of all users array so user + id as json i assume
  
});

app.post('api/users/:id/exercises', (req,res) =>{
  // data descr, duration date if no date use current
  // return json of obje with fields
});

app.get('api/users/:id/logs', (req,res) =>{
  //return user obj with count prop  of exerc + logs


  // from to limit parameters to a get 
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
