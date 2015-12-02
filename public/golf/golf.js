var test = false;
// var FIGHT_ASK_X = 226;
// var FIGHT_ASK_Y = 303;
// var FIGHT_ASK_WIDTH = 180;
// var FIGHT_ASK_HEIGHT = 90;
// var fight_ask_move = false;
// var can_fight_ask = false;
// var can_fight_ask_process = false;
// var can_play = false;
// var myPosition = 0;
// 
// var myid = 0;
// 
// var player = {
	// name: '',
	// player1: undefined,
	// player2: undefined
// };
// 
// var server_player = [];
// var server_turn = 0;
// var server_count = 0;
// var server_point1 = 0;
// var server_point2 = 0;
// var server_system_chat = undefined;
// var server_limit_wall1 = 0;
// var server_limit_wall2 = 0;
// 
// var testVar = 0;


// var isCanPlay = false;

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

var mouseX = 0;
var mouseY = 0;

// var chat = [];
 
// var mousePosition = -1;

// var quoridor_gallery = [];

var socket = undefined;

function chat_input(){
	var session = $.cookie("session");
	if($('#chat').val().length>0){
		socket.emit('golf_chat_input', {
			session: session,
			str: $('#chat').val(),
			room: room
			});
		$('#chat').val('');
	}
}

$(document).unload(function(){
	if (socket != undefined) socket.disconnect();
});

