var socketio = require('socket.io');
var express = require('express');
var http = require('http');
// var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
// var nodemailer = require('nodemailer');
var crypto = require('crypto');
var mysql = require('mysql');
var utf8 = require('utf8');
// var easyimage = require('easyimage');
var uuid = require('node-uuid');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('./util.js');
var mPlayer = require('./player.js'); // Player
var quoridor = require('./quoridor.js'); // Quoridor

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

app.use(cookieParser());
// app.use(express.limit('10mb'));
// app.use(express.bodyParser({uploadDir: __dirname+'/public/upload/multipart'}));
// app.use(app.router);
app.set('views', __dirname + '/public'); 
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(request, response){
	if(request.cookies.session == undefined){
		response.render('index.html', {
			data: {
				test : test,
				result : 0
			}
		});
	}else{		
		client.query('SELECT * from member where token = ?', request.cookies.session, function(error, result, fields){
			if(error){
				response.redirect('/logout');
			}else{
				if(result.length>0){
					var maxAge = 7 * 24 * 60 * 60 * 1000;
					response.cookie('session', result[0].token, {maxAge: maxAge});
					response.render('index.html', {
						data: {
							test : test,
							result : 1,
							name: result[0].name,
							nickname: result[0].nickname,
							member : member_count
						}
					});
				}else{
					response.redirect('/logout');
				}
			}
		});
	}
});

app.use(express.static(__dirname+'/public'));

app.get('/kaosu', function(request, response){
	response.render('index.html', {
		data: {
			test : test,
			result : 1,
			name: 'kaosu',
			nickname: '가오수',
			member : 1
		}
	});
});

app.get('/random', function(request, response){
	response.render('bokbulbok/index.html');
});

app.get('/sadari', function(request, response){
	response.render('bokbulbok/sadari.html');
});

app.get('/bad_access', function(request, response){
	response.render('bad_access.html');
});

app.get('/logout', function(request, response){
	response.clearCookie('session');
	response.redirect('/');
});

app.get('/join', function(request, response){
	response.render('join.html');
});

app.get('/login_error/:id', function(request, response){
	var id = request.params.id;
	response.render('index_redirect.html', {
		data: id
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
						var maxAge = 7 * 24 * 60 * 60 * 1000;
						response.cookie('session', output2, {maxAge: maxAge});
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
					var playerNum = quoridor.quoridorPlayerNum();
					var maxAge = 7 * 24 * 60 * 60 * 1000;
					response.cookie('session', result[0].token, {maxAge: maxAge});
					response.render('lobby.html', {
						data: {
							test : test,
							name: result[0].name,
							nickname: result[0].nickname,
							qNum1: playerNum.room1,
							qNum2: playerNum.room2,
							qNum3: playerNum.room3
						}
					});
				}else{
					response.redirect('/bad_access');
				}
			}
		});
	}
});

app.get('/lobby_error/:id', function(request, response){
	var id = request.params.id;
	response.render('lobby_redirect.html', {
		data: id
	});
});

app.get('/game_quoridor/:room', function(request, response){
	var room = request.params.room;
	if(room!='1' && room!='2' && room!='3'){
		response.redirect('/lobby_error/0');
		return;
	}
	
	if(request.cookies.session == undefined){
		response.redirect('/bad_access');
	}else{		
		client.query('SELECT * from member where token = ?', request.cookies.session, function(error, result, fields){
			if(error){
				response.redirect('/bad_access');
			}else{
				if(result.length>0){
					var maxAge = 7 * 24 * 60 * 60 * 1000;
					response.cookie('session', result[0].token, {maxAge: maxAge});
					response.render('quoridor/index.html', {
						data: {
							test : test,
							name: result[0].name,
							nickname: result[0].nickname,
							room: room
						}
					});
				}else{
					response.redirect('/bad_access');
				}
			}
		});
	}
});

