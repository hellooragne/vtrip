var db_url   = 'mongodb://127.0.0.1:27017/vtrip';

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

var collection = {};
collection['bson'] = require('mongodb').BSONPure;

MongoClient.connect(db_url, {wtimeout:200}, function(err, db) {
	collection['special_offer']  = db.collection('special_offer');
});



module.exports = collection;
