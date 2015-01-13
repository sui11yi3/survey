// server.js

var express = 			require('express');
var http = 				require('http');
var jwt = 				require('express-jwt');
var path = 				require('path');
var morgan = 			require('morgan');
var bodyPaser = 		require('body-parser');
var methodOverride = 	require('method-override');
var secret = 			require('./lib/config/secret');
var tokenManager = 		require('./lib/config/token');
var app = express();


// view setup
app.set('views', __dirname + '/app/views');
//app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyPaser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'app')));

//Routes
var routes = {};

routes.users = require('./lib/routes/users.js');
routes.surveys = require('./lib/routes/surveys.js');

app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

//Get all user list
app.get('/user/list', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.list);

//Create a new user
app.post('/user/register', routes.users.register);

//Login
app.post('/user/signin', routes.users.signin);

//Logout
app.get('/user/logout', jwt({secret: secret.secretToken}), routes.users.logout);

//Get survey list
app.get('/survey/list', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.surveys.list);

//Get the gender pie data
app.get('/survey/gender', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.surveys.getGenderCount);

//Get one survey
app.get('/survey/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.surveys.findOne);

//Update survey
app.put('/survey', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.surveys.update);

//Create a new survey
app.post('/survey', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.surveys.create);

//Delete one survey
app.delete('/survey/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.surveys.delete);


var port = process.env.PORT || 80;
app.listen(port, function() {
	console.log("Express server listening on port " + port);
});