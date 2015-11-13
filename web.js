var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var mysql = require('mysql');
var utf8 = require('utf8');
var easyimage = require('easyimage');
var uuid = require('node-uuid');
var util = require('./util.js');

var test = false; // 테스트중이면 true, 진짜는 false 

var client;

if(test){
	client = mysql.createConnection({
		user: 'root',
		password: '0123523u',
		database: 'lible'
	});
}else{
	client = mysql.createConnection({
		host: '10.0.0.1',
		port: 3306,
		user: 'lible',
		password: 'kaosu123',
		database: 'lible'
	});
}

var app = express();

app.use(express.cookieParser());
app.use(express.limit('10mb'));
app.use(express.bodyParser({uploadDir: __dirname+'/public/upload/multipart'}));
app.use(app.router);
app.use(express.static(__dirname+'/public'));

app.get('/', function(request, response){
	if(request.cookies.session == undefined){
		fs.readFile(__dirname+'/public/index.html', 'utf8',  function(error, data){
			response.send(ejs.render(data, {
				data: {
					test : test,
					result : 0
				}
			}));
		});
	}else{		
		client.query('SELECT * from member where token = ?', request.cookies.session, function(error, result, fields){
			if(error){
				response.redirect('/logout');
			}else{
				if(result.length>0){
					fs.readFile(__dirname+'/public/index.html', 'utf8',  function(error, data){
						response.send(ejs.render(data, {
							data: {
								test : test,
								result : 1,
								name: result[0].name,
								nickname: result[0].nickname
							}
						}));
					});
				}else{
					response.redirect('/logout');
				}
			}
		});
	}
});

app.get('/bad_access', function(request, response){
	fs.readFile(__dirname+'/public/bad_access.html', function(error, data){
		response.send(data.toString());
	});
});

app.get('/logout', function(request, response){
	response.clearCookie('session');
	response.redirect('/');
});

app.get('/join', function(request, response){
	fs.readFile(__dirname+'/public/join.html', function(error, data){
		response.send(data.toString());
	});
});

app.get('/login_error/:id', function(request, response){
	var id = request.param('id');
	fs.readFile(__dirname+'/public/index_redirect.html', 'utf8', function(error, data){
		response.send(ejs.render(data, {
			data: id
		}));
	});
});

app.post('/', function(request, response){
	var body = request.body;
	var name = body.email;
	var password = body.password;
	
	client.query('SELECT * from member where name = ?', name, function(error, result, fields){
		if(error){
			response.redirect('/login_error/2');
		}else{
			if(result.length>0){
				var shasum = crypto.createHash('sha1');
				shasum.update(name+'#'+password+'@kaosu');
				var pw = shasum.digest('hex');
				if(pw == result[0].password){
					var output2 = uuid.v4();
					client.query('update member set token=? where id=?', [output2, result[0].id], function(){
						response.cookie('session', output2);
						response.redirect('/');
					});
				}else{
					response.redirect('/login_error/1');
				}
			}else{
				response.redirect('/login_error/0');
			}
		}
	});
});

app.get('/lobby', function(request, response){
	if(request.cookies.session == undefined){
		response.redirect('/bad_access');
	}else{		
		client.query('SELECT * from member where token = ?', request.cookies.session, function(error, result, fields){
			if(error){
				response.redirect('/bad_access');
			}else{
				if(result.length>0){
					fs.readFile(__dirname+'/public/lobby.html', 'utf8',  function(error, data){
						response.send(ejs.render(data, {
							data: {
								test : test,
								name: result[0].name,
								nickname: result[0].nickname
							}
						}));
					});
				}else{
					response.redirect('/bad_access');
				}
			}
		});
	}
});


// app.post('/register', function(request, response){
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
// });

// app.get('/confirm/:token', function(request, response){
	// var token = request.param('token');
	// for(var i=0; i<memberConfirm.length; i++){
		// if(memberConfirm[i].code == token){
			// client.query('INSERT INTO member (email, name, password, token, level, exp) VALUES (?, ?, ?, ?)', [memberConfirm[i].email, memberConfirm[i].name, memberConfirm[i].pw, memberConfirm[i].code], function(error, result, fields){
				// if(error){
					// console.log('fail');
					// console.log(error);
				// }else{
					// console.log('success');
					// console.log(result);
				// }
				// console.log('result');
			// });
			// response.redirect('/registerconfirm');
			// return;
		// }
	// }
	// response.redirect('/registererror');
