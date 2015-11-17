// var player = {
	// name: '',
	// player1: undefined,
	// player2: undefined
// };
// 
// var isCanPlay = false;
// var playerNum = -1;
// 
// var map = [
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// ];
// 
// var mouseX = 0;
// var mouseY = 0;
// 
// var message = '';
// var messageColor = "#000000";
// var message_win = 0;
// var chat = [];
// 
// var playerList = [];
// 
// var mousePosition = -1;

var socket = undefined;

// function chat_input(){
	// if($('#chat').val().length>0){
		// socket.emit('quoridor_chat', player.name + " : "+$('#chat').val());
		// $('#chat').val('');
	// }
// }

$(document).unload(function(){
	if (socket != undefined) socket.disconnect();
});

$(document).ready(function(){
	// socket = io.connect();
	// socket.emit('join_quoridor');
	
	var canvas = document.getElementById('canvas');
	
	// $(canvas).mousedown(function(e){
		// mouseX = e.pageX - $(this).offset().left;
		// mouseY = e.pageY - $(this).offset().top;
// 		
		// mouseClick();
	// });
// 	
	// $(canvas).mousemove(function(e){
		// mouseX = e.pageX - $(this).offset().left;
		// mouseY = e.pageY - $(this).offset().top;
// 		
		// mouseMove();
	// });
	// if(window.localStorage){
		// if(localStorage.getItem('quoridor_name') != null){
			// $('#name').val(localStorage.getItem('quoridor_name'));
			// name_input();
		// }
	// }
// 	
	// $('#chatb').click(function(){
		// chat_input();
	// });
// 	
	// $('#gg').click(function(){
		// socket.emit('quoridor_gg');
	// });
// 	
	// socket.on('join_success', function(data){
		// player.name = data;
	// });
// 	
	// socket.on('quoridor_chat', function(data){
		// chat = data;
	// });
// 	
	// socket.on('quoridor_list_all', function(data){
		// playerList = data;
	// });
// 	
	// socket.on('quoridor_message', function(color, data){
		// if(color == 0) messageColor = "#000000";
		// else if(color == 1) messageColor = "#33FF33";
		// else if(color == 2) messageColor = "#0000AA";
		// message = data;
	// });
// 	
	// socket.on('quoridor_message_win', function(data){
		// message_win = data;
	// });
// 	
	// socket.on('quoridor_map', function(data){
		// map = data;
		// for(var i=1; i<17; i+=2){
			// for(var j=1; j<17; j+=2){
				// if((map[i-1][j]==3 && map[i][j-1]==3) || (map[i-1][j]==3 && map[i][j+1]==3) ||
				// (map[i+1][j]==3 && map[i][j-1]==3) || (map[i+1][j]==3 && map[i][j+1]==3)){
					// map[i][j] = 3;
				// }
			// }
		// }
	// });
// 	
	// socket.on('quoridor_init', function(){
		// isCanPlay = false;
	// });
// 	
	// socket.on('quoridor_permission', function(data){
		// isCanPlay = true;
		// playerNum = data;
	// });
	
	onPageLoadComplete();
});

function onPageLoadComplete()
{
	var FPS = 30;
	
	setInterval(gameLoop, 1000/FPS);
	
	var player1_img = new Image();
	var player2_img = new Image();
	player1_img.src = "quoridor/img/player1.png";
	player2_img.src = "quoridor/img/player2.png";
	player.player1 = new Object(player1_img);
	player.player2 = new Object(player2_img);
	player.player1.SetPosition(24, 24+74*4);
	player.player2.SetPosition(24+74*8, 24+74*4);
}

