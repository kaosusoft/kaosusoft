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
	this.quoridor_count = 0;
	this.quoridor_count_fightReady = 5000;
	this.quoridor_count_playerThink = 20000;
	this.quoridor_count_nextGame = 5000;
	// turn
	// 0 - 참가자 신청단계 : 2명이 다 차면 1로 넘어감. 카운트 시작.
	// 1 - 대결 시작 준비단계 : 카운트를 5초 세서 대결이 시작되서 2로 넘어감. 카운트 시작
	// 2 - 1번 플레이어 턴 : 카운트가 다 되면 턴이 넘어감. 명령이 들어와도 턴이 넘어감. 카운트 시작.
	// 3 - 2번 플레이어 턴 : 2로 돌아감.
	// 4 - 게임 끝. 카운트 시작.
	this.quoridor_point1 = 0;
	this.quoridor_point2 = 0;
	this.quoridor_permission = 0;
	this.quoridor_expire_max = 10000;
	this.quoridor_expire = this.quoridor_expire_max;
}

function quoridor_room_init(room, init){
	if(room==1 || room==2 || room==3){
		for(var i=0; i<17; i++){
			for( var j=0; j<17; j++){
				quoridor_server[room-1].quoridor_map[i][j] = 0;
			}
		}
		quoridor_server[room-1].quoridor_map[8][0] = 1;
		quoridor_server[room-1].quoridor_map[8][16] = 2;
		quoridor_server[room-1].quoridor_turn = 0;
		quoridor_server[room-1].quoridor_count = 0;
		if(init){
			quoridor_server[room-1].quoridor_point1 = 0;
			quoridor_server[room-1].quoridor_point2 = 0;
		}
	}
};

exports.quoridor_add_player = function(id, room){
	if(quoridor_server[room-1].quoridor_player.length>1) return false;
	for(var i in quoridor_server[room-1].quoridor_gallery){
		if(quoridor_server[room-1].quoridor_gallery[i].id == id){
			var flag = true;
			for(var j in quoridor_server[room-1].quoridor_player){
				if(quoridor_server[room-1].quoridor_player[j].id == id) flag = false;
			}
			if(flag) {
				quoridor_server[room-1].quoridor_player.push(quoridor_server[room-1].quoridor_gallery[i]);
				str = '';
				for(var j in quoridor_server[room-1].quoridor_player){
					if(j!=0) str += '님과 ';
					str += quoridor_server[room-1].quoridor_player[j].nickname;
				}
				console.log('현재 대전자는 '+str+'님입니다.');
				return true;
			}else{
				
				return false;
			}
		}else{
			
		}
	}
	return false;
};