// });

app.get('/worldcup', function(request, response){
	fs.readFile(__dirname+'/public/worldcup.html', function(error, data){
		response.send(data.toString());
	});
});

app.get('/worldcupfinal', function(request, response){
	fs.readFile(__dirname+'/public/worldcup/worldcup2.html', 'utf8', function(error, data){
		client.query('select * from worldcup order by ordered asc', function(error, results){
			response.send(ejs.render(data, {
				data: results
			}));
		});
	});
});

app.get('/worldcupadmin', function(request, response){
	fs.readFile(__dirname+'/public/worldcup/worldcupadmin.html', 'utf8', function(error, data){
		client.query('select * from worldcup order by ordered asc', function(error, results){
			response.send(ejs.render(data, {
				data: results
			}));
		});
	});
});

app.get('/worldcupdelete/:id', function(request, response){
	console.log('delete');
	client.query('delete from worldcup where _id=?', [request.param('id')], function(){
		response.redirect('/worldcupadmin');
	});
});

app.get('/worldcupinsert', function(request, response){
	fs.readFile(__dirname+'/public/worldcup/worldcupinsert.html', function(error, data){
		response.send(data.toString());
	});
});

app.post('/worldcupinsert', function(request, response){
	var body = request.body;
	client.query('insert into worldcup (name, team1, team2, ordered, failed) values (?, ?, ?, ?, ?)', [body.name, body.team1, body.team2, 0, 0], function(){
		response.redirect('/worldcupinsert');
	});
});

app.get('/worldcupedit/:id', function(request, response){
	fs.readFile(__dirname+'/public/worldcup/worldcupedit.html', 'utf8', function(error, data){
		client.query('select * from worldcup where _id=?', [request.param('id')], function(error, result){
			response.send(ejs.render(data, {
				data: result[0]
			}));
		});
	});
});

app.post('/worldcupedit/:id', function(request, response){
	var body = request.body;
	client.query('update worldcup set name=?, team1=?, team2=?, ordered=?, failed=? where _id=?', [body.name, body.team1, body.team2, body.ordered, body.failed, request.param('id')], function(){
		response.redirect('/worldcupadmin');
	});
});

app.get('/upload', function(request, response){
	fs.readFile(__dirname+'/public/upload/index.html', 'utf8', function(error, data){
		client.query('select * from myfile2 order by _id asc', function(error, results){
			response.send(ejs.render(data, {
				data: results
			}));
		});
	});
});

app.get('/download/:id', function(request, response){
	client.query('select * from myfile2 where _id=?', request.param('id'), function(error, result, fields){
		if(result.length>0){
			var file = __dirname + '/public/upload/multipart/'+result[0].name;
			response.download(file, utf8.encode(result[0].comment));
		}
	});
	// var file = __dirname + '/public/upload/multipart/'+request.param('name');
	// response.download(file, request.param('name'));
	// response.download(file, utf8.encode(request.param('name')));
});

app.post('/upload', function(request, response){
	// var comment = request.param('comment');
	var file = request.files.image;
	
	if(file){
		var name = file.name;
		var comment = name;
		var path = file.path;
		var addPath = Date.now()+'_'+name;
		var addThumbPath = 'thumb_'+addPath;
		var outputPath = __dirname + '/public/upload/multipart/'+addPath;
		var outputThumbPath = __dirname + '/public/upload/multipart/'+addThumbPath;
		
		fs.rename(path, outputPath, function(error){
			easyimage.thumbnail({
				src: outputPath,
				dst: outputThumbPath,
				width:100, height:100,
				x:0, y:0
			}, function(err, img){
				if(err) console.log("err");
				response.redirect('/upload');
			});
			client.query('insert into myfile2 (name, comment) values (?, ?)', [addPath, comment], function(){
				response.redirect('/upload');
			});
		});
	}else{
		response.send(404);
	}
});

