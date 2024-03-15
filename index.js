const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')

});

//mongodb connection
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true });

//create schemas for users/ logs

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  count: Number,
  log:[{
    
      description: [String],
      duration: Number,
      date: Date,
    
  }]
})

const User = mongoose.model("User", userSchema);

app.post('/api/users', (req,res) =>{
  var username = req.body.username;
  var newUser = new User({username: username})
  newUser.save();
  var userId = newUser._id.toString();
  res.json({username: username, "_id": userId});
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
