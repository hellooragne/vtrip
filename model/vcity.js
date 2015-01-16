var fs = require('fs'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();
var city_list = null;

fs.readFile(__dirname + '/city.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
		city_list = result['CityDetails']['CityDetail'];
    });
});

var vcity = {
	search: function(name) {
		for (i in city_list) {
			if (city_list[i].CityName == name) {
				return city_list[i];
			}
		}
	},

};


module.exports = vcity;
