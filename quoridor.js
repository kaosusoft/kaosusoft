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
	this.quoridor_system_chat = new system_chat_piece(0, '', '');
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
	this.quoridor_count_playerThink = 30000;
	this.quoridor_count_nextGame = 10000;
	// turn
	// 0 - 참가자 신청단계 : 2명이 다 차면 1로 넘어감. 카운트 시작.
	// 1 - 대결 시작 준비단계 : 카운트를 5초 세서 대결이 시작되서 2로 넘어감. 카운트 시작
	// 2 - 1번 플레이어 턴 : 카운트가 다 되면 턴이 넘어감. 명령이 들어와도 턴이 넘어감. 카운트 시작.
	// 3 - 2번 플레이어 턴 : 2로 돌아감.
	// 4 - 게임 끝. 카운트 시작.
	this.quoridor_point1 = 0;
	this.quoridor_point2 = 0;
	this.quoridor_limit_wall1 = 10;
	this.quoridor_limit_wall2 = 10;
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
		quoridor_server[room-1].quoridor_count = 0;
		quoridor_server[room-1].quoridor_limit_wall1 = 10;
		quoridor_server[room-1].quoridor_limit_wall2 = 10;
		if(init){
			quoridor_server[room-1].quoridor_turn = 0;
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
				web.lobbyGamePlayerUpdate();
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
				}
			}
		}
		quoridor_server[room-1].quoridor_gallery.push(player);
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

function system_chat_piece(type, str, str2){
	this.type = type;
	this.str = str;
	this.str2 = str2;
	// type
	// 0 : 플레이어가 포기하였습니다. (빨강)
	// 1 : 
}

exports.quoridorPlayerNum = function(){
	return {
		room1: quoridor_server[0].quoridor_player.length,
		room2: quoridor_server[1].quoridor_player.length,
		room3: quoridor_server[2].quoridor_player.length
	};
};

exports.quoridorGameData = function(room){
	var data = [];
	for(var i in quoridor_server[room-1].quoridor_player){
		data.push(new player(quoridor_server[room-1].quoridor_player[i].id, quoridor_server[room-1].quoridor_player[i].name, quoridor_server[room-1].quoridor_player[i].nickname));
	}
	var gameData = {
		player: data,
		map: quoridor_server[room-1].quoridor_map,
		system: quoridor_server[room-1].quoridor_system_chat,
		myid : 0,
		turn : quoridor_server[room-1].quoridor_turn,
		point1 : quoridor_server[room-1].quoridor_point1,
		point2 : quoridor_server[room-1].quoridor_point2,
		wall1 : quoridor_server[room-1].quoridor_limit_wall1,
		wall2 : quoridor_server[room-1].quoridor_limit_wall2,
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
						var str = '게임이 진행중입니다.';
						var str2 = 'Blue 플레이어의 턴입니다.';
						quoridorSystemChatInput(room, 3, str, str2);
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
					var can_move = isCanMove(room, new_x, new_y, 2);
					if(can_move){
						quoridor_server[room-1].quoridor_map[old_y][old_x]=0;
						quoridor_server[room-1].quoridor_map[new_y][new_x]=2;
						quoridor_server[room-1].quoridor_turn = 2;
						quoridor_server[room-1].quoridor_count = quoridor_server[room-1].quoridor_count_playerThink;
						var str = '게임이 진행중입니다.';
						var str2 = 'Green 플레이어의 턴입니다.';
						quoridorSystemChatInput(room, 2, str, str2);
						web.quoridor_player_update(room);
					}
					end_flag = true;
					break;
				}
			}
			if(end_flag) break;
		}
	}
};

