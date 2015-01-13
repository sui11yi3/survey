var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var mongodbURL = 'mongodb://localhost/node';
var mongodbOptions = { };

mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {
    if (err) { 
        console.log('Connection refused to ' + mongodbURL);
        console.log(err);
    } else {
        console.log('Connection successful to: ' + mongodbURL);
    }
});

var Schema = mongoose.Schema;

// User schema
var User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    created: { type: Date, default: Date.now }
});


// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
  });
});

//Password verification
User.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};



var Survey = new Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    gender: { type: String, required: true },
    kids: { type: String, required: true },
    created: { type: Date, default: Date.now },
    updated: [Date], 
    creator: {
                _id: { type: Schema.ObjectId, required: true},
                username: { type: String, required: true}
            }
});

Survey.pre('save', function(next){

    this.updated.push(Date.now());
    next();
});

//Define Models
var userModel = mongoose.model('User', User);
var surveyModel = mongoose.model('Survey', Survey);


// Export Models
exports.userModel = userModel;
exports.surveyModel = surveyModel;