exports.quoridor_add_gallery = function(player, room){
	if(room==1 || room==2 || room==3){
		for(var i=0; i<3; i++){
			for(var j in quoridor_server[i].quoridor_gallery){
				if(quoridor_server[i].quoridor_gallery[j].id == player.id){
					quoridor_server[i].quoridor_gallery.splice(j,1);
					console.log(player.nickname+'님이 갤러리에 속해 있으므로 탈퇴됩니다.');
				}
			}
		}
		quoridor_server[room-1].quoridor_gallery.push(player);
		console.log(player.nickname+'님이 갤러리에 추가되어 갤러리는 총 '+quoridor_server[room-1].quoridor_gallery.length+'명입니다.');
	}
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

exports.quoridorGameData = function(room){
	var data = [];
	for(var i in quoridor_server[room-1].quoridor_player){
		data.push(new player(quoridor_server[room-1].quoridor_player[i].id, quoridor_server[room-1].quoridor_player[i].name, quoridor_server[room-1].quoridor_player[i].nickname));
	}
	var gameData = {
		player: data,
		map: quoridor_server[room-1].quoridor_map,
		myid : 0,
		turn : quoridor_server[room-1].quoridor_turn,
		point1 : quoridor_server[room-1].quoridor_point1,
		point2 : quoridor_server[room-1].quoridor_point2,
		count : quoridor_server[room-1].quoridor_count
	};
	return gameData;
};

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

exports.quoridorMove = function(id, data){
	var room = data.room;
	
	if(quoridor_server[room-1].quoridor_player.length<2) return;
	
	var old_x = -1;
	var old_y = -1;
	var new_x = data.x;
	var new_y = data.y;
	var end_flag = false;
	
	if(quoridor_server[room-1].quoridor_turn == 2 && quoridor_server[room-1].quoridor_player[0].id == id){
		for(var i=0; i<17; i++){
			for(var j=0; j<17; j++){
				if(quoridor_server[room-1].quoridor_map[i][j] == 1) {
					old_x = j;
					old_y = i;
					var can_move = isCanMove(room, new_x, new_y, 1);
					if(can_move){
						quoridor_server[room-1].quoridor_map[old_y][old_x]=0;
						quoridor_server[room-1].quoridor_map[new_y][new_x]=1;
						quoridor_server[room-1].quoridor_turn = 3;
						quoridor_server[room-1].quoridor_count = quoridor_server[room-1].quoridor_count_playerThink;
						console.log('이동 성공!'+old_x+'/'+old_y+'/'+new_x+'/'+new_y+'/'+quoridor_server[room-1].quoridor_turn);
						web.quoridor_player_update(room);
					}
					end_flag = true;
					break;
				}
			}
			if(end_flag) break;
		}
	}else if(quoridor_server[room-1].quoridor_turn == 3 && quoridor_server[room-1].quoridor_player[1].id == id){
		for(var i=0; i<17; i++){
			for(var j=0; j<17; j++){
				if(quoridor_server[room-1].quoridor_map[i][j] == 2) {
					old_x = j;
					old_y = i;
					var can_move = isCanMove(room, old_x, old_y, new_x, new_y, 2);
					if(can_move){
						quoridor_server[room-1].quoridor_map[old_y][old_x]=0;
						quoridor_server[room-1].quoridor_map[new_y][new_x]=2;
						quoridor_server[room-1].quoridor_turn = 2;
						quoridor_server[i].quoridor_count = quoridor_server[i].quoridor_count_playerThink;
						web.quoridor_player_update(i+1);
					}
					end_flag = true;
					break;
				}
			}
			if(end_flag) break;
		}
	}
	
	// if(quoridor_stat == 1 && socket.id == quoridor[0].id){
		// for(var i=0; i<17; i++){
			// for(var j=0; j<17; j++){
				// if(quoridorMap[i][j] == 1) {
					// quoridorMap[i][j] = 0;
					// break;
				// }
			// }
		// }
		// quoridorMap[data.y][data.x] = 1;
		// io.sockets.in('quoridor').emit('quoridor_map', quoridorMap);
		// io.sockets.in('quoridor').emit('quoridor_init');
		// var flag = false;
		// for(var i=0; i<17; i++){
			// if(quoridorMap[i][16] == 1){
				// flag = true;
				// break;
			// }
		// }
		// if(flag){
			// quoridor_stat = 0;
			// io.sockets.in('quoridor').emit('quoridor_message_win', 1);
		// }else{
			// quoridor_stat = 2;
			// io.sockets.in('quoridor').emit('quoridor_message', 2, "Message : " +quoridor[1].name + "'s turn.");
			// io.sockets.sockets[quoridor[1].id].emit('quoridor_permission', 2);
		// }
	// }else if(quoridor_stat == 2 && socket.id == quoridor[1].id){
		// for(var i=0; i<17; i++){
			// for(var j=0; j<17; j++){
				// if(quoridorMap[i][j] == 2) {
					// quoridorMap[i][j] = 0;
					// break;
				// }
			// }
		// }
		// quoridorMap[data.y][data.x] = 2;
		// io.sockets.in('quoridor').emit('quoridor_map', quoridorMap);
		// io.sockets.in('quoridor').emit('quoridor_init');
		// var flag = false;
		// for(var i=0; i<17; i++){
			// if(quoridorMap[i][0] == 2){
				// flag = true;
				// break;
			// }
		// }
		// if(flag){
			// quoridor_stat = 0;
			// io.sockets.in('quoridor').emit('quoridor_message_win', 2);
		// }else{
			// quoridor_stat = 1;
			// io.sockets.in('quoridor').emit('quoridor_message', 1, "Message : " +quoridor[0].name + "'s turn.");
			// io.sockets.sockets[quoridor[0].id].emit('quoridor_permission', 1);
		// }
	// }
	
};

var quoridorChatInputSystem = function(str, room){
	quoridor_server[room-1].quoridor_chat.push(new chat_piece('System', str));
	while(quoridor_server[room-1].quoridor_chat.length>16){
		quoridor_server[room-1].quoridor_chat.shift();
	};
	return quoridor_server[room-1].quoridor_chat;
};

var quoridorChatInput = function(session, str, room){
	var index = -1;
	for(var i in quoridor_server[room-1].quoridor_gallery){
		if(quoridor_server[room-1].quoridor_gallery[i].session == session){
			index = i;
			break;
		} 
	}
	if(index == -1) return quoridor_server[room-1].quoridor_chat;
	else {
		quoridor_server[room-1].quoridor_chat.push(new chat_piece(quoridor_server[room-1].quoridor_gallery[index].nickname, str));
		while(quoridor_server[room-1].quoridor_chat.length>16){
			quoridor_server[room-1].quoridor_chat.shift();
		};
		return quoridor_server[room-1].quoridor_chat;
	}
};

exports.quoridorChatInput = quoridorChatInput;

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
			var id = quoridor_server[room-1].quoridor_gallery[i].id;
			for(var j in quoridor_server[room-1].quoridor_player){
				if(quoridor_server[room-1].quoridor_player[j].id == id){
					quoridor_server[room-1].quoridor_player.splice(j,1);
					console.log(quoridor_server[room-1].quoridor_gallery[i].nickname+' 대전자에서 삭제!');
					if(quoridor_server[room-1].quoridor_turn>0){
						quoridor_room_init(room, true);
					}
					var str = quoridor_server[room-1].quoridor_gallery[i].nickname+' 플레이어가 포기하였습니다.';
					quoridorChatInputSystem(str, room);
					web.quoridor_player_message(room);
					break;
				}
			}
			console.log(quoridor_server[room-1].quoridor_gallery[i].nickname+' 갤러리에서 삭제!');
			quoridor_server[room-1].quoridor_gallery.splice(i,1);
			break;
		}
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
		
		if(quoridor_server[i].quoridor_count>0) {
			if(quoridor_server[i].quoridor_turn==1){
				var old_sec = Math.floor(quoridor_server[i].quoridor_count/1000);
				var new_sec = Math.floor((quoridor_server[i].quoridor_count-gap)/1000);
				if(old_sec != new_sec && old_sec<5 && old_sec>0){
					var str = '게임이 '+old_sec+'초후에 시작됩니다.';
					quoridorChatInputSystem(str, i+1);
					web.quoridor_player_message(i+1);
					web.quoridor_player_update(i+1);
				}
			}
			if(quoridor_server[i].quoridor_turn==2 || quoridor_server[i].quoridor_turn==3){
				var old_sec = Math.floor(quoridor_server[i].quoridor_count/1000);
				var new_sec = Math.floor((quoridor_server[i].quoridor_count-gap)/1000);
				if(old_sec != new_sec){
					web.quoridor_player_update(i+1);
				}
			}
			quoridor_server[i].quoridor_count -= gap;
		}
		
		if(quoridor_server[i].quoridor_turn == 0 && quoridor_server[i].quoridor_player.length>1){
			quoridor_room_init(i+1, true);
			quoridor_server[i].quoridor_turn = 1;
			quoridor_server[i].quoridor_count = quoridor_server[i].quoridor_count_fightReady;
			quoridorChatInputSystem('게임이 5초후에 시작됩니다.', i+1);
			web.quoridor_player_message(i+1);
			web.quoridor_player_update(i+1);
		}
		
		if(quoridor_server[i].quoridor_turn == 1 && quoridor_server[i].quoridor_count<=0){
			quoridor_server[i].quoridor_turn = 2;
			quoridor_server[i].quoridor_count = quoridor_server[i].quoridor_count_playerThink;
			quoridorChatInputSystem('게임이 시작되었습니다.', i+1);
			quoridorChatInputSystem('Green 플레이어의 턴입니다.', i+1);
			web.quoridor_player_message(i+1);
			web.quoridor_player_update(i+1);
		}
		
		if(quoridor_server[i].quoridor_turn == 2 && quoridor_server[i].quoridor_count<=0){
			quoridor_server[i].quoridor_turn = 3;
			quoridor_server[i].quoridor_count = quoridor_server[i].quoridor_count_playerThink;
			quoridorChatInputSystem('Blue 플레이어의 턴입니다.', i+1);
			web.quoridor_player_message(i+1);
			web.quoridor_player_update(i+1);
		}
		
		if(quoridor_server[i].quoridor_turn == 3 && quoridor_server[i].quoridor_count<=0){
			quoridor_server[i].quoridor_turn = 2;
			quoridor_server[i].quoridor_count = quoridor_server[i].quoridor_count_playerThink;
			quoridorChatInputSystem('Green 플레이어의 턴입니다.', i+1);
			web.quoridor_player_message(i+1);
			web.quoridor_player_update(i+1);
		}
	}
	
	oldtime = time;
};

