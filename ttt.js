


// ************************* Tic Tac Toe *************************** //

var ttt_server = [];

ttt_server.push(new ttt_room());
ttt_server.push(new ttt_room());
ttt_server.push(new ttt_room());

function ttt_room(){
	this.ttt_player = [];
	this.ttt_gallery = [];
	this.ttt_chat = [];
	this.ttt_map = [[0, 1, 2],[3, 4, 5],[6, 7, 8]];
	this.ttt_turn = 0;
	this.ttt_delay = 0;
}

exports.tttLoop = function(time){
	
};