// function mouseClick(){
	// // setTimeout(chatFocus, 100);
	// if(!isCanPlay) return;
	// var positionY = Math.floor(mousePosition/17);
	// var positionX = mousePosition - positionY*17;
	// if(positionY%2 == 0){
		// if(positionX%2 == 1){
			// if(isCanWall(mousePosition)){
				// socket.emit('quoridor_wall', {
					// x1: positionX,
					// y1: positionY,
					// x2: positionX,
					// y2: positionY+1,
					// x3: positionX,
					// y3: positionY+2
				// });
			// }
		// }else{
			// if(isCanMove(mousePosition)){
				// socket.emit('quoridor_move', {
					// x: positionX,
					// y: positionY
				// });
			// }
		// }
	// }else{
		// if(positionX%2 == 0){
			// if(isCanWall(mousePosition)){
				// socket.emit('quoridor_wall', {
					// x1: positionX,
					// y1: positionY,
					// x2: positionX+1,
					// y2: positionY,
					// x3: positionX+2,
					// y3: positionY
				// });
			// }
		// }
	// }
// }
// 
// var chatFocus = function(){
	// $('#chat').focus();
// };
// 
// function mouseMove(){
	// var positionX = mouseX - 24;
	// var positionY = mouseY - 24;
	// if(positionX>=0 && positionX<642){
		// if(positionY>=0 && positionY<642){
			// mousePosition = -1;
			// while(positionX>=0){
				// if(positionX<50){
					// mousePosition++;
					// break;
				// }else if(positionX<74){
					// mousePosition+=2;
					// break;
				// }else{
					// mousePosition+=2;
					// positionX-=74;
				// }
			// }
			// while(positionY>=0){
				// if(positionY<50){
					// break;
				// }else if(positionY<74){
					// mousePosition+=17;
					// break;
				// }else{
					// mousePosition+=34;
					// positionY-=74;
				// }
			// }
		// }else{
			// mousePosition = -1;
		// }
	// }else{
		// mousePosition = -1;
	// }
// 	
// }

function Update()
{

}