function isCanMove(room, new_x, new_y, playerNum){
	var positionY = new_y;
	var positionX = new_x;
	var map = quoridor_server[room-1].quoridor_map;
	if(positionY%2 == 0 && positionX%2 == 0){
		if(positionX>0){
			if(map[positionY][positionX-2] == playerNum && map[positionY][positionX-1] == 0 &&
				map[positionY][positionX] == 0) return true;
		}
		if(positionX<16){
			if(map[positionY][positionX+2] == playerNum && map[positionY][positionX+1] == 0 &&
				map[positionY][positionX] == 0) return true;
		}
		if(positionY>0){
			if(map[positionY-2][positionX] == playerNum && map[positionY-1][positionX] == 0 &&
				map[positionY][positionX] == 0) return true;
		}
		if(positionY<16){
			if(map[positionY+2][positionX] == playerNum && map[positionY+1][positionX] == 0 &&
				map[positionY][positionX] == 0) return true;
		}
		var otherNum = (playerNum==1)?2:1;
		if(positionX>2){
			if(map[positionY][positionX-4] == playerNum && map[positionY][positionX-3] == 0 &&
				map[positionY][positionX-2] == otherNum && map[positionY][positionX-1] == 0) return true;
		}
		if(positionX<14){
			if(map[positionY][positionX+4] == playerNum && map[positionY][positionX+3] == 0 &&
				map[positionY][positionX+2] == otherNum && map[positionY][positionX+1] == 0) return true;
		}
		if(positionY>2){
			if(map[positionY-4][positionX] == playerNum && map[positionY-3][positionX] == 0 &&
				map[positionY-2][positionX] == otherNum && map[positionY-1][positionX] == 0) return true;
		}
		if(positionY<14){
			if(map[positionY+4][positionX] == playerNum && map[positionY+3][positionX] == 0 &&
				map[positionY+2][positionX] == otherNum && map[positionY+1][positionX] == 0) return true;
		}
		if(positionX>0 && positionY>0){
			if(map[positionY-2][positionX-2] == playerNum && map[positionY-2][positionX-1] == 0 &&
				map[positionY-2][positionX] == otherNum && map[positionY-1][positionX] == 0) {
					if(positionX<16 && map[positionY-2][positionX+1] == 3) return true;
					else if(positionX==16) return true;
				}
			if(map[positionY-2][positionX-2] == playerNum && map[positionY-1][positionX-2] == 0 &&
				map[positionY][positionX-2] == otherNum && map[positionY][positionX-1] == 0) {
					if(positionY<16 && map[positionY+1][positionX-2] == 3) return true;
					else if(positionY==16) return true;
				}
		}
		if(positionX>0 && positionY<16){
			if(map[positionY+2][positionX-2] == playerNum && map[positionY+2][positionX-1] == 0 &&
				map[positionY+2][positionX] == otherNum && map[positionY+1][positionX] == 0) {
					if(positionX<16 && map[positionY+2][positionX+1] == 3) return true;
					else if(positionX==16) return true;
				}
			if(map[positionY+2][positionX-2] == playerNum && map[positionY+1][positionX-2] == 0 &&
				map[positionY][positionX-2] == otherNum && map[positionY][positionX-1] == 0) {
					if(positionY>0 && map[positionY-1][positionX-2] == 3) return true;
					else if(positionY==0) return true;
				}
		}
		if(positionX<16 && positionY>0){
			if(map[positionY-2][positionX+2] == playerNum && map[positionY-2][positionX+1] == 0 &&
				map[positionY-2][positionX] == otherNum && map[positionY-1][positionX] == 0) {
					if(positionX>0 && map[positionY-2][positionX-1] == 3) return true;
					else if(positionX==0) return true;
				}
			if(map[positionY-2][positionX+2] == playerNum && map[positionY-1][positionX+2] == 0 &&
				map[positionY][positionX+2] == otherNum && map[positionY][positionX+1] == 0) {
					if(positionY<16 && map[positionY+1][positionX+2] == 3) return true;
					else if(positionY==16) return true;
				}
		}
		if(positionX<16 && positionY<16){
			if(map[positionY+2][positionX+2] == playerNum && map[positionY+2][positionX+1] == 0 &&
				map[positionY+2][positionX] == otherNum && map[positionY+1][positionX] == 0) {
					if(positionX>0 && map[positionY+2][positionX-1] == 3) return true;
					else if(positionX==0) return true;
				}
			if(map[positionY+2][positionX+2] == playerNum && map[positionY+1][positionX+2] == 0 &&
				map[positionY][positionX+2] == otherNum && map[positionY][positionX+1] == 0) {
					if(positionY>0 && map[positionY-1][positionX+2] == 3) return true;
					else if(positionY==0) return true;
				}
		}
	}
	return false;
}
