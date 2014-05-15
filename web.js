var socketio = require('socket.io')
;
var express = require('express');
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');

var app = express();

app.use(express.cookieParser());
app.use(express.limit('10mb'));
app.use(express.bodyParser({uploadDir: __dirname+'/public/upload/multipart'}));
app.use(app.router);
app.use(express.static(__dirname+'/public'));

app.get('/', function(request, response){
	fs.readFile(__dirname+'/public/index.html', function(error, data){
		response.send(data.toString());
	});
});

app.get('/upload', function(request, response){
	fs.readFile(__dirname+'/public/upload/index.html', 'utf8', function(error, data){
		response.send(data.toString());
	});
});

app.post('/upload', function(request, response){
	var comment = request.param('comment');
	var file = request.files.image;
	
	if(file){
		var name = file.name;
		var path = file.path;
		var outputPath = __dirname + '/public/upload/multipart/'+name;
		fs.rename(path, outputPath, function(error){
			response.redirect('/upload');
		});
	}else{
		response.send(404);
	}
});

app.get('/racer', function(request, response){
	fs.readFile(__dirname+'/public/racer/index.html', 'utf8', function(error, data){
		response.send(data.toString());
	});
});

app.get('/quoridor', function(request, response){
	fs.readFile(__dirname+'/public/quoridor/index.html', 'utf8', function(error, data){
		response.send(data.toString());
	});
});

app.get('/quoridor_admin', function(request, response){
	fs.readFile(__dirname+'/public/quoridor_admin/index.html', 'utf8', function(error, data){
		response.send(data.toString());
	});
});


app.get('/memorycard', function(request, response){
	fs.readFile(__dirname+'/public/memorycard/memorycard.html', 'utf8', function(error, data){
		response.send(data.toString());
	});
});

app.get('/testgame', function(request, response){
	fs.readFile(__dirname+'/public/testgame/index.html', 'utf8', function(error, data){
		response.send(data.toString());
	});
});

var server = http.createServer(app);

server.listen(8002, function(){
	console.log('Server Running at http://kaosu.cafe24app.com');
});

var io = socketio.listen(server);
io.set('log level', 2);
io.sockets.on('connection', function(socket){
	socket.on('disconnect', function(){
		
	});
});