// function isCanMove(mousePosition){
	// var positionY = Math.floor(mousePosition/17);
	// var positionX = mousePosition - positionY*17;
	// if(positionY%2 == 0 && positionX%2 == 0){
		// if(positionX>0){
			// if(map[positionY][positionX-2] == playerNum && map[positionY][positionX-1] == 0 &&
				// map[positionY][positionX] == 0) return true;
		// }
		// if(positionX<16){
			// if(map[positionY][positionX+2] == playerNum && map[positionY][positionX+1] == 0 &&
				// map[positionY][positionX] == 0) return true;
		// }
		// if(positionY>0){
			// if(map[positionY-2][positionX] == playerNum && map[positionY-1][positionX] == 0 &&
				// map[positionY][positionX] == 0) return true;
		// }
		// if(positionY<16){
			// if(map[positionY+2][positionX] == playerNum && map[positionY+1][positionX] == 0 &&
				// map[positionY][positionX] == 0) return true;
		// }
		// var otherNum = (playerNum==1)?2:1;
		// if(positionX>2){
			// if(map[positionY][positionX-4] == playerNum && map[positionY][positionX-3] == 0 &&
				// map[positionY][positionX-2] == otherNum && map[positionY][positionX-1] == 0) return true;
		// }
		// if(positionX<14){
			// if(map[positionY][positionX+4] == playerNum && map[positionY][positionX+3] == 0 &&
				// map[positionY][positionX+2] == otherNum && map[positionY][positionX+1] == 0) return true;
		// }
		// if(positionY>2){
			// if(map[positionY-4][positionX] == playerNum && map[positionY-3][positionX] == 0 &&
				// map[positionY-2][positionX] == otherNum && map[positionY-1][positionX] == 0) return true;
		// }
		// if(positionY<14){
			// if(map[positionY+4][positionX] == playerNum && map[positionY+3][positionX] == 0 &&
				// map[positionY+2][positionX] == otherNum && map[positionY+1][positionX] == 0) return true;
		// }
		// if(positionX>0 && positionY>0){
			// if(map[positionY-2][positionX-2] == playerNum && map[positionY-2][positionX-1] == 0 &&
				// map[positionY-2][positionX] == otherNum && map[positionY-1][positionX] == 0) {
					// if(positionX<16 && map[positionY-2][positionX+1] == 3) return true;
					// else if(positionX==16) return true;
				// }
			// if(map[positionY-2][positionX-2] == playerNum && map[positionY-1][positionX-2] == 0 &&
				// map[positionY][positionX-2] == otherNum && map[positionY][positionX-1] == 0) {
					// if(positionY<16 && map[positionY+1][positionX-2] == 3) return true;
					// else if(positionY==16) return true;
				// }
		// }
		// if(positionX>0 && positionY<16){
			// if(map[positionY+2][positionX-2] == playerNum && map[positionY+2][positionX-1] == 0 &&
				// map[positionY+2][positionX] == otherNum && map[positionY+1][positionX] == 0) {
					// if(positionX<16 && map[positionY+2][positionX+1] == 3) return true;
					// else if(positionX==16) return true;
				// }
			// if(map[positionY+2][positionX-2] == playerNum && map[positionY+1][positionX-2] == 0 &&
				// map[positionY][positionX-2] == otherNum && map[positionY][positionX-1] == 0) {
					// if(positionY>0 && map[positionY-1][positionX-2] == 3) return true;
					// else if(positionY==0) return true;
				// }
		// }
		// if(positionX<16 && positionY>0){
			// if(map[positionY-2][positionX+2] == playerNum && map[positionY-2][positionX+1] == 0 &&
				// map[positionY-2][positionX] == otherNum && map[positionY-1][positionX] == 0) {
					// if(positionX>0 && map[positionY-2][positionX-1] == 3) return true;
					// else if(positionX==0) return true;
				// }
			// if(map[positionY-2][positionX+2] == playerNum && map[positionY-1][positionX+2] == 0 &&
				// map[positionY][positionX+2] == otherNum && map[positionY][positionX+1] == 0) {
					// if(positionY<16 && map[positionY+1][positionX+2] == 3) return true;
					// else if(positionY==16) return true;
				// }
		// }
		// if(positionX<16 && positionY<16){
			// if(map[positionY+2][positionX+2] == playerNum && map[positionY+2][positionX+1] == 0 &&
				// map[positionY+2][positionX] == otherNum && map[positionY+1][positionX] == 0) {
					// if(positionX>0 && map[positionY+2][positionX-1] == 3) return true;
					// else if(positionX==0) return true;
				// }
			// if(map[positionY+2][positionX+2] == playerNum && map[positionY+1][positionX+2] == 0 &&
				// map[positionY][positionX+2] == otherNum && map[positionY][positionX+1] == 0) {
					// if(positionY>0 && map[positionY-1][positionX+2] == 3) return true;
					// else if(positionY==0) return true;
				// }
		// }
	// }
	// return false;
// }
// 
// function isCanWall2(player, positionX, positionY, flag){
	// var fakeMap = [
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	// ];
// 	
	// for(var i=0; i<17; i++){
		// for(var j=0; j<17; j++){
			// if(map[i][j] == 3) fakeMap[i][j] = 3;
			// else if(map[i][j] == ((player==1)?2:1)) fakeMap[i][j] = 0;
			// else if(map[i][j] == player) fakeMap[i][j] = player;
		// }
	// }
	// fakeMap[positionY][positionX] = 3;
	// if(flag){
		// fakeMap[positionY][positionX+1] = 3;
		// fakeMap[positionY][positionX+2] = 3;
	// }else{
		// fakeMap[positionY+1][positionX] = 3;
		// fakeMap[positionY+2][positionX] = 3;
	// }
