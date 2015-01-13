var jwt = require('jwt-simple');
var moment = require('moment');
var secret = require('./secret');
var db = require('./models');


exports.verifyToken = function (req, res, next) {
	var token = getToken(req.headers);

	if (token) {
		
		var decoded = jwt.decode(token, secret.secretToken);

		if (decoded.exp <= Date.now()) {
			res.send(401, 'Token Expired');
		}

		db.userModel.findOne( { _id: decoded.iss }, function(err, reply) {
			if (err) {
				console.log(err);
				res.send(500);
			}
			if (!reply) {
				res.send(401, 'Invalid Token');
			}
			else {
				next();
			}
		});

	}
	else {
		res.send(401, 'Invalid Token');
	}

};


var getToken = function(headers) {
	if (headers && headers.authorization) {
		var authorization = headers.authorization;
		var part = authorization.split(' ');

		if (part.length == 2) {
			var token = part[1];

			return part[1];
		}
		else {
			return null;
		}
	}
	else {
		return null;
	}
};