app.get('/uploadshow/:id', function(request, response){
	client.query('select * from myfile2 where _id=?', request.param('id'), function(error, result, fields){
		if(result.length>0){
			fs.readFile(__dirname+'/public/upload/multipart/'+result[0].name, function(error, data){
				response.writeHead(200, {'Content-Type':'image/png'});
				response.end(data);
			});
		}
	});
});

app.get('/uploaddelete/:id', function(request, response){
	client.query('select * from myfile2 where _id=?', request.param('id'), function(error, result, fields){
		if(result.length>0){
			fs.unlink(__dirname + '/public/upload/multipart/'+result[0].name, function(error){
				client.query('delete from myfile2 where _id=?', request.param('id'), function(){
					response.redirect('/upload');
				});
				fs.unlink(__dirname + '/public/upload/multipart/thumb_'+result[0].name, function(error){
					
				});
			});
		}
	});
});

app.get('/junggo', function(request, response){
	fs.readFile(__dirname+'/public/junggo/junggolist.html', 'utf8', function(error, data){
		client.query('select * from junggo order by orders asc', function(error, results){
			response.send(ejs.render(data, {
				data: results
			}));
		});
	});
});

app.get('/junggoadmin', function(request, response){
	fs.readFile(__dirname+'/public/junggo/junggoadmin.html', 'utf8', function(error, data){
		client.query('select * from junggo order by orders asc', function(error, results){
			response.send(ejs.render(data, {
				data: results
			}));
		});
	});
});

app.get('/junggoinsert', function(request, response){
	fs.readFile(__dirname+'/public/junggo/junggoinsert.html', function(error, data){
		response.send(data.toString());
	});
});

app.post('/junggoinsert', function(request, response){
	var body = request.body;
	console.log(body);
	client.query('insert into junggo (data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12, data13, data14, data15, orders) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [body.data1, body.data2, body.data3, body.data4, body.data5, body.data6, body.data7, body.data8, body.data9, body.data10, body.data11, '', '', '', '', 0], function(error, result, field){
		console.log(result.insertId);
		response.redirect('/junggoadmin');
		var file = request.files.image;
		
		if(file){
			// var name = file.name;
			// var comment = name;
			var path = file.path;
			// var addPath = Date.now()+'_'+name;
			// var addThumbPath = 'thumb_'+addPath;
			var outputPath = __dirname + '/public/junggo/multipart/car_'+result.insertId;
			// var outputThumbPath = __dirname + '/public/upload/multipart/'+addThumbPath;
// 			
			fs.rename(path, outputPath, function(error){
				// easyimage.thumbnail({
					// src: outputPath,
					// dst: outputThumbPath,
					// width:100, height:100,
					// x:0, y:0
				// }, function(err, img){
					// if(err) console.log("err");
					// response.redirect('/upload');
				// });
				// client.query('insert into myfile2 (name, comment) values (?, ?)', [addPath, comment], function(){
					// response.redirect('/upload');
				// });
			});
		}else{
			response.send(404);
		}
	});
});

app.get('/junggoedit/:id', function(request, response){
	client.query('select * from junggo where _id=?', request.param('id'), function(error, result, fields){
		console.log(result);
		if(result.length>0){
			fs.readFile(__dirname+'/public/junggo/junggoedit.html', 'utf8', function(error, data){
				response.send(ejs.render(data, {
					data: result
				}));
			});
		}
	});
});

app.post('/junggoedit/:id', function(request, response){
	var body = request.body;
	console.log(body);
	client.query('update junggo set data1=?, data2=?, data3=?, data4=?, data5=?, data6=?, data7=?, data8=?, data9=?, data10=?, data11=?, data12=?, data13=?, data14=?, data15=?, orders=? where _id=?', [body.data1, body.data2, body.data3, body.data4, body.data5, body.data6, body.data7, body.data8, body.data9, body.data10, body.data11, '', '', '', '', 0, request.param('id')], function(error, result, field){
		console.log(result.insertId);
		response.redirect('/junggoadmin');
		var file = request.files.image;
		
		// if(file){
			// var path = file.path;
			// var outputPath = __dirname + '/public/junggo/multipart/car_'+result.insertId;
// 
			// fs.rename(path, outputPath, function(error){
// 
			// });
		// }else{
			// response.send(404);
		// }
	});
});

