var collection = require('./db.js');
sprintf = require('sprintf').sprintf;

var special_offer_db = {
	add: function(list, get_cb)	{
		collection['special_offer'].insert(list, function(err, docs) {});
		get_cb();
	},

	search: function(req, get_cb) {
		l = req['limit'];
		s = req['skip'];
		delete req['limit'];
		delete req['skip'];
		if (req["_id"] != null) {
			req["_id"] = collection["bson"].ObjectID(req["_id"]);
		}
		collection['special_offer'].find(req).limit(l).sort({"_id":-1}).skip(s).toArray(function(err, docs) {
			get_cb(docs);
		});
	},

	del: function(req, get_cb) {
		req["_id"] = collection["bson"].ObjectID(req["_id"]);
		collection['special_offer'].remove(req, function(err, result) {
			get_cb(result);
		});
	}
};

module.exports = special_offer_db;
