const fake = require('./fake'),
	  db = require('../db');

module.exports.setup = function(done){
	var maxUsers = process.env.MAX_USERS || 1000;
	var data = fake.generate(maxUsers);
	debug(`generated ${data.users.length} users & ${data.profiles.length} profiles`);
	db.users.import(data.users, function(err,uc){
		db.profiles.import(data.profiles, function(err,pc){
			debug(`imported ${uc} users & ${pc} profiles...`);
			if (data.users.length===uc &&
				data.profiles.length===pc)
				return done();
			done(`partial import error`);
		});
	});
}