// 	
	// while(true){
		// var flag = true;
		// for(var i=0; i<17; i+=2){
			// for(var j=0; j<17; j+=2){
				// if(fakeMap[i][j]==player){
					// if(j>0 && fakeMap[i][j-1]==0 && fakeMap[i][j-2]==0){
						// fakeMap[i][j-2] = player;
						// if(player==2 && j-2==0) return true;
						// flag = false;
					// }
					// if(j<16 && fakeMap[i][j+1]==0 && fakeMap[i][j+2]==0){
						// fakeMap[i][j+2] = player;
						// if(player==1 && j+2==16) return true;
						// flag = false;
					// }
					// if(i>0 && fakeMap[i-1][j]==0 && fakeMap[i-2][j]==0){
						// fakeMap[i-2][j] = player;
						// flag = false;
					// }
					// if(i<16 && fakeMap[i+1][j]==0 && fakeMap[i+2][j]==0){
						// fakeMap[i+2][j] = player;
						// flag = false;
					// }
				// }
			// }
		// }
		// if(flag) return false;
	// }
// }
// 
// function isCanWall(mousePosition){
	// var positionY = Math.floor(mousePosition/17);
	// var positionX = mousePosition - positionY*17;
	// if(positionY%2 == 0){
		// if(positionX%2 == 1){
			// if(positionY>15) return false;
			// if(map[positionY][positionX] == 3) return false;
			// if(map[positionY+1][positionX] == 3) return false;
			// if(map[positionY+2][positionX] == 3) return false;
			// if(isCanWall2(1, positionX, positionY, false) && isCanWall2(2, positionX, positionY, false)){
				// return true;
			// }else{
				// return false;
			// }
		// }else{
			// return false;
		// }
	// }else{
		// if(positionX%2 == 0){
			// if(positionX>15) return false;
			// if(map[positionY][positionX] == 3) return false;
			// if(map[positionY][positionX+1] == 3) return false;
			// if(map[positionY][positionX+2] == 3) return false;
			// if(isCanWall2(1, positionX, positionY, true) && isCanWall2(2, positionX, positionY, true)){
				// return true;
			// }else{
				// return false;
			// }
		// }else{
			// return false;
		// }
	// }
// 	
	// return false;
// }

