var web = require('./web.js');


// ************************* Quoridor *************************** //

var quoridor_server = [];

quoridor_server.push(new quoridor_room());
quoridor_server.push(new quoridor_room());
quoridor_server.push(new quoridor_room());

function quoridor_room(){
	this.quoridor_player = [];
	this.quoridor_gallery = [];
	this.quoridor_chat = [];
	this.quoridor_map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
	this.quoridor_turn = 0;
	this.quoridor_delay = 0;
	this.quoridor_expire_max = 10000;
	this.quoridor_expire = this.quoridor_expire_max;
}

exports.quoridor_room_init = function(room){
	if(room==1 || room==2 || room==3){
		for(var i=0; i<17; i++){
			for( var j=0; j<17; j++){
				quoridor_server[room].quoridor_map[i][j] = 0;
			}
		}
		quoridor_server[room].quoridor_map[8][0] = 1;
		quoridor_server[room].quoridor_map[8][16] = 2;
		quoridor_server[room].quoridor_turn = 0;
		quoridor_server[room].quoridor_delay = 0;
	}
};

exports.quoridor_add_gallery = function(player, room){
	if(room==1 || room==2 || room==3){
		for(var i=0; i<3; i++){
			for(var j in quoridor_server[i].quoridor_gallery){
				if(quoridor_server[i].quoridor_gallery[j].id == player.id){
					quoridor_server[i].quoridor_gallery.splice(j,1);
					console.log(player.nickname+'님이 기존에 갤러리에 속해 있으므로 탈퇴됩니다.');
				}
			}
		}
		quoridor_server[room-1].quoridor_gallery.push(player);
		console.log(player.nickname+'님이 기존에 갤러리에 추가되어 갤러리는 총 '+quoridor_server[room-1].quoridor_gallery.length+'명입니다.');
	}
};

var oldtime = 0;

exports.quoridorLoop = function(time){
	var gap = time - oldtime;
	for(var i=0; i<3; i++){
		for(var j in quoridor_server[i].quoridor_gallery){
			quoridor_server[i].quoridor_gallery[j].expire -= gap;
			if(quoridor_server[i].quoridor_gallery[j].expire<0) {
				quoridor_server[i].quoridor_gallery[j].expire_max+=1;
				quoridor_server[i].quoridor_gallery[j].expire = quoridor_server[i].quoridor_gallery[j].expire_time;
			}
			if(quoridor_server[i].quoridor_gallery[j].expire_max>2) {
				quoridor_server[i].quoridor_gallery.splice(j,1);
				break;
			}
		}
	}
	oldtime = time;
};

exports.quoridorLog = function(room){
	console.log(quoridor_server[room-1].quoridor_gallery.length);
};

function player(id, name, nickname){
	this.id = id;
	this.name = name;
	this.nickname = nickname;
}

function chat_piece(nickname, str){
	this.nickname = nickname;
	this.str = str;
}

exports.quoridorGallery = function(room){
	var gallery = [];
	for(var i in quoridor_server[room-1].quoridor_gallery){
		gallery.push(new player(quoridor_server[room-1].quoridor_gallery[i].id, quoridor_server[room-1].quoridor_gallery[i].name, quoridor_server[room-1].quoridor_gallery[i].nickname));
	}
	return gallery;
};

exports.quoridorChat = function(room){
	return quoridor_server[room-1].quoridor_chat;
};

exports.quoridorChatInput = function(session, str, room){
	var index = -1;
	for(var i in quoridor_server[room-1].quoridor_gallery){
		if(quoridor_server[room-1].quoridor_gallery[i].session == session){
			index = i;
			break;
		} 
	}
	if(index == -1) return uoridor_server[room-1].quoridor_chat;
	else {
		quoridor_server[room-1].quoridor_chat.push(new chat_piece(quoridor_server[room-1].quoridor_gallery[index].nickname, str));
		while(quoridor_server[room-1].quoridor_chat.length>17){
			quoridor_server[room-1].quoridor_chat.shift();
		};
		return quoridor_server[room-1].quoridor_chat;
	}
};

exports.quoridorExpire = function(socket){
	for(var j=0; j<3; j++){
		for(var i in quoridor_server[j].quoridor_gallery){
			if(quoridor_server[j].quoridor_gallery[i].socket.id == socket.id){
				quoridor_server[j].quoridor_gallery[i].expire = quoridor_server[j].quoridor_gallery[i].expire_time;
				quoridor_server[j].quoridor_gallery[i].expire_max = 0;
			}
		}
	}
};

exports.quoridorExit = function(session, room){
	for(var i in quoridor_server[room-1].quoridor_gallery){
		if(quoridor_server[room-1].quoridor_gallery[i].session == session){
			console.log(quoridor_server[room-1].quoridor_gallery[i].nickname+' 삭제!');
			quoridor_server[room-1].quoridor_gallery.splice(i,1);
			break;
		}
	}
};