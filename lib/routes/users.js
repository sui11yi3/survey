var jwt = 		require('jwt-simple');
var moment = 	require('moment');
var secret = 	require('../config/secret');
var db = 		require('../config/models');


exports.signin = function(req, res) {
	var username = req.body.username || '';
	var password = req.body.password || '';
	
	if (username == '' || password == '') { 
		return res.status(400).json({ error: 'Form information missing!' }); 
	}

	db.userModel.findOne( { 'username': username }, function (err, user) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Internal server error!' });
		}

		if (user == undefined) {
			return res.status(400).json({ error: 'User does not exists!' });
		}
		
		user.comparePassword(password, function(isMatch) {
			if (!isMatch) {
				console.log("Attempt failed to login with " + user.username);
				return res.status(400).json({ error: 'Wrong username/password!' });
            }

            var expires = moment().add('days', 1).valueOf();
			var token = jwt.encode(
					{	
						iss: user._id,
						exp: expires
					}, 
					secret.secretToken
				);
			
			return res.json( {
								token : token,
								_id: user._id,
								username: user.username,
								role: user.role
							});
		});

	});
};

exports.logout = function(req, res) {
	if (req.user) {

		delete req.user;	
		return res.status(200).end();
	}
	else {
		return res.status(401).end();
	}
};

exports.register = function(req, res) {
	var username = req.body.username || '';
	var password = req.body.password || '';
	var passwordConfirmation = req.body.passwordConfirmation || '';
	var role = req.body.role || '';

	if (username == '' || password == '' || password == '' || passwordConfirmation == '' || role == '') {
		return res.status(400).json({ error: 'Form information missing!' }); 
	}
	if (password != passwordConfirmation) {
		return res.status(400).json({ error: 'Passwords do not match!' }); 
	}

	db.userModel.findOne( { 'username': username}, function(err, user) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Internal server error!' });
		}

		if (user) {
			return res.status(500).json({ error: 'User already exists!' });
		}

		var newUser = new db.userModel();
		newUser.username = username;
		newUser.password = password;
		newUser.role = role;	


		newUser.save(function(err) {
			if (err) {
				console.log(err);
				return res.status(500).json({ error: 'Internal server error!' });
			}	
		
			return res.send(200);
		});
	});
};

exports.list = function(req, res) {

	db.userModel.find(function (err, user) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Internal server error!' });
		}
		res.send(user);
	
	});
};
