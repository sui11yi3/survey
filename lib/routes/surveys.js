var db = require('../config/models');

exports.list = function(req, res) {
	if (!req.user) {
		return res.send(401);
	}	
	var query = db.surveyModel.find({});
	query.exec(function(err, results) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		return res.status(200).json(results);
	});
};

exports.create = function(req, res) {
	if (!req.user) {
		return res.send(401);
	}

	var name = req.body.survey.name || '';
	var city = req.body.survey.city || '';
	var gender = req.body.survey.gender || '';
	var kids = req.body.survey.kids || '';
	var creator = req.body.creator || '';

	if (name == '' || city == '' || gender == '' || kids == '' || creator == '') { 
		return res.send(400, 'Missing data'); 
	}

	var newSurvey = new db.surveyModel();
	newSurvey.name = name;
	newSurvey.city = city;
	newSurvey.gender = gender;
	newSurvey.kids = kids;
	newSurvey.creator._id = req.user.iss;
	newSurvey.creator.username = creator;
	
	newSurvey.save(function(err) {
		if(err) {
			console.log(err);
			return res.send(400);
		}
		return res.send(200);
	})
};

exports.findOne = function(req, res) {
	if (!req.user) {
		return res.send(401);
	}

	var query = db.surveyModel.findOne({_id: req.params.id});
	query.exec(function(err, result) {
		if(err) {
			console.log(err);
			return res.status(500).end();
		}

		return res.json(200, result);
	});
};

exports.update = function(req, res) {
	if (!req.user) {
		return res.send(401);
	}

	var survey = req.body.survey;

	if (survey == null || survey._id == null) {
		res.send(400);
	}

	var updateSurvey = {};

	if (survey.name != null && survey.name != "") {
		updateSurvey.name = survey.name;
	} 

	if (survey.gender != null && survey.gender != "") {
		updateSurvey.gender = survey.gender;
	}

	if (survey.city != null && survey.city != "") {
		updateSurvey.city = survey.city;
	}

	if (survey.kids != null && survey.kids != "") {
		updateSurvey.kids = survey.kids;
	}

	updateSurvey.updated = new Date();

	db.surveyModel.update({_id: survey._id}, updateSurvey, function(err, nbRows, raw) {
		if(err) {
			console.log(err);
			return res.send(500);
		}		
		return res.send(200);
	});
};

exports.delete = function(req, res) {
	if (!req.user) {
		return res.send(401);
	}

    db.surveyModel.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
        	console.log(err);
        	return res.send(500);
		}
		return res.send(200);
    });

};

exports.getGenderCount = function(req, res) {
	if (!req.user) {
		return res.send(401);
	}
	db.surveyModel.count({ gender: 'Male'}, function(err, maleCount) {
		if(err) {
			console.log(err);
		}
		db.surveyModel.count({ gender: 'Female'}, function(err, femaleCount) {
			if(err) {
				console.log(err);
			}
			var pieData = {male: maleCount, female: femaleCount};
			return res.json(pieData);
		});
	});	
};
