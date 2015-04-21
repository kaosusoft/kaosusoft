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

var client = mysql.createConnection({
	host: '10.0.0.1',
	port: 3306,
	user: 'lible',
	password: 'kaosu123',
	database: 'lible'
});

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
		shasum.update(body.inputP+'kaosu');
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

function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
	c = str.charCodeAt(i);
	if ((c >= 0x0001) && (c <= 0x007F)) {
	    out += str.charAt(i);
	} else if (c > 0x07FF) {
	    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
	    out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
	    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
	} else {
	    out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
	    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
	}
    }
    return out;
}

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
	
	socket.on('disconnect', function(){
		
	});
});