exports.quoridorWall = function(id, data){
	var room = data.room;
	var positionX = data.x;
	var positionY = data.y;
	
	if(quoridor_server[room-1].quoridor_player.length<2) return;
	
	if(quoridor_server[room-1].quoridor_turn == 2 && quoridor_server[room-1].quoridor_player[0].id == id){
		if(quoridor_server[room-1].quoridor_limit_wall1<=0) return;
		if(positionY%2 == 0){
			if(positionX%2 == 1){
				//세로
				if(isCanWall(room, data.x, data.y)){
					quoridor_server[room-1].quoridor_map[data.y][data.x] = 3;
					quoridor_server[room-1].quoridor_map[data.y+1][data.x] = 3;
					quoridor_server[room-1].quoridor_map[data.y+2][data.x] = 3;
					quoridor_server[room-1].quoridor_turn = 3;
					quoridor_server[room-1].quoridor_count = quoridor_server[room-1].quoridor_count_playerThink;
					quoridor_server[room-1].quoridor_limit_wall1-=1;
					var str = '게임이 진행중입니다.';
					var str2 = 'Blue 플레이어의 턴입니다.';
					quoridorSystemChatInput(room, 3, str, str2);
					web.quoridor_player_update(room);
				}
			}else{
				return;
			}
		}else{
			if(positionX%2 == 0){
				//가로
				if(isCanWall(room, data.x, data.y)){
					quoridor_server[room-1].quoridor_map[data.y][data.x] = 3;
					quoridor_server[room-1].quoridor_map[data.y][data.x+1] = 3;
					quoridor_server[room-1].quoridor_map[data.y][data.x+2] = 3;
					quoridor_server[room-1].quoridor_turn = 3;
					quoridor_server[room-1].quoridor_count = quoridor_server[room-1].quoridor_count_playerThink;
					quoridor_server[room-1].quoridor_limit_wall1-=1;
					var str = '게임이 진행중입니다.';
					var str2 = 'Green 플레이어의 턴입니다.';
					quoridorSystemChatInput(room, 2, str, str2);
					web.quoridor_player_update(room);
				}
			}else{
				return;
			}
		}
	}else if(quoridor_server[room-1].quoridor_turn == 3 && quoridor_server[room-1].quoridor_player[1].id == id){
		if(quoridor_server[room-1].quoridor_limit_wall2<=0) return;
		if(positionY%2 == 0){
			if(positionX%2 == 1){
				//세로
				if(isCanWall(room, data.x, data.y)){
					quoridor_server[room-1].quoridor_map[data.y][data.x] = 3;
					quoridor_server[room-1].quoridor_map[data.y+1][data.x] = 3;
					quoridor_server[room-1].quoridor_map[data.y+2][data.x] = 3;
					quoridor_server[room-1].quoridor_turn = 2;
					quoridor_server[room-1].quoridor_count = quoridor_server[room-1].quoridor_count_playerThink;
					quoridor_server[room-1].quoridor_limit_wall2-=1;
					var str = '게임이 진행중입니다.';
					var str2 = 'Green 플레이어의 턴입니다.';
					quoridorSystemChatInput(room, 2, str, str2);
					web.quoridor_player_update(room);
				}
			}else{
				return;
			}
		}else{
			if(positionX%2 == 0){
				//가로
				if(isCanWall(room, data.x, data.y)){
					quoridor_server[room-1].quoridor_map[data.y][data.x] = 3;
					quoridor_server[room-1].quoridor_map[data.y][data.x+1] = 3;
					quoridor_server[room-1].quoridor_map[data.y][data.x+2] = 3;
					quoridor_server[room-1].quoridor_turn = 2;
					quoridor_server[room-1].quoridor_count = quoridor_server[room-1].quoridor_count_playerThink;
					quoridor_server[room-1].quoridor_limit_wall2-=1;
					var str = '게임이 진행중입니다.';
					var str2 = 'Blue 플레이어의 턴입니다.';
					quoridorSystemChatInput(room, 3, str, str2);
					web.quoridor_player_update(room);
				}
			}else{
				return;
			}
		}
	}
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

var quoridorSystemChatInput = function(room, type, str, str2){
	quoridor_server[room-1].quoridor_system_chat.type = type;
	quoridor_server[room-1].quoridor_system_chat.str = str;
	quoridor_server[room-1].quoridor_system_chat.str2 = str2;
};

var quoridorSystemChat = function(room){
	return quoridor_server[room-1].quoridor_system_chat;
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
					web.lobbyGamePlayerUpdate();
					if(quoridor_server[room-1].quoridor_turn>0){
						quoridor_room_init(room, true);
					}
					var str = quoridor_server[room-1].quoridor_gallery[i].nickname+' 플레이어가 대전을 포기하였습니다.';
					quoridorSystemChatInput(room, 0, str, '대전신청 접수중입니다.');
					web.quoridor_player_update(room);
					break;
				}
			}
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
				for(var k in quoridor_server[i].quoridor_player){
					if(quoridor_server[i].quoridor_player[k].id == quoridor_gallery[j].id){
						quoridor_server[i].quoridor_player.splice(k,1);
						web.lobbyGamePlayerUpdate();
						if(quoridor_server[i].quoridor_turn>0){
							quoridor_room_init(i+1, true);
						}
						var str = quoridor_server[i].quoridor_gallery[j].nickname+' 플레이어가 대전을 포기하였습니다.';
						quoridorSystemChatInput(i+1, 0, str, '대전신청 접수중입니다.');
						web.quoridor_player_update(i+1);
						break;
					}
				}
				break;
			}
		}
		
		if(quoridor_server[i].quoridor_count>0) {
			if(quoridor_server[i].quoridor_turn==1){
				var old_sec = Math.floor(quoridor_server[i].quoridor_count/1000);
				var new_sec = Math.floor((quoridor_server[i].quoridor_count-gap)/1000);
				if(old_sec != new_sec && old_sec<5 && old_sec>0){
					var str = '게임 준비중입니다.';
					var str2 = '게임이 '+old_sec+'초후에 시작됩니다.';
					quoridorSystemChatInput(i+1, 1, str, str2);
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
			var str = '게임 준비중입니다.';
			var str2 = '게임이  5초후에 시작됩니다.';
			quoridorSystemChatInput(i+1, 1, str, str2);
			web.quoridor_player_update(i+1);
		}
		
		if(quoridor_server[i].quoridor_turn == 1 && quoridor_server[i].quoridor_count<=0){
			quoridor_server[i].quoridor_turn = 2;
			quoridor_server[i].quoridor_count = quoridor_server[i].quoridor_count_playerThink;
			var str = '게임이 진행중입니다.';
			var str2 = 'Green 플레이어의 턴입니다.';
			quoridorSystemChatInput(i+1, 2, str, str2);
			web.quoridor_player_update(i+1);
		}
		
		if(quoridor_server[i].quoridor_turn == 2 && quoridor_server[i].quoridor_count<=0){
			quoridor_server[i].quoridor_turn = 3;
			quoridor_server[i].quoridor_count = quoridor_server[i].quoridor_count_playerThink;
			var str = '게임이 진행중입니다.';
			var str2 = 'Blue 플레이어의 턴입니다.';
			quoridorSystemChatInput(i+1, 3, str, str2);
			web.quoridor_player_update(i+1);
		}
		
		if(quoridor_server[i].quoridor_turn == 3 && quoridor_server[i].quoridor_count<=0){
			quoridor_server[i].quoridor_turn = 2;
			quoridor_server[i].quoridor_count = quoridor_server[i].quoridor_count_playerThink;
			var str = '게임이 진행중입니다.';
			var str2 = 'Green 플레이어의 턴입니다.';
			quoridorSystemChatInput(i+1, 2, str, str2);
			web.quoridor_player_update(i+1);
		}
		
		if(quoridor_server[i].quoridor_turn == 4 && quoridor_server[i].quoridor_count<=0){
			var point1 = quoridor_server[i].quoridor_point1;
			var point2 = quoridor_server[i].quoridor_point2;
			if(point1>1 || point2>1){
				while(quoridor_server[i].quoridor_player.length>0){
					quoridor_server[i].quoridor_player.shift();
				}
				web.lobbyGamePlayerUpdate();
				var str = '게임 준비중입니다.';
				var str2 = '대전신청 접수중입니다.';
				quoridorSystemChatInput(i+1, 0, str, str2);
				web.quoridor_player_update(i+1);
				quoridor_room_init(i+1, true);
			}else{
				quoridor_server[i].quoridor_player.reverse();
				var point1 = quoridor_server[i].quoridor_point1;
				var point2 = quoridor_server[i].quoridor_point2;
				quoridor_server[i].quoridor_point1 = point2;
				quoridor_server[i].quoridor_point2 = point1;
				quoridor_room_init(i+1, false);
				quoridor_server[i].quoridor_turn = 1;
				quoridor_server[i].quoridor_count = 0;
				var str = '게임이 진행중입니다.';
				var str2 = 'Green 플레이어의 턴입니다.';
				quoridorSystemChatInput(i+1, 2, str, str2);
				web.quoridor_player_update(i+1);
			}
			
			web.quoridor_player_update(i+1);
		}
		
		if(quoridor_server[i].quoridor_turn == 2 || quoridor_server[i].quoridor_turn == 3){
			for(var j=0; j<9; j++){
				if(quoridor_server[i].quoridor_map[j*2][0] == 2){
					var point1 = quoridor_server[i].quoridor_point1;
					var point2 = quoridor_server[i].quoridor_point2+1;
					quoridor_server[i].quoridor_turn = 4;
					quoridor_server[i].quoridor_count = quoridor_server[i].quoridor_count_nextGame;
					var str = 'Blue 플레이어의 승리입니다.';
					var str2 = '10초후에 방이 초기화됩니다.';
					var str3 = '10초후 진영이 바뀌어 '+(point1+point2+1)+'차전이 시작됩니다.';
					if(point2>1){
						quoridorSystemChatInput(i+1, 5, str, str2);
					}else{
						quoridorSystemChatInput(i+1, 5, str, str3);
					}
					quoridor_server[i].quoridor_point2 = point2;
					web.quoridor_player_update(i+1);
				}else if(quoridor_server[i].quoridor_map[j*2][16] == 1){
					var point1 = quoridor_server[i].quoridor_point1+1;
					var point2 = quoridor_server[i].quoridor_point2;
					quoridor_server[i].quoridor_turn = 4;
					quoridor_server[i].quoridor_count = quoridor_server[i].quoridor_count_nextGame;
					var str = 'Green 플레이어의 승리입니다.';
					var str2 = '10초후에 방이 초기화됩니다.';
					var str3 = '10초후 진영이 바뀌어 '+(point1+point2+1)+'차전이 시작됩니다.';
					if(point1>1){
						quoridorSystemChatInput(i+1, 4, str, str2);
					}else{
						quoridorSystemChatInput(i+1, 4, str, str3);
					}
					quoridor_server[i].quoridor_point1 = point1;
					web.quoridor_player_update(i+1);
				}
			}
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

function isCanWall(room, positionX, positionY){
	if(positionY%2 == 0){
		if(positionX%2 == 1){
			if(positionY>15) return false;
			if(quoridor_server[room-1].quoridor_map[positionY][positionX] == 3) return false;
			if(quoridor_server[room-1].quoridor_map[positionY+1][positionX] == 3) return false;
			if(quoridor_server[room-1].quoridor_map[positionY+2][positionX] == 3) return false;
			if(isCanWall2(room, 1, positionX, positionY, false) && isCanWall2(room, 2, positionX, positionY, false)){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}else{
		if(positionX%2 == 0){
			if(positionX>15) return false;
			if(quoridor_server[room-1].quoridor_map[positionY][positionX] == 3) return false;
			if(quoridor_server[room-1].quoridor_map[positionY][positionX+1] == 3) return false;
			if(quoridor_server[room-1].quoridor_map[positionY][positionX+2] == 3) return false;
			if(isCanWall2(room, 1, positionX, positionY, true) && isCanWall2(room, 2, positionX, positionY, true)){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	
	return false;
}

function isCanWall2(room, player, positionX, positionY, flag){
	var fakeMap = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];
	
	for(var i=0; i<17; i++){
		for(var j=0; j<17; j++){
			if(quoridor_server[room-1].quoridor_map[i][j] == 3) fakeMap[i][j] = 3;
			else if(quoridor_server[room-1].quoridor_map[i][j] == ((player==1)?2:1)) fakeMap[i][j] = 0;
			else if(quoridor_server[room-1].quoridor_map[i][j] == player) fakeMap[i][j] = player;
		}
	}
	fakeMap[positionY][positionX] = 3;
	if(flag){
		fakeMap[positionY][positionX+1] = 3;
		fakeMap[positionY][positionX+2] = 3;
	}else{
		fakeMap[positionY+1][positionX] = 3;
		fakeMap[positionY+2][positionX] = 3;
	}
	
	while(true){
		var flag = true;
		for(var i=0; i<17; i+=2){
			for(var j=0; j<17; j+=2){
				if(fakeMap[i][j]==player){
					if(j>0 && fakeMap[i][j-1]==0 && fakeMap[i][j-2]==0){
						fakeMap[i][j-2] = player;
						if(player==2 && j-2==0) return true;
						flag = false;
					}
					if(j<16 && fakeMap[i][j+1]==0 && fakeMap[i][j+2]==0){
						fakeMap[i][j+2] = player;
						if(player==1 && j+2==16) return true;
						flag = false;
					}
					if(i>0 && fakeMap[i-1][j]==0 && fakeMap[i-2][j]==0){
						fakeMap[i-2][j] = player;
						flag = false;
					}
					if(i<16 && fakeMap[i+1][j]==0 && fakeMap[i+2][j]==0){
						fakeMap[i+2][j] = player;
						flag = false;
					}
				}
			}
		}
		if(flag) return false;
	}
}