app.get('/game_golf/:room', function(request, response){
	var room = request.params.room;
	if(room!='1' && room!='2' && room!='3'){
		response.redirect('/lobby_error/0');
		return;
	}
	
	if(request.cookies.session == undefined){
		response.redirect('/bad_access');
	}else{		
		client.query('SELECT * from member where token = ?', request.cookies.session, function(error, result, fields){
			if(error){
				response.redirect('/bad_access');
			}else{
				if(result.length>0){
					var maxAge = 7 * 24 * 60 * 60 * 1000;
					response.cookie('session', result[0].token, {maxAge: maxAge});
					response.render('golf/index.html', {
						data: {
							test : test,
							name: result[0].name,
							nickname: result[0].nickname,
							room: room
						}
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


// app.get('/upload', function(request, response){
	// fs.readFile(__dirname+'/public/upload/index.html', 'utf8', function(error, data){
		// client.query('select * from myfile2 order by _id asc', function(error, results){
			// response.send(ejs.render(data, {
				// data: results
			// }));
		// });
	// });
// });

// app.get('/download/:id', function(request, response){
	// client.query('select * from myfile2 where _id=?', request.param('id'), function(error, result, fields){
		// if(result.length>0){
			// var file = __dirname + '/public/upload/multipart/'+result[0].name;
			// response.download(file, utf8.encode(result[0].comment));
		// }
	// });
	// var file = __dirname + '/public/upload/multipart/'+request.param('name');
	// response.download(file, request.param('name'));
	// response.download(file, utf8.encode(request.param('name')));
// });

// app.post('/upload', function(request, response){
	// // var comment = request.param('comment');
	// var file = request.files.image;
// 	
	// if(file){
		// var name = file.name;
		// var comment = name;
		// var path = file.path;
		// var addPath = Date.now()+'_'+name;
		// var addThumbPath = 'thumb_'+addPath;
		// var outputPath = __dirname + '/public/upload/multipart/'+addPath;
		// var outputThumbPath = __dirname + '/public/upload/multipart/'+addThumbPath;
// 		
		// fs.rename(path, outputPath, function(error){
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
		// });
	// }else{
		// response.send(404);
	// }
// });

// app.get('/uploadshow/:id', function(request, response){
	// client.query('select * from myfile2 where _id=?', request.param('id'), function(error, result, fields){
		// if(result.length>0){
			// fs.readFile(__dirname+'/public/upload/multipart/'+result[0].name, function(error, data){
				// response.writeHead(200, {'Content-Type':'image/png'});
				// response.end(data);
			// });
		// }
	// });
// });

// app.get('/uploaddelete/:id', function(request, response){
	// client.query('select * from myfile2 where _id=?', request.param('id'), function(error, result, fields){
		// if(result.length>0){
			// fs.unlink(__dirname + '/public/upload/multipart/'+result[0].name, function(error){
				// client.query('delete from myfile2 where _id=?', request.param('id'), function(){
					// response.redirect('/upload');
				// });
				// fs.unlink(__dirname + '/public/upload/multipart/thumb_'+result[0].name, function(error){
// 					
				// });
			// });
		// }
	// });
// });



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
	
	socket.on('join_lobby', function(data){
		lobby_join(socket, data);
	});
	
	socket.on('lobby_chat_add', function(data){
		if(data.str.length>0){
			client.query('SELECT * from member where token = ?', data.session, function(error, result, fields){
				if(error){
					socket.emit('lobby_chat_error');
				}else{
					if(result.length>0){
						server_data.lobby_chat.push(new chat_piece(result[0].nickname, data.str));
						delete_chat();
						io.sockets.in('lobby').emit('lobby_chat_update', server_data.lobby_chat);
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
							memberCount();
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
	
	socket.on('quoridor_join', function(data){
		quoridor_join(socket, data.session, data.room);
	});
	
	socket.on('quoridor_player_ask', function(data){
		quoridor_player_ask(socket, data.session, data.room);
	});
	
	socket.on('quoridor_move', function(data){
		quoridor_move(socket, data);
	});
	
	socket.on('quoridor_wall', function(data){
		quoridor_wall(socket, data);
	});
	
	// socket.on('quoridor_move_admin', function(data){
		// quoridor_move_admin(socket, data);
	// });
// 	
	// socket.on('quoridor_wall_admin', function(data){
		// quoridor_wall_admin(socket, data);
	// });
// 	
	// socket.on('quoridor_change', function(data){
		// quoridor_change(socket, data);
	// });
	
	socket.on('quoridor_chat_input', function(data){
		quoridor_chat_input(socket, data);
	});
	
	// socket.on('quoridor_gg', function(){
		// quoridor_gg(socket);
	// });
	
	socket.on('quoridor_exit', function(data){
		quoridor.quoridorExit(data.session, data.room);
		var roomname = 'quoridor'+data.room;
		socket.leave(roomname);
		var gameData = quoridor.quoridorGameData(data.room);
		io.sockets.in(roomname).emit('quoridor_data', gameData);
		var gallery = quoridor.quoridorGallery(data.room);
		io.sockets.in(roomname).emit('quoridor_gallery', gallery);
	});
	
	socket.on('expire_receive', function(){
		quoridor.quoridorExpire(socket);
	});
	
	socket.on('disconnect_lobby', function(data){
		mPlayer.disconnectPlayer(data);
		socket.leave('lobby');
		io.sockets.in('lobby').emit('lobby_player_update', mPlayer.getLobbyPlayerSimple());
	});
	
	socket.on('disconnect', function(){
		// console.log('삭제!');
		// quoridor.quoridorExit(socket);
	});
});

// ************************* All *********************************** //

var member_count = 0;
memberCount();

function memberCount(){
	client.query('SELECT * from member', function(error, result, fields){
		member_count = result.length;
		console.log('현재 회원수는 '+member_count+'명입니다.');
	});
	return member_count;
}

function kaosu_data(){
	this.db_timer_reset = 600000;
	this.lobby_chat = [];
	this.db_timer = this.db_timer_reset;
	this.date = new Date();
	this.time = this.date.getTime();
}

var server_data = new kaosu_data();

function chat_piece(name, str){
	this.name = name;
	this.str = str;
}

function delete_chat(){
	while(server_data.lobby_chat.length>20){
		server_data.lobby_chat.shift();
	};
}


function player(socket, session, id, name, nickname){
	this.socket = socket;
	this.id = id;
	this.name = name;
	this.session = session;
	this.nickname = nickname;
	this.expire_time = 10000;
	this.expire = this.expire_time;
	this.expire_max = 0;
}

var expire_init_timer_max = 5000;
var expire_init_timer = expire_init_timer_max;

function gameLoop(){
	var date = new Date();
	var time = date.getTime();
	var gap = time - server_data.time;
	server_data.db_timer-=gap;
	if(server_data.db_timer<0) {
		server_data.db_timer = server_data.db_timer_reset;
		console.log('lobby_chat : '+server_data.lobby_chat.length+' - '+date.getMonth()+'월 '+date.getDate()+'일 '+date.getHours()+'시 '+date.getMinutes()+'분');
		client.query('SELECT 1', function(error, result, fields){
		});
	}
	
	expire_init_timer -= gap;
	if(expire_init_timer<0){
		expire_init_timer = expire_init_timer_max;
		io.sockets.emit('expire_send');
	}
	
	quoridor.quoridorLoop(time);

	server_data.date = new Date();
	server_data.time = server_data.date.getTime();
}

setInterval(gameLoop, 500);

// ************************** Lobby ******************************** //

exports.lobbyGamePlayerUpdate = function(){
	var quoridorPlayer = quoridor.quoridorPlayerNum();
	io.sockets.in('lobby').emit('lobby_game_player_update', {
		quoridor: quoridorPlayer
	});
};

var lobby_join = function(socket, data){
	socket.join('lobby');
	
	client.query('SELECT * from member where token = ?', data.session, function(error, result, fields){
		if(error){
			response.redirect('/lobby_redirect/0');
		}else{
			if(result.length>0){
				var id = result[0].id;
				var name = result[0].name;
				var nickname = result[0].nickname;
				mPlayer.lobbyPlayerAdd(new player(socket, data.session, id, name, nickname));
				socket.emit('lobby_chat_update', server_data.lobby_chat);
				io.sockets.in('lobby').emit('lobby_player_update', mPlayer.getLobbyPlayerSimple());
			}else{
				response.redirect('/lobby_redirect/0');
			}
		}
	});
};


// ************************* Quoridor ****************************** //

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

var quoridor_join = function(socket, session, room){
	if(room==1) socket.join('quoridor1');
	else if(room==2) socket.join('quoridor2');
	else if(room==3) socket.join('quoridor3');
	else return false;
	
	client.query('SELECT * from member where token = ?', session, function(error, result, fields){
		if(error){
			response.redirect('/lobby_redirect/0');
		}else{
			if(result.length>0){
				var id = result[0].id;
				var name = result[0].name;
				var nickname = result[0].nickname;
				quoridor.quoridor_add_gallery(new player(socket, session, id, name, nickname), room);
				var gallery = quoridor.quoridorGallery(room);
				var gameData = quoridor.quoridorGameData(room);
				gameData.myid = id;
				var roomname = 'quoridor'+room;
				io.sockets.in(roomname).emit('quoridor_gallery', gallery);
				socket.emit('quoridor_chat', quoridor.quoridorChat(room));
				socket.emit('quoridor_data', gameData);
			}else{
				response.redirect('/lobby_redirect/0');
			}
		}
	});
};

exports.quoridor_player_message = function(room){
	var roomname = 'quoridor'+room;
	io.sockets.in(roomname).emit('quoridor_chat', quoridor.quoridorChat(room));
};

exports.quoridor_player_update = function(room){
	var gameData = quoridor.quoridorGameData(room);
	var roomname = 'quoridor'+room;
	io.sockets.in(roomname).emit('quoridor_data', gameData);
};

var quoridor_player_ask = function(socket, session, room){
	if(room!=1 && room!=2 && room!=3) {response.redirect('/lobby_redirect/0'); return false;}
	
	client.query('SELECT * from member where token = ?', session, function(error, result, fields){
		if(error){
			response.redirect('/lobby_redirect/0');
		}else{
			if(result.length>0){
				var id = result[0].id;
				var name = result[0].name;
				var nickname = result[0].nickname;
				var flag = quoridor.quoridor_add_player(id, room);
				var gameData = quoridor.quoridorGameData(room);
				var roomname = 'quoridor'+room;
				io.sockets.in(roomname).emit('quoridor_data', gameData);
			}else{
				response.redirect('/lobby_redirect/0');
			}
		}
	});
};

var quoridor_move = function(socket, data){
	var session = data.session;
	
	client.query('SELECT * from member where token = ?', session, function(error, result, fields){
		if(error){
			response.redirect('/lobby_redirect/0');
		}else{
			if(result.length>0){
				var id = result[0].id;
				quoridor.quoridorMove(id, data);
			}else{
				response.redirect('/lobby_redirect/0');
			}
		}
	});
};

var quoridor_wall = function(socket, data){
	var session = data.session;
	
	client.query('SELECT * from member where token = ?', session, function(error, result, fields){
		if(error){
			response.redirect('/lobby_redirect/0');
		}else{
			if(result.length>0){
				var id = result[0].id;
				quoridor.quoridorWall(id, data);
			}else{
				response.redirect('/lobby_redirect/0');
			}
		}
	});
};

var quoridor_chat_input = function(socket, data){
	var session = data.session;
	var str = data.str;
	var room = data.room;
	
	var chat = quoridor.quoridorChatInput(session, str, room);
	var roomname = 'quoridor'+room;
	io.sockets.in(roomname).emit('quoridor_chat', chat);
	
	return;
	
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

var day;
switch(server_data.date.getDay()){
	case 0: day='일';break; case 1: day='월';break; case 2: day='화';break; case 3: day='수';break; 
	case 4: day='목';break; case 5: day='금';break; case 6: day='토';break;
}

timeLog();

function timeLog(){
	console.log((server_data.date.getMonth()+1)+'월 '+server_data.date.getDate()+'일 '
+day+'요일 '+(server_data.date.getHours())+'시 '+server_data.date.getMinutes()+'분');
}
