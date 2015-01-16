var rest = require('restler');
var urlencode = require("urlencode");
sprintf = require('sprintf').sprintf;

module.exports = function(app) {

	var special_offer_Db = require('../model/special_offer_db');
	var vcity = require('../model/vcity')

	var trans_url = function(data) {

		var vcity_detail = vcity.search(data.start_city);

		if (data.id != '') {
			data.showurl = sprintf("http://m.ctrip.com/webapp/tour/detail?productId=%s&saleCityId=%s&departCityId=0&from=vacations"
					, data.id, vcity_detail.City);

		}

		if (data.jumpurl != '') {
			data.jumpurl = "http://u.ctrip.com/union/CtripRedirect.aspx?TypeID=2&Allianceid=29637&sid=468701&OUID=&jumpUrl=" + data.jumpurl;
		}

	};

	//json = {
	//    "name":"",
	//    "id":"",
	//    "type":"",   travelling, hotel, 
	//    "time":"",
	//    "price":"",
	//    "start_time":'',
	//    "end_time":'',
	//    "start_city":"",
	//    "end_city":"",
	//    "showurl":"",
	//    "jumpurl":"",
	//    "content":"",
	//}
	
	app.get('/special_offer/add', function (req, res) {
		var data = JSON.parse(req.query.json);

		trans_url(data);

		special_offer_Db.add(data, function() {
			res.send("finish");
		});
	});

	//json = {
	//	"start_city":"",
	//	"end_city":"",
	//	"time":"",
	//}

	///special_offer/search?json={"test":{"$gt":3},"limit":20,"skip":0}
	app.get('/special_offer/search', function (req, res) {
		var data = JSON.parse(req.query.json);
		special_offer_Db.search(data, function(DbRes) {
			var Strres=JSON.stringify(DbRes);
			console.log("finish search");
			res.send(Strres);
		});
	});

	//json = {
	//   "id":"",
	//}

	app.get('/special_offer/del', function (req, res) {
		var data = JSON.parse(req.query.json);
		special_offer_Db.del(data, function(DbRes) {
			var Strres=JSON.stringify(DbRes);
			console.log("finish delete");
			res.send(Strres);
		});
	});
};