$(document).ready(function(){
	// socket = io.connect();
	// var session = $.cookie("session");
	// socket.emit('golf_join', {session: session, room: room});
	
	var canvas = document.getElementById('canvas');
	
	$(canvas).mousedown(function(e){
		mouseX = e.pageX - $(this).offset().left;
		mouseY = e.pageY - $(this).offset().top;
		
		// mouseClick();
	});
	
	$(canvas).mousemove(function(e){
		mouseX = e.pageX - $(this).offset().left;
		mouseY = e.pageY - $(this).offset().top;
		
		// mouseMove();
	});
	// if(window.localStorage){
		// if(localStorage.getItem('quoridor_name') != null){
			// $('#name').val(localStorage.getItem('quoridor_name'));
			// name_input();
		// }
	// }
	
	$(window).unload(function(){
		// var sess = $.cookie("session");
		// socket.emit('golf_exit', {session: sess, room: room});
	});
	
	// $('#chatb').click(function(){
		// chat_input();
	// });
	
	// $('#gg').click(function(){
		// socket.emit('quoridor_gg');
	// });
	
	// socket.on('expire_send', function(){
		// socket.emit('expire_receive');
	// });
	
	// socket.on('quoridor_gallery', function(data){
		// quoridor_gallery = data;
	// });
// 	
	// socket.on('quoridor_data', function(data){
		// server_player = data.player;
		// server_system_chat = data.system;
		// if(data.myid>0){
			// myid = data.myid;
		// }
		// map = data.map;
		// server_turn = data.turn;
		// if(server_turn==0 && server_player.length<2){
			// can_fight_ask = true;
			// for(var i in server_player){
				// if(server_player[i].id == myid){
					// can_fight_ask = false;
				// }
			// }
		// }else{
			// can_fight_ask_process = false;
			// can_fight_ask = false;
			// can_play = false;
			// for(var i in server_player){
				// if(server_player[i].id == myid){
					// can_play = true;
					// myPosition = i;
				// }
			// }
		// }
		// server_point1 = data.point1;
		// server_point2 = data.point2;
		// server_limit_wall1 = data.wall1;
		// server_limit_wall2 = data.wall2;
		// server_count = data.count;
		// if(data.myid>0){
			// myid = data.myid;
		// }
		// for(var i in server_player){
			// if(myid == server_player[i].id){
				// can_fight_ask = false;
				// break;
			// }
		// }
	// });
// 	
	// socket.on('quoridor_chat', function(data){
		// chat = data;
	// });
	
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
	
	// var player1_img = new Image();
	// var player2_img = new Image();
	// player1_img.src = "../quoridor/img/player1.png";
	// player2_img.src = "../quoridor/img/player2.png";
	// player.player1 = new Object(player1_img);
	// player.player2 = new Object(player2_img);
	// player.player1.SetPosition(26, 85+67*4);
	// player.player2.SetPosition(26+67*8, 85+67*4);
}

function mouseClick(){
	if(can_fight_ask && !can_fight_ask_process && fight_ask_move && mouseX > FIGHT_ASK_X && mouseX < FIGHT_ASK_X+FIGHT_ASK_WIDTH && mouseY > FIGHT_ASK_Y && mouseY < FIGHT_ASK_Y+FIGHT_ASK_HEIGHT){
		can_fight_ask_process = true;
		var session = $.cookie("session");
		socket.emit('quoridor_player_ask', {session: session, room: room});
	}
	
	// // setTimeout(chatFocus, 100);
	if(!can_play) return;
	if(server_turn == 2 && myPosition == 0){
	}else if(server_turn == 3 && myPosition == 1){
	}else{
		return;
	}
	var positionY = Math.floor(mousePosition/17);
	var positionX = mousePosition - positionY*17;
	if(positionY%2 == 0){
		if(positionX%2 == 1){
			if(isCanWall(mousePosition)){
				if(server_turn == 2 && server_limit_wall1<=0) return;
				if(server_turn == 3 && server_limit_wall2<=0) return;
				var session = $.cookie("session");
				socket.emit('quoridor_wall', {
					session: session,
					room: room,
					x: positionX,
					y: positionY
				});
			}
		}else{
			if(isCanMove(mousePosition)){
				var session = $.cookie("session");
				socket.emit('quoridor_move', {
					session: session,
					room: room,
					x: positionX,
					y: positionY
				});
			}
		}
	}else{
		if(positionX%2 == 0){
			if(isCanWall(mousePosition)){
				if(server_turn == 2 && server_limit_wall1<=0) return;
				if(server_turn == 3 && server_limit_wall2<=0) return;
				var session = $.cookie("session");
				socket.emit('quoridor_wall', {
					session: session,
					room: room,
					x: positionX,
					y: positionY
				});
			}
		}
	}
}

// var chatFocus = function(){
	// $('#chat').focus();
// };
// 
function mouseMove(){
	if(can_fight_ask && !can_fight_ask_process&& mouseX > FIGHT_ASK_X && mouseX < FIGHT_ASK_X+FIGHT_ASK_WIDTH && mouseY > FIGHT_ASK_Y && mouseY < FIGHT_ASK_Y+FIGHT_ASK_HEIGHT){
		fight_ask_move = true;
	}else{
		fight_ask_move = false;
	}
	var positionX = mouseX - 26;
	var positionY = mouseY - 85;
	if(positionX>=0 && positionX<580){
		if(positionY>=0 && positionY<580){
			mousePosition = -1;
			while(positionX>=0){
				if(positionX<46){
					mousePosition++;
					break;
				}else if(positionX<66){
					mousePosition+=2;
					break;
				}else{
					mousePosition+=2;
					positionX-=67;
				}
			}
			while(positionY>=0){
				if(positionY<46){
					break;
				}else if(positionY<66){
					mousePosition+=17;
					break;
				}else{
					mousePosition+=34;
					positionY-=67;
				}
			}
		}else{
			mousePosition = -1;
		}
	}else{
		mousePosition = -1;
	}
}

function Update()
{

}

function Render()
{
	var theCanvas = document.getElementById("canvas");
	var Context = theCanvas.getContext("2d");
	
	Context.fillStyle = "#bbada0";
	Context.fillStyle = "#aa9c8f";
	Context.fillRect(0, 0, 900, 690);
	
	Context.fillStyle = "#DDDDDD";
	
	// FPS 표시 
	Context.fillStyle = "#000000";
	Context.font = '15px Nanum';
	Context.textBaseLine = "top";
	Context.textAlign = 'center';
	
	// Context.fillText("Connect List", 710, 110);
	// for(var i in quoridor_gallery){
		// Context.textAlign = 'left';
		// if(server_player.length>0 && server_player[0].nickname == quoridor_gallery[i].nickname){
			// Context.fillStyle = "#00FF00";
		// }else if(server_player.length>1 && server_player[1].nickname == quoridor_gallery[i].nickname){
			// Context.fillStyle = "#0000FF";
		// }else{
			// Context.fillStyle = "#000000";
		// }
		// if(i<7) {
			// Context.fillText(quoridor_gallery[i].nickname, 640, 130+20*i);
		// }else if(i<13){
			// Context.fillText(quoridor_gallery[i].nickname, 750, 130+20*i);
		// }else{
// 			
		// }
		// // Context.fillStyle = "#000000";
		// // if(playerList[i] == player.name) Context.fillText('You --> ', 725, 130+20*i);	
	// }
	
	// Context.fillStyle = "#000000";
	// Context.font = '12px Nanum';
	// Context.textAlign = 'left';
	// Context.fillText('--------------System----------------', 630, 280);
	// if(server_system_chat != undefined){
		// switch(server_system_chat.type){
			// case 0:{Context.fillStyle = "#000000"; break;}
			// case 1:{Context.fillStyle = "#000000"; break;}
			// case 2:{Context.fillStyle = "#000000"; break;}
			// case 3:{Context.fillStyle = "#000000"; break;}
			// case 4:{Context.fillStyle = "#00FF00"; break;}
			// case 5:{Context.fillStyle = "#0000FF"; break;}
		// }
		// Context.fillText(server_system_chat.str, 630, 300);
		// switch(server_system_chat.type){
			// case 0:{Context.fillStyle = "#000000"; break;}
			// case 1:{Context.fillStyle = "#000000"; break;}
			// case 2:{Context.fillStyle = "#00FF00"; break;}
			// case 3:{Context.fillStyle = "#0000FF"; break;}
			// case 4:{Context.fillStyle = "#000000"; break;}
			// case 5:{Context.fillStyle = "#000000"; break;}
		// }		
		// Context.fillText(server_system_chat.str2, 630, 320);
	// }
	// Context.fillStyle = "#000000";
	// Context.fillText('---------------Chat-----------------', 630, 340);
	// for(var i in chat){
		// Context.fillStyle = "#000000";
		// var str = chat[i].nickname+' : '+chat[i].str;
		// Context.fillText(str, 630, 360+20*i);
	// }
	
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
	if(test){
		Context.fillStyle = "#000000";
		Context.fillRect(10, 10, 10, 10);
	}	
}

function gameLoop()
{
	Update();
	Render();
	
	// frameCounter.countFrame();
}