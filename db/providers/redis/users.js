var client = require('./client'),
	async  = require('async');

const UserIndexKey = "user.n";
const UserKey = "user.";

// overwrite user data by always starting from userId=1
client.del(UserIndexKey);

function Users(){
	function insert(user, done){
		client.incr(UserIndexKey, function(err, id){
			var userId = UserKey+id;
			client.hmset(userId, user, function(err){
				if (err)
					return done(err, null);
				user._id = userId;
				done(null, user);
			});
		});
	}

	function _get(id, done){
		var userId = UserKey+id;
		client.hgetall(userId, function(err, user){
			if (err)
				return done(err, null);

			done(null, user);
		});
	}

	function _import(users, done){
		var insertTasks = users.map(u=>function(cb){
			insert(u, function(err, user){
				cb(null, user);
			})
		});
		async.parallel(insertTasks,function(err, results){
			done(err, results.length)
		});
	};

	return {
		import: _import,
		get: _get
	}

}

module.exports = new Users();