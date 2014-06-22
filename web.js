var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var mysql = require('mysql');

// var client = mysql.createConnection({
	// host: '10.0.0.1',
	// port: 3306,
	// user: 'lible',
	// password: 'kaosu123',
	// database: 'lible'
// });

var client = mysql.createConnection({
	user: 'root',
	password: '0123523u',
	database: 'lible'
});

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

app.get('/register', function(request, response){
	fs.readFile(__dirname+'/public/join.html', function(error, data){
		response.send(data.toString());
	});
});

app.post('/', function(request, response){
	var body = request.body;
	console.log(body.email+'/'+body.password);
	response.redirect('/');
});

app.post('/register', function(request, response){
	var body = request.body;
	if(body.inputP == body.inputP2){
		console.log(body.inputN+'/'+body.inputP+'/'+body.inputN2+'/'+body.inputE);
		// var smtpTransport = nodemailer.createTransport("SMTP", {
			// service: 'Gmail',
			// auth:{
				// user: 'kaosu123456@gmail.com',
				// pass: '0123523u'
			// }
		// });
		
		var email = body.inputE;
		var pw = body.inputP;
		var name = body.inputN;
		var nickname = body.inputN2;
		
		var shasum = crypto.createHash('sha1');
		shasum.update(body.inputP);
		var output = shasum.digest('hex');
		console.log(output);
		
		var shasum2 = crypto.createHash('sha1');
		shasum2.update(body.inputN+body.inputP+'kaosu');
		var output2 = shasum2.digest('hex');
		
		client.query('SELECT * from member where email = ?', email, function(error, result, fields){
			if(error){
				response.redirect('/registererror');
			}else{
				console.log(result.length);
				if(result.length>0){
					response.redirect('/registeralready');
				}else{
					console.log('success1');
					client.query('INSERT INTO member (email, name, password, token, nickname, level, exp) VALUES (?, ?, ?, ?, ?, ?, ?)', [email, name, output, output2, nickname, 1, 0], function(errors, results, fieldss){
						if(errors){
							console.log('fail');
							console.log(errors);
							response.redirect('/registererror');
						}else{
							console.log('success');
							response.redirect('/registerok');
						}
					});
				}
			}
		});
		
		//var htmlstr = '<h1>가오수월드 가입확인 메일입니다.</h1><h2>가입을 원하시는 경우 다음 링크를 클릭 해 주세요.</h2><a href="http://kaosusoft.cafe24app.com/confirm/';
		
		// var htmlstr = '<h1>가오수월드 가입확인 메일입니다.</h1><h2>가입을 원하시는 경우 다음 링크를 클릭 해 주세요.</h2><a href="http://127.0.0.1:8002/confirm/';
		// htmlstr += output;
		// htmlstr += '">가입완료하기</a>';
// 		
		// var mailOptions = {
			// from: '가오수 <kaosu@naver.com>',
			// to: body.inputE,
			// subject: '가오수 월드 가입확인 메일입니다.',
			// html: htmlstr
		// };
// 		
		// smtpTransport.sendMail(mailOptions, function(error, responses){
			// if(error){
				// console.log(error);
				// response.redirect('/registererror');
			// }else{
				// console.log("Message sent : "+responses.message);
				// memberConfirm.push(new memberInfo(output, body.inputE, body.inputN, body.inputP));
				// for(var i=0; i<memberConfirm.length; i++){
					// console.log(memberConfirm[i].code + '/'+memberConfirm[i].name);
				// }
				// response.redirect('/registerok');
			// }
			// smtpTransport.close();
		// });
	}else{
		console.log('틀림');
		response.redirect('/registererror');
	}
	
});

app.get('/confirm/:token', function(request, response){
	var token = request.param('token');
	for(var i=0; i<memberConfirm.length; i++){
		if(memberConfirm[i].code == token){
			client.query('INSERT INTO member (email, name, password, token, level, exp) VALUES (?, ?, ?, ?)', [memberConfirm[i].email, memberConfirm[i].name, memberConfirm[i].pw, memberConfirm[i].code], function(error, result, fields){
				if(error){
					console.log('fail');
					console.log(error);
				}else{
					console.log('success');
					console.log(result);
				}
				console.log('result');
			});
			response.redirect('/registerconfirm');
			return;
		}
	}
	response.redirect('/registererror');
});

app.get('/registerconfirm', function(request, response){
	fs.readFile(__dirname+'/public/registerconfirm.html', function(error, data){
		response.send(data.toString());
	});
});

app.get('/registerok', function(request, response){
	fs.readFile(__dirname+'/public/registerok.html', function(error, data){
		response.send(data.toString());
	});
});

app.get('/registererror', function(request, response){
	fs.readFile(__dirname+'/public/registererror.html', function(error, data){
		response.send(data.toString());
	});
});

app.get('/registeralready', function(request, response){
	fs.readFile(__dirname+'/public/registeralready.html', function(error, data){
		response.send(data.toString());
	});
});

app.get('/worldcup', function(request, response){
	fs.readFile(__dirname+'/public/worldcup.html', function(error, data){
		response.send(data.toString());
	});
});

var server = http.createServer(app);

server.listen(8002, function(){
	console.log('Server Running at http://kaosusoft.cafe24app.com');
});

var io = socketio.listen(server);
io.set('log level', 2);
io.sockets.on('connection', function(socket){
	socket.on('join_member', function(){
		socket.join('kaosusoft');
		socket.set('room', 'kaosusoft');
	});
	socket.on('name_confirms', function(data){
		console.log(data);
		client.query('SELECT * from member where name = ?', data, function(error, result, fields){
			if(error){
				console.log('fail');
				socket.emit('name_confirm', {
					type: 0,
					name: data
				});
			}else{
				console.log('success');
				if(result.length>0){
					socket.emit('name_confirm', {
						type: 1,
						name: data
					});
				}else{
					socket.emit('name_confirm', {
						type: 2,
						name: data
					});
				}
			}
		});
	});
	socket.on('nickname_confirms', function(data){
		console.log(data);
		client.query('SELECT * from member where nickname = ?', data, function(error, result, fields){
			if(error){
				console.log('fail');
				socket.emit('nickname_confirm', {
					type: 0,
					name: data
				});
			}else{
				console.log('success');
				if(result.length>0){
					socket.emit('nickname_confirm', {
						type: 1,
						name: data
					});
				}else{
					socket.emit('nickname_confirm', {
						type: 2,
						name: data
					});
				}
			}
		});
	});
	socket.on('email_confirms', function(data){
		console.log(data);
		client.query('SELECT * from member where email = ?', data, function(error, result, fields){
			if(error){
				console.log('fail');
				socket.emit('email_confirm', {
					type: 0,
					name: data
				});
			}else{
				console.log('success');
				if(result.length>0){
					socket.emit('email_confirm', {
						type: 1,
						name: data
					});
				}else{
					socket.emit('email_confirm', {
						type: 2,
						name: data
					});
				}
			}
		});
	});
	
	socket.on('disconnect', function(){
		
	});
});

function memberInfo(code, email, name, pw){
	this.code = code;
	this.email = email;
	this.name = name;
	this.pw = pw;
}

var memberConfirm = [];


