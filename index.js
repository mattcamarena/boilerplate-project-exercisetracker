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
      date: String,
      duration: Number,
      description: String
  }]
})

const User = mongoose.model("User", userSchema);

// User creation returns username and id as a json
app.post('/api/users', (req,res) =>{
  var username = req.body.username;
  var newUser = new User({username: username, count: 0})
  newUser.save();

  var userId = newUser.id;
  res.json({username: username, "_id": userId});
});

// Return a list of users with id but no Log or log count
app.get('/api/users', (req,res) => {
  User.find({}).select({log: 0, count: 0}).exec().then(users => {
    res.json(users);
  }).catch(err =>{
    console.log(err);
  });                         
});

// Create exercise that will return a json of said object
app.post('/api/users/:_id/exercises', (req,res) =>{

  var id = req.params._id;
  var description = req.body.description;
  var duration = parseInt(req.body.duration);
  var date = req.body.date;
  console.log("date")
  console.log(date);
  if(date === undefined){
    date = new Date();
  }else{
    date = new Date(date);
  }
  
  date = date.toDateString();
  console.log(date);
  var username = "";

 //fix date

  User.findById(id).exec().then(userById => {
    username = userById.username;
    var newLog = {description: description, duration: duration, date: date}
    userById.log.push(newLog);
    userById.count++;
    res.json({_id: id, username: username, date: date, duration: duration, description: description})
    userById.save();
  }).catch(err =>{
    console.log(err);
  });

});

app.get('/api/users/:id/logs', (req,res) =>{
  //return user obj with count prop  of exerc + logs
  var from = new Date(req.query.from);
  var to = new Date(req.query.to);
  var limit = req.query.limit || 50;
  console.log(from);
  console.log(to);
  var id = req.params.id;
  var resLog = [];
  var resCount = 0;

  User.findById(id).exec().then(userById =>{
    for(var x of userById.log) {
      console.log(x.date)
      var xDate = new Date(x.date);
      if(limit < 1) break;
      if(from == "Invalid Date" || from <= xDate && to >= xDate){
        resLog.push(x);
        resCount++;
        limit--;
      }
    }
    res.json({_id: id, username: userById.username, count: resCount, log: resLog});
  })

})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
