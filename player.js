var web = require('./web.js');

// *********************************** Player **************************************** //

function playerSimple(id, name, nickname){
	this.id = id;
	this.name = name;
	this.nickname = nickname;
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

var lobby_player = [];

function lobbyPlayerAdd(player){
	for(var i in lobby_player){
		if(player.id == lobby_player[i].id) lobby_player.splice(i, 1);
	}
	lobby_player.push(player);
}

exports.lobbyPlayerAdd = lobbyPlayerAdd;

function getLobbyPlayerSimple(){
	var players = [];
	for(var i in lobby_player){
		players.push(new playerSimple(lobby_player[i].id, lobby_player[i].name, lobby_player[i].nickname));
	}
	return players;
}

exports.getLobbyPlayerSimple = getLobbyPlayerSimple;

function getLobbyPlayer(){
	return lobby_player;
}

exports.getLobbyPlayer = getLobbyPlayer;

function disconnectPlayer(data){
	for(var i in lobby_player){
		if(lobby_player[i].session == data.session){
			lobby_player.splice(i, 1);
			break;
		}
	}
}

exports.disconnectPlayer = disconnectPlayer;
