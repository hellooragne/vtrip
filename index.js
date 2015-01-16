var os = require('os');  
var app = require('express')()
   , server = require('http').createServer(app)
   , io = require('socket.io').listen(8082)

var express = require('express');

io.set('log level', 1); 
server.listen(80);

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'html');


var os=require('os');
var ifaces=os.networkInterfaces();

urls = "http://" + ifaces['eth0'][0].address + ":8082";

/*
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();
});
*/


require('./contorller/index.js')(app);

app.get('/', function (req, res) {
	res.redirect('/demo');
});