app.get('/junggodelete/:id', function(request, response){
	client.query('select * from junggo where _id=?', request.param('id'), function(error, result, fields){
		if(result.length>0){
			fs.unlink(__dirname + '/public/upload/multipart/car_'+result[0]._id, function(error){
				client.query('delete from junggo where _id=?', request.param('id'), function(){
					response.redirect('/junggoadmin');
				});
				// fs.unlink(__dirname + '/public/upload/multipart/thumb_'+result[0].name, function(error){
// 					
				// });
			});
		}
	});
});

app.get('/junggoshow/:id', function(request, response){
	client.query('select * from junggo where _id=?', request.param('id'), function(error, result, fields){
		console.log(result);
		if(result.length>0){
			fs.readFile(__dirname+'/public/junggo/junggodetail.html', 'utf8', function(error, data){
				response.send(ejs.render(data, {
					data: result
				}));
			});
		}
	});
});

app.get('/junggoimage/:id', function(request, response){
	client.query('select * from junggo where _id=?', request.param('id'), function(error, result, fields){
		if(result.length>0){
			fs.readFile(__dirname+'/public/junggo/multipart/car_'+result[0]._id, function(error, data){
				response.writeHead(200, {'Content-Type':'image/png'});
				response.end(data);
			});
		}
	});
});

app.get('/dogangspring', function(request, response){
	fs.readFile(__dirname+'/public/dogang/dogangspring.html', function(error, data){
		response.send(data.toString());
	});
});

app.post('/dogangspring', function(request, response){
	var body = request.body;
	
	var on = body.on;
	var position = body.position;
	
	dogangSpringChangeAuto(on, position);
});

app.get('/couple', function(request, response){
	fs.readFile(__dirname+'/public/couplegosa/couplegosa.html', function(error, data){
		response.send(data.toString());
	});
});

app.get('/coupleauth', function(request, response){
	fs.readFile(__dirname+'/public/couplegosa/index.html', function(error, data){
		response.send(data.toString());
	});
});


function memberInfo(code, email, name, pw){
	this.code = code;
	this.email = email;
	this.name = name;
	this.pw = pw;
}

var memberConfirm = [];

var dogangSpring = {
	on: 1,
	month: 0,
	day: 0,
	hour: 0,
	minute: 0,
	position: 40
};

function dogangSpringChange(on, month, day, hour, minute, position){
	dogangSpring.on = on;
	dogangSpring.month = month;
	dogangSpring.day = day;
	dogangSpring.hour = hour;
	dogangSpring.minute = minute;
	dogangSpring.position = position;
};

function dogangSpringChangeAuto(on, position){
	var date = new Date();
	
	dogangSpring.on = on;
	dogangSpring.month = date.getMonth()+1;
	dogangSpring.day = date.getDate();
	if(date.getHours()%12 == 0) dogangSpring.hour = 12;
	else dogangSpring.hour = date.getHours()%12;
	dogangSpring.minute = date.getMinutes();
	dogangSpring.position = position;
}

function dogangSpringOff(){
	var date = new Date();
	
	dogangSpring.on = 1;
	dogangSpring.month = date.getMonth()+1;
	dogangSpring.day = date.getDate();
	if(date.getHours()%12 == 0) dogangSpring.hour = 12;
	else dogangSpring.hour = date.getHours()%12;
	dogangSpring.minute = date.getMinutes();
	dogangSpring.position = 40;
		
	var date = new Date();
	
	if(dogangSpring.month != date.getMonth()+1 || dogangSpring.day != date.getDate()){
		dogangSpring.on = 1;
		dogangSpring.month = date.getMonth()+1;
		dogangSpring.day = date.getDate();
		if(date.getHours()%12 == 0) dogangSpring.hour = 12;
		else dogangSpring.hour = date.getHours()%12;
		dogangSpring.minute = date.getMinutes();
		dogangSpring.position = 40;
	}
}

