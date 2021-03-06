// =======================
// get the packages we need ============
// =======================

var express = require('express');
//initialize app
var app = express();

var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

// User difiend variables

var config = require('./config'); // get our config file
var User   = require('./app/models/users'); // get our mongoose model

// =======================
// configuration =========
// =======================

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});


// API ROUTES -------------------

app.get('/setup', function(req, res) {

  // create a sample user
  var nick = new User({ 
    name: 'Nick Cerminara', 
    password: 'password',
    admin: true 
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

var user_route = require('./app/routes/routes')(app);
app.use('/api', user_route);
// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);