var rest = require('restler');
var urlencode = require("urlencode");
sprintf = require('sprintf').sprintf;

module.exports = function(app) {

	var geturl = function(c) {
		var url = sprintf("http://api.map.baidu.com/place/v2/search?query=%s&location=%s&radius=%s&output=json&ak=%s", 
				c.query, c.location, c.radius, c.ak);
		return url;
	};
	
	app.get('/gis/subway', function (req, res) {
		var url = geturl({query:urlencode("地铁站"), location:req.query.location, radius:req.query.radius, ak:'E6928ee8e014f6b0480fea4c4489201a'});
		console.log(url);


		rest.get(url).on('complete', function(result) {
			if (result instanceof Error) {
				console.log('Error:100', result.message);
			} else {
				res.send(result);
				console.log(result);
				try {
				} catch (err) {
					logger.debug(err);
				}
			}
		});
	});
};