function dogangSpringLoop(){
	var date = new Date();
	
	if(dogangSpring.month != date.getMonth()+1 || dogangSpring.day != date.getDate()){
		dogangSpringOff();
	}
}
setInterval(dogangSpringLoop, 600000);


// ------------------------------------------------------------------------------------------------- //


var server = http.createServer(app);

server.listen(8002, function(){
	if(test){
		console.log('Server Running at http://127.0.0.1:8002');
	}else{
		console.log('Server Running at http://kaosu.kr');
	}
});

var io = socketio.listen(server);
io.set('log level', 2);
io.sockets.on('connection', function(socket){
	// socket.on('join_member', function(){
		// socket.join('kaosusoft');
		// socket.set('room', 'kaosusoft');
	// });
	// socket.on('join_member_disconn', function(){
// 		
	// });
	
	socket.on('join_lobby', function(){
		socket.join('lobby');
		socket.emit('lobby_chat_update', lobby_chat);
	});
	
	socket.on('lobby_chat_add', function(data){
		if(data.str.length>0){
			client.query('SELECT * from member where token = ?', data.session, function(error, result, fields){
				if(error){
					socket.emit('lobby_chat_error');
				}else{
					if(result.length>0){
						lobby_chat.push(new chat_piece(result[0].nickname, data.str));
						delete_chat();
						io.sockets.in('lobby').emit('lobby_chat_update', lobby_chat);
						// result[0].nickname;
					}else{
						socket.emit('lobby_chat_error');
					}
				}
			});
		}
	});
	
	socket.on('join_access', function(data){
		var name = data.name;
		var pw = data.pw;
		var nickname = data.nickname;
		
		if(name.length == 0){
			socket.emit('join_message', '아이디를 입력하세요.');
			return;
		}
		if(name.length<5 || name.length>10){
			socket.emit('join_message', '아이디는 5자와 10자 사이입니다.');
			return;
		}
		if(pw.length == 0){
			socket.emit('join_message', '패스워드를 입력하세요.');
			return;
		}
		if(pw.length<6 || pw.length>12){
			socket.emit('join_message', '패스워드는 6자와 12자 사이입니다.');
			return;
		}
		if(nickname.length == 0){
			socket.emit('join_message', '닉네임을 입력하세요.');
			return;
		}
		if(nickname.length>12){
			socket.emit('join_message', '닉네임이 너무 깁니다.');
			return;
		}
		if(!util.checkID(name)){
			socket.emit('join_message', 'ID는 영문, 숫자만 가능합니다.');
			return;
		}
		if(!util.checkNick(name)){
			socket.emit('join_message', '닉네임은 영문, 숫자, 한글만 가능합니다.');
			return;
		}
		
		var shasum = crypto.createHash('sha1');
		shasum.update(name+'#'+pw+'@kaosu');
		var output = shasum.digest('hex');
		
		// var shasum2 = crypto.createHash('sha1');
		// shasum2.update(body.inputN+body.inputP+'kaosu');
		// var output2 = shasum2.digest('hex');
		var output2 = uuid.v4();

		client.query('SELECT * from member where name = ?', name, function(error, result, fields){
			if(error){
				socket.emit('join_error');
			}else{
				if(result.length>0){
					socket.emit('join_already');
				}else{
					client.query('INSERT INTO member (name, password, token, nickname, num1, num2, num3, num4, num5, level, exp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, output, output2, nickname, 10000, 0, 0, 0, 0, 1, 0], function(errors, results, fieldss){
						if(errors){
							socket.emit('join_error');
						}else{
							socket.emit('join_success');
						}
					});
				}
			}
		});

	});
	socket.on('name_confirms', function(data){
		client.query('SELECT * from member where name = ?', data, function(error, result, fields){
			if(error){
				socket.emit('name_confirm', {
					type: 0,
					name: data
				});
			}else{
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
		client.query('SELECT * from member where nickname = ?', data, function(error, result, fields){
			if(error){
				socket.emit('nickname_confirm', {
					type: 0,
					name: data
				});
			}else{
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
		client.query('SELECT * from member where email = ?', data, function(error, result, fields){
			if(error){
				socket.emit('email_confirm', {
					type: 0,
					name: data
				});
			}else{
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
	
	socket.on('dogangSpring', function(data){
		socket.emit('dogangSpringSetting', {
			on: dogangSpring.on,
			month: dogangSpring.month,
			day: dogangSpring.day,
			hour: dogangSpring.hour,
			minute: dogangSpring.minute,
			position: dogangSpring.position
		});
	});
	
	socket.on('dogangSpringChangeOn', function(data){
		dogangSpringChangeAuto(data.on, data.position);
		socket.emit('dogangSpringSetting', {
			on: dogangSpring.on,
			month: dogangSpring.month,
			day: dogangSpring.day,
			hour: dogangSpring.hour,
			minute: dogangSpring.minute,
			position: dogangSpring.position
		});
	});
	
	socket.on('dogangSpringChangeOff', function(data){
		dogangSpringOff();
		socket.emit('dogangSpringSetting', {
			on: dogangSpring.on,
			month: dogangSpring.month,
			day: dogangSpring.day,
			hour: dogangSpring.hour,
			minute: dogangSpring.minute,
			position: dogangSpring.position
		});
	});
	
	socket.on('disconnect_lobby', function(){
		socket.leave('lobby');
	});
	
	socket.on('disconnect', function(){
		
	});
});

var lobby_chat = [];

function chat_piece(name, str){
	this.name = name;
	this.str = str;
}

function delete_chat(){
	while(lobby_chat.length>20){
		lobby_chat.shift();
	};
}


// ************************* Quoridor ****************************** //

function quoridor_room(){
	var quoridor_player = [];
	var quoridor_gallery = [];
}

function player(id, socket, name, session, nickname){
	this.socket = socket;
	this.id = id;
	this.name = name;
	this.session = session;
	this.nickname = nickname;
}
var quoridor = [];
var quoridor_stat = 0;
var playerID = 1;
var quoridor_ready = 0;

var quoridor_chat = [];

var quoridorMap = [
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];;

function quoridor_init(){
	quoridor_ready = 0;
	quoridor_stat = 0;
	quoridorMap = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];
	io.sockets.in('quoridor').emit('quoridor_map', quoridorMap);
	io.sockets.in('quoridor').emit('quoridor_init');
}

var quoridor_join = function(socket){
	socket.join('quoridor');
	socket.set('room', 'quoridor');
	
	var index = quoridor.push(new player(socket.id, 'player'+playerID));
	
	socket.playerName = quoridor[index-1].name;
	playerID++;
	
	socket.emit('join_success', socket.playerName);
	
	var list = [];
	for(var i in quoridor){
		list.push(quoridor[i].name);
	}
	io.sockets.in('quoridor').emit('quoridor_list_all', list);
	
	if(quoridor_stat == 0) socket.emit('quoridor_message', 0, "Wait other player");
	else if(quoridor_stat == 1) socket.emit('quoridor_message', 1, "Message : " +quoridor[0].name + "'s turn.");
	else if(quoridor_stat == 2) socket.emit('quoridor_message', 2, "Message : " +quoridor[1].name + "'s turn.");
	
	socket.emit('quoridor_map', quoridorMap);
	socket.emit('quoridor_chat', quoridor_chat);
};

var quoridor_move = function(socket, data){
	if(quoridor_stat == 1 && socket.id == quoridor[0].id){
		for(var i=0; i<17; i++){
			for(var j=0; j<17; j++){
				if(quoridorMap[i][j] == 1) {
					quoridorMap[i][j] = 0;
					break;
				}
			}
		}
		quoridorMap[data.y][data.x] = 1;
		io.sockets.in('quoridor').emit('quoridor_map', quoridorMap);
		io.sockets.in('quoridor').emit('quoridor_init');
		var flag = false;
		for(var i=0; i<17; i++){
			if(quoridorMap[i][16] == 1){
				flag = true;
				break;
			}
		}
		if(flag){
			quoridor_stat = 0;
			io.sockets.in('quoridor').emit('quoridor_message_win', 1);
		}else{
			quoridor_stat = 2;
			io.sockets.in('quoridor').emit('quoridor_message', 2, "Message : " +quoridor[1].name + "'s turn.");
			io.sockets.sockets[quoridor[1].id].emit('quoridor_permission', 2);
		}
	}else if(quoridor_stat == 2 && socket.id == quoridor[1].id){
		for(var i=0; i<17; i++){
			for(var j=0; j<17; j++){
				if(quoridorMap[i][j] == 2) {
					quoridorMap[i][j] = 0;
					break;
				}
			}
		}
		quoridorMap[data.y][data.x] = 2;
		io.sockets.in('quoridor').emit('quoridor_map', quoridorMap);
		io.sockets.in('quoridor').emit('quoridor_init');
		var flag = false;
		for(var i=0; i<17; i++){
			if(quoridorMap[i][0] == 2){
				flag = true;
				break;
			}
		}
		if(flag){
			quoridor_stat = 0;
			io.sockets.in('quoridor').emit('quoridor_message_win', 2);
		}else{
			quoridor_stat = 1;
			io.sockets.in('quoridor').emit('quoridor_message', 1, "Message : " +quoridor[0].name + "'s turn.");
			io.sockets.sockets[quoridor[0].id].emit('quoridor_permission', 1);
		}
	}
};

var quoridor_move_admin = function(socket, data){
	if(quoridor_stat == 1){
		if(quoridorMap[data.y][data.x]==2) return;
		for(var i=0; i<17; i++){
			for(var j=0; j<17; j++){
				if(quoridorMap[i][j] == 1) {
					quoridorMap[i][j] = 0;
					break;
				}
			}
		}
		quoridorMap[data.y][data.x] = 1;
		io.sockets.in('quoridor').emit('quoridor_map', quoridorMap);
		var flag = false;
		for(var i=0; i<17; i++){
			if(quoridorMap[i][16] == 1){
				flag = true;
				break;
			}
		}
		if(flag){
			quoridor_stat = 0;
			io.sockets.in('quoridor').emit('quoridor_message_win', 1);
		}
	}else if(quoridor_stat == 2){
		if(quoridorMap[data.y][data.x]==1) return;
		for(var i=0; i<17; i++){
			for(var j=0; j<17; j++){
				if(quoridorMap[i][j] == 2) {
					quoridorMap[i][j] = 0;
					break;
				}
			}
		}
		quoridorMap[data.y][data.x] = 2;
		io.sockets.in('quoridor').emit('quoridor_map', quoridorMap);
		var flag = false;
		for(var i=0; i<17; i++){
			if(quoridorMap[i][0] == 2){
				flag = true;
				break;
			}
		}
		if(flag){
			quoridor_stat = 0;
			io.sockets.in('quoridor').emit('quoridor_message_win', 2);
		}
	}
};

var quoridor_wall = function(socket, data){
	if(quoridor_stat == 1 && socket.id == quoridor[0].id){
		quoridorMap[data.y1][data.x1] = 3;
		quoridorMap[data.y2][data.x2] = 3;
		quoridorMap[data.y3][data.x3] = 3;
		io.sockets.in('quoridor').emit('quoridor_map', quoridorMap);
		io.sockets.in('quoridor').emit('quoridor_init');
		quoridor_stat = 2;
		io.sockets.in('quoridor').emit('quoridor_message', 2, "Message : " +quoridor[1].name + "'s turn.");
		io.sockets.sockets[quoridor[1].id].emit('quoridor_permission', 2);
	}else if(quoridor_stat == 2 && socket.id == quoridor[1].id){
		quoridorMap[data.y1][data.x1] = 3;
		quoridorMap[data.y2][data.x2] = 3;
		quoridorMap[data.y3][data.x3] = 3;
		io.sockets.in('quoridor').emit('quoridor_map', quoridorMap);
		io.sockets.in('quoridor').emit('quoridor_init');
		quoridor_stat = 1;
		io.sockets.in('quoridor').emit('quoridor_message', 1, "Message : " +quoridor[0].name + "'s turn.");
		io.sockets.sockets[quoridor[0].id].emit('quoridor_permission', 1);
	}
};

var quoridor_wall_admin = function(socket, data){
	if(quoridor_stat > 0){
		if(quoridorMap[data.y1][data.x1] == 0)	quoridorMap[data.y1][data.x1] = 3;
		else if(quoridorMap[data.y1][data.x1] == 3) quoridorMap[data.y1][data.x1] = 0;
		io.sockets.in('quoridor').emit('quoridor_map', quoridorMap);
	}
};

var quoridor_change = function(socket, data){
	while(true){
		for(var i=0; i<quoridor.length; i++){
			if(quoridor[i].name == data){
				data = data+'.';
				continue;
			}
		}
		break;
	}
	for(var i=0; i<quoridor.length; i++){
		if(quoridor[i].id == socket.id){
			quoridor[i].name = data;
			var list = [];
			for(var i in quoridor){
				list.push(quoridor[i].name);
			}
			io.sockets.in('quoridor').emit('quoridor_list_all', list);
			socket.emit('join_success', data);
		}
	}
};

var quoridor_chatf = function(socket, data){
	if(data.toString().length>13 && data.toString().slice(0, 13) == 'kaosu : /cmd '){
		var cmd = (data.toString()+' ').slice(13, -1);
		if(cmd == 'ban1'){
			console.log('ban1');
		}else if(cmd == 'ban2'){
			console.log('ban2');
		}else{
			if(Number(cmd) != NaN){
				var num = Number(cmd);
				var numi = Math.floor((num%10000)/100);
				var numj = num%100;
				if(numi%2 == 0 && numj%2==0){
					
				}else{
					if(quoridorMap[numi][numj]==3) quoridorMap[numi][numj]=0;
					else if(quoridorMap[numi][numj]==0) quoridorMap[numi][numj]=3;
				}
				io.sockets.in('quoridor').emit('quoridor_map', quoridorMap);
			}
		}
	}else{
		quoridor_chat.push(data);
		if(quoridor_chat.length>16){
			quoridor_chat = quoridor_chat.filter(function(element, index, array){
				return index>0;
			});
		}
		io.sockets.in('quoridor').emit('quoridor_chat', quoridor_chat);
	}
};

var quoridor_gg = function(socket){
	if(quoridor.length>1 && quoridor[0].id == socket.id){
		io.sockets.in('quoridor').emit('quoridor_message_win', 2);
		quoridor_init();
	}
	if(quoridor.length>1 && quoridor[1].id == socket.id){
		io.sockets.in('quoridor').emit('quoridor_message_win', 1);
		quoridor_init();
	}
};

var quoridor_disconnect = function(socket){
	if(quoridor.length>1 && quoridor[0].id == socket.id){
		io.sockets.in('quoridor').emit('quoridor_message', 0, quoridor[0].name + " left game.");
		io.sockets.in('quoridor').emit('quoridor_message_win', 2);
		quoridor_init();
	}
	if(quoridor.length>1 && quoridor[1].id == socket.id){
		io.sockets.in('quoridor').emit('quoridor_message', 0, quoridor[1].name + " left game.");
		io.sockets.in('quoridor').emit('quoridor_message_win', 1);
		quoridor_init();
	}
	
	quoridor = quoridor.filter(function(element, index, array){
		return element.id != socket.id;
	});
	var list = [];
	for(var i in quoridor){
		list.push(quoridor[i].name);
	}
	io.sockets.in('quoridor').emit('quoridor_list_all', list);
};

function gameLoop(){
	if(quoridor_stat == 0 && quoridor.length>1){
		if(quoridor_ready<6000){
			quoridor_ready += 1000;
			io.sockets.in('quoridor').emit('quoridor_message', 0, "Message : " +Math.floor((6000-quoridor_ready)/1000) + " sec.");
		}else{
			quoridor_init();
			quoridor_stat = 1;
			io.sockets.in('quoridor').emit('quoridor_message', 1, "Message : " +quoridor[0].name + "'s turn.");
			io.sockets.sockets[quoridor[0].id].emit('quoridor_permission', 1);
			io.sockets.in('quoridor').emit('quoridor_message_win', 0);
		}
	}
}

setInterval(gameLoop, 1000);

var date = new Date();

console.log(date.getTime());