function Render()
{
	var theCanvas = document.getElementById("canvas");
	var Context = theCanvas.getContext("2d");
	
	Context.fillStyle = "#bbada0";
	Context.fillStyle = "#aa9c8f";
	Context.fillRect(0, 0, 900, 690);
	
	Context.fillStyle = "#DDDDDD";
	
	var redPosition1 = -1;
	var redPosition2 = -1;
	var redPosition3 = -1;
	
	// var positionY = Math.floor(mousePosition/17);
	// var positionX = mousePosition - positionY*17;
	// if(positionY%2 == 0){
		// if(positionX%2 == 1){
			// if(isCanWall(mousePosition)){
				// redPosition1 = mousePosition;
				// redPosition2 = mousePosition+17;
				// redPosition3 = mousePosition+34;
			// }
		// }
	// }else{
		// if(positionX%2 == 0){
			// if(isCanWall(mousePosition)){
				// redPosition1 = mousePosition;
				// redPosition2 = mousePosition+1;
				// redPosition3 = mousePosition+2;
			// }
		// }
	// }
// 	
	// for(var i=0; i<9; i++){
		// for(var j=0; j<9; j++){
			// if(j==0) Context.fillStyle = "#AAAADD";
			// else if(j==8) Context.fillStyle = "#AADDAA";
			// else Context.fillStyle = "#DDDDDD";
			// if(isCanPlay && i*34 + j*2 == mousePosition && isCanMove(mousePosition)) Context.fillStyle = "#FF0000";
			// switch(map[2*i][2*j]){
				// case 1: {
					// if(isCanPlay && playerNum==1) Context.fillStyle = "#88DD88";
					// player.player1.SetPosition(24+(74*j), 24+(74*i)); 
					// break;
				// }
				// // Context.fillStyle = "#00FF00"; break;
				// case 2: {
					// if(isCanPlay && playerNum==2) Context.fillStyle = "#8888DD";
					// player.player2.SetPosition(24+(74*j), 24+(74*i));
					// break;
				// } 
				// // Context.fillStyle = "#0000FF"; break;
			// }
// 
			// Context.fillRect(24+(74*j), 24+(74*i), 50, 50);
		// }
	// }
// 	
	// for(var i=0; i<9; i++){
		// for(var j=0; j<8; j++){
			// Context.fillStyle = "#DDDDDD";
			// if(isCanPlay && i*34 + j*2 + 1 == redPosition1) Context.fillStyle = "#FF0000";
			// else if(isCanPlay && i*34 + j*2 + 1 == redPosition2) Context.fillStyle = "#FF0000";
			// else if(isCanPlay && i*34 + j*2 + 1 == redPosition3) Context.fillStyle = "#FF0000";
			// switch(map[2*i][2*j+1]){
				// case 3: Context.fillStyle = "#776e65"; break;
			// }
			// Context.fillRect(76+(74*j), 24+(74*i), 20, 50);
		// }
	// }
// 	
	// for(var i=0; i<8; i++){
		// for(var j=0; j<9; j++){
			// Context.fillStyle = "#DDDDDD";
			// if(isCanPlay && i*34 + j*2 + 17 == redPosition1) Context.fillStyle = "#FF0000";
			// else if(isCanPlay && i*34 + j*2 + 17 == redPosition2) Context.fillStyle = "#FF0000";
			// else if(isCanPlay && i*34 + j*2 + 17 == redPosition3) Context.fillStyle = "#FF0000";
			// switch(map[2*i+1][2*j]){
				// case 3: Context.fillStyle = "#776e65"; break;
			// }
			// Context.fillRect(24+(74*j), 76+(74*i), 50, 20);
		// }
	// }
// 	
	// for(var i=0; i<8; i++){
		// for(var j=0; j<8; j++){
			// Context.fillStyle = "#DDDDDD";
			// if(isCanPlay && i*34 + j*2 + 18 == redPosition1) Context.fillStyle = "#FF0000";
			// else if(isCanPlay && i*34 + j*2 + 18 == redPosition2) Context.fillStyle = "#FF0000";
			// switch(map[2*i+1][2*j+1]){
				// case 3: Context.fillStyle = "#776e65"; break;
			// }
			// Context.fillRect(76+(74*j), 76+(74*i), 20, 20);
		// }
	// }
// 	
	// player.player1.Render(Context);
	// player.player2.Render(Context);
	
	// FPS 표시
	// Context.fillStyle = "#000000";
	// Context.font = '15px Nanum';
	// Context.textBaseLine = "top";
// 	
	// Context.fillText("Connect List", 710, 110);
	// for(var i in playerList){
		// if(i==0) Context.fillStyle = "#00FF00";
		// else if(i==1) Context.fillStyle = "#0000FF";
		// else Context.fillStyle = "#000000";
// 		
		// if(i>9) {
			// Context.fillText('...', 790, 130+20*i);
			// break;
		// }
		// Context.fillText(playerList[i], 790, 130+20*i);
		// Context.fillStyle = "#000000";
		// if(playerList[i] == player.name) Context.fillText('You --> ', 725, 130+20*i);
// 		
	// }
// 	
	// Context.fillStyle = messageColor;
	// Context.fillText(message, 700, 40);
// 	
	// Context.font = '12px Nanum';
	// for(var i in chat){
		// Context.fillStyle = "#000000";
		// Context.fillText(chat[i], 675, 360+20*i);
	// }
// 	
	// Context.font = '96px Arial';
	// if(message_win == 1){
		// Context.fillStyle = "#00FF00";
		// Context.fillText('Green Win!!', 120, 350);
	// }
	// else if(message_win == 2){
		// Context.fillStyle = "#0000FF";
		// Context.fillText('Blue Win!!', 120, 350);
	// }
// 	
	// player.object.Render(Context);
}

function gameLoop()
{
	Update();
	Render();
	
	// frameCounter.countFrame();
}