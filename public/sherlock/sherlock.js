var socket = undefined;

var time1 = 0;
var time2 = 0;
var time3 = 0;
var time4 = 0;
var time5 = 0;
var time6 = 0;
var timeMode1 = 0;
var timeMode2 = 0;
var timeMode3 = 0;
var timeMode4 = 0;
var timeMode5 = 0;
var timeMode6 = 0;
var timeGap1 = 0;
var timeGap2 = 0;
var timeGap3 = 0;
var timeGap4 = 0;
var timeGap5 = 0;
var timeGap6 = 0;
var canBtn1 = true;
var canBtn2 = true;
var canBtn3 = true;
var canBtn4 = true;
var canBtn5 = true;
var canBtn6 = true;

var mouseX = 0;
var mouseY = 0;


// function chat_input(){
	// var session = $.cookie("session");
	// if($('#chat').val().length>0){
		// socket.emit('quoridor_chat_input', {
			// session: session,
			// str: $('#chat').val(),
			// room: room
			// });
		// $('#chat').val('');
	// }
// }

$(document).unload(function(){
	if (socket != undefined) socket.disconnect();
});

$(document).ready(function(){
	socket = io.connect();
	
	var canvas = document.getElementById('canvas');
	
	$(canvas).mousedown(function(e){
		mouseX = e.pageX - $(this).offset().left;
		mouseY = e.pageY - $(this).offset().top;
		
		mouseClick();
	});
	
	$(canvas).mousemove(function(e){
		mouseX = e.pageX - $(this).offset().left;
		mouseY = e.pageY - $(this).offset().top;
		
		mouseMove();
	});
	
	$(window).unload(function(){
		
	});
	
	socket.emit('sherlockTimerStart');
	
	socket.on('sherlockTimerStarting', function(data){
		for(var i=0; i<data.length; i+=1){
			if(data[i].name == 1){
				if(data[i].status == 0){
					timeMode1 = 0;
				}else{
					timeMode1 = 1;
					time1 = Number(data[i].timer);
				}
			}else if(data[i].name == 2){
				if(data[i].status == 0){
					timeMode2 = 0;
				}else{
					timeMode2 = 1;
					time2 = Number(data[i].timer);
				}
			}else if(data[i].name == 3){
				if(data[i].status == 0){
					timeMode3 = 0;
				}else{
					timeMode3 = 1;
					time3 = Number(data[i].timer);
				}
			}else if(data[i].name == 4){
				if(data[i].status == 0){
					timeMode4 = 0;
				}else{
					timeMode4 = 1;
					time4 = Number(data[i].timer);
				}
			}else if(data[i].name == 5){
				if(data[i].status == 0){
					timeMode5 = 0;
				}else{
					timeMode5 = 1;
					time5 = Number(data[i].timer);
				}
			}else if(data[i].name == 6){
				if(data[i].status == 0){
					timeMode6 = 0;
				}else{
					timeMode6 = 1;
					time6 = Number(data[i].timer);
				}
			}
		}
	});
	
	socket.on('sherlockTimerSet1', function(data){
		timeMode1 = 1;
		time1 = Number(data);
		canBtn1 = true;
	});
	
	socket.on('sherlockTimerSet2', function(data){
		timeMode2 = 1;
		time2 = Number(data);
		canBtn2 = true;
	});
	
	socket.on('sherlockTimerSet3', function(data){
		timeMode3 = 1;
		time3 = Number(data);
		canBtn3 = true;
	});
	
	socket.on('sherlockTimerSet4', function(data){
		timeMode4 = 1;
		time4 = Number(data);
		canBtn4 = true;
	});
	
	socket.on('sherlockTimerSet5', function(data){
		timeMode5 = 1;
		time5 = Number(data);
		canBtn5 = true;
	});
	
	socket.on('sherlockTimerSet6', function(data){
		timeMode6 = 1;
		time6 = Number(data);
		canBtn6 = true;
	});
	
	socket.on('sherlockTimerReset1', function(data){
		timeMode1 = 0;
		canBtn1 = true;
		timeGap1 = 0;
	});
	
	socket.on('sherlockTimerReset2', function(data){
		timeMode2 = 0;
		canBtn2 = true;
		timeGap2 = 0;
	});
	
	socket.on('sherlockTimerReset3', function(data){
		timeMode3 = 0;
		canBtn3 = true;
		timeGap3 = 0;
	});
	
	socket.on('sherlockTimerReset4', function(data){
		timeMode4 = 0;
		canBtn4 = true;
		timeGap4 = 0;
	});
	
	socket.on('sherlockTimerReset5', function(data){
		timeMode5 = 0;
		canBtn5 = true;
		timeGap5 = 0;
	});
	
	socket.on('sherlockTimerReset6', function(data){
		timeMode6 = 0;
		canBtn6 = true;
		timeGap6 = 0;
	});
	
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
	var FPS = 3;
	
	setInterval(gameLoop, 1000/FPS);
}

var mousePoint = 0;
var test = 0;

function mouseClick(){
	// timeMode = 0 : 초기화상태, 1 : 시간가는 상태
	if(mousePoint == 1 && canBtn1){
		if(timeMode1 == 0) {
			socket.emit('sherlockTimerSet', {
				number : 1
			});
			canBtn1 = false;
		}
	}else if(mousePoint == 2 && canBtn1){
		if(timeMode1 == 1){
			socket.emit('sherlockTimerReset',{
				number : 1
			});
			canBtn1 = false;
		}
	}else if(mousePoint == 3 && canBtn2){
		if(timeMode2 == 0) {
			socket.emit('sherlockTimerSet', {
				number : 2
			});
			canBtn2 = false;
		}
	}else if(mousePoint == 4 && canBtn2){
		if(timeMode2 == 1){
			socket.emit('sherlockTimerReset',{
				number : 2
			});
			canBtn2 = false;
		}
	}else if(mousePoint == 5 && canBtn3){
		if(timeMode3 == 0) {
			socket.emit('sherlockTimerSet', {
				number : 3
			});
			canBtn3 = false;
		}
	}else if(mousePoint == 6 && canBtn3){
		if(timeMode3 == 1){
			socket.emit('sherlockTimerReset',{
				number : 3
			});
			canBtn3 = false;
		}
	}else if(mousePoint == 7 && canBtn4){
		if(timeMode4 == 0) {
			socket.emit('sherlockTimerSet', {
				number : 4
			});
			canBtn4 = false;
		}
	}else if(mousePoint == 8 && canBtn4){
		if(timeMode4 == 1){
			socket.emit('sherlockTimerReset',{
				number : 4
			});
			canBtn4 = false;
		}
	}else if(mousePoint == 9 && canBtn5){
		if(timeMode5 == 0) {
			socket.emit('sherlockTimerSet', {
				number : 5
			});
			canBtn5 = false;
		}
	}else if(mousePoint == 10 && canBtn5){
		if(timeMode5 == 1){
			socket.emit('sherlockTimerReset',{
				number : 5
			});
			canBtn5 = false;
		}
	}else if(mousePoint == 11 && canBtn6){
		if(timeMode6 == 0) {
			socket.emit('sherlockTimerSet', {
				number : 6
			});
			canBtn6 = false;
		}
	}else if(mousePoint == 12 && canBtn6){
		if(timeMode6 == 1){
			socket.emit('sherlockTimerReset',{
				number : 6
			});
			canBtn6 = false;
		}
	}
}

function mouseMove(){
	if(mouseX>5 && mouseX<70 && mouseY>70 && mouseY<100){
		mousePoint = 1;
		return;
	}
	if(mouseX>80 && mouseX<145 && mouseY>70 && mouseY<100){
		mousePoint = 2;
		return;
	}
	if(mouseX>165 && mouseX<230 && mouseY>70 && mouseY<100){
		mousePoint = 3;
		return;
	}
	if(mouseX>240 && mouseX<305 && mouseY>70 && mouseY<100){
		mousePoint = 4;
		return;
	}
	if(mouseX>325 && mouseX<390 && mouseY>70 && mouseY<100){
		mousePoint = 5;
		return;
	}
	if(mouseX>400 && mouseX<465 && mouseY>70 && mouseY<100){
		mousePoint = 6;
		return;
	}
	if(mouseX>5 && mouseX<70 && mouseY>190 && mouseY<220){
		mousePoint = 7;
		return;
	}
	if(mouseX>80 && mouseX<145 && mouseY>190 && mouseY<220){
		mousePoint = 8;
		return;
	}
	if(mouseX>165 && mouseX<230 && mouseY>190 && mouseY<220){
		mousePoint = 9;
		return;
	}
	if(mouseX>240 && mouseX<305 && mouseY>190 && mouseY<220){
		mousePoint = 10;
		return;
	}
	if(mouseX>325 && mouseX<390 && mouseY>190 && mouseY<220){
		mousePoint = 11;
		return;
	}
	if(mouseX>400 && mouseX<465 && mouseY>190 && mouseY<220){
		mousePoint = 12;
		return;
	}
	mousePoint = 0;
}

function Update()
{

}

var oldTime = 0;
var newTime = 0;

function Render()
{
	var theCanvas = document.getElementById("canvas");
	var Context = theCanvas.getContext("2d");
	
	var date = new Date();
	newTime = date.getTime();
	if(timeMode1 == 1) timeGap1 = newTime - time1;
	if(timeMode2 == 1) timeGap2 = newTime - time2;
	if(timeMode3 == 1) timeGap3 = newTime - time3;
	if(timeMode4 == 1) timeGap4 = newTime - time4;
	if(timeMode5 == 1) timeGap5 = newTime - time5;
	if(timeMode6 == 1) timeGap6 = newTime - time6;
	
	Context.fillStyle = "#faf8ef";
	Context.fillRect(0, 0, 470, 240);
	Context.fillStyle = "#aa9c8f";
	Context.fillRect(0, 0, 150, 110);
	Context.fillRect(160, 0, 150, 110);
	Context.fillRect(320, 0, 150, 110);
	Context.fillRect(0, 120, 150, 110);
	Context.fillRect(160, 120, 150, 110);
	Context.fillRect(320, 120, 150, 110);
	Context.fillStyle = "#faf8ef";
	Context.fillRect(2, 2, 146, 106);
	Context.fillRect(162, 2, 146, 106);
	Context.fillRect(322, 2, 146, 106);
	Context.fillRect(2, 122, 146, 106);
	Context.fillRect(162, 122, 146, 106);
	Context.fillRect(322, 122, 146, 106);
	
	Context.fillStyle = "#aa9c8f";
	Context.fillRect(5, 70, 65, 30);
	Context.fillRect(80, 70, 65, 30);
	Context.fillRect(165, 70, 65, 30);
	Context.fillRect(240, 70, 65, 30);
	Context.fillRect(325, 70, 65, 30);
	Context.fillRect(400, 70, 65, 30);
	Context.font = '12px Nanum';
	
	Context.fillRect(5, 190, 65, 30);
	Context.fillRect(80, 190, 65, 30);
	Context.fillRect(165, 190, 65, 30);
	Context.fillRect(240, 190, 65, 30);
	Context.fillRect(325, 190, 65, 30);
	Context.fillRect(400, 190, 65, 30);
	

	Context.fillStyle = "#000000";
	Context.font = '20px Nanum';
	Context.textAlign = 'center';
	Context.textBaseLine = "top";
	Context.fillText('웨딩크루즈', 75, 25);
	Context.fillText('스토커', 235, 25);
	Context.fillText('고흐의방', 395, 25);
	Context.fillText('위험한레시피', 75, 145);
	Context.fillText('저주받은집', 235, 145);
	Context.fillText('화이트의죽음', 395, 145);
	Context.font = '18px Nanum';
	Context.fillText('시작', 37, 93);
	Context.fillText('시작', 197, 93);
	Context.fillText('시작', 357, 93);
	Context.fillText('시작', 37, 213);
	Context.fillText('시작', 197, 213);
	Context.fillText('시작', 357, 213);
	Context.fillText('리셋', 112, 93);
	Context.fillText('리셋', 272, 93);
	Context.fillText('리셋', 432, 93);
	Context.fillText('리셋', 112, 213);
	Context.fillText('리셋', 272, 213);
	Context.fillText('리셋', 432, 213);
	if(timeMode1 == 1) Context.fillText(Math.floor(timeGap1/60000)+'분', 80, 55);
	if(timeMode2 == 1) Context.fillText(Math.floor(timeGap2/60000)+'분', 240, 55);
	if(timeMode3 == 1) Context.fillText(Math.floor(timeGap3/60000)+'분', 400, 55);
	if(timeMode4 == 1) Context.fillText(Math.floor(timeGap4/60000)+'분', 80, 175);
	if(timeMode5 == 1) Context.fillText(Math.floor(timeGap5/60000)+'분', 240, 175);
	if(timeMode6 == 1) Context.fillText(Math.floor(timeGap6/60000)+'분', 400, 175);
	
	// Context.fillText(mousePoint, 10, 30);
	// Context.fillText(test, 10, 50);
	
}

function gameLoop()
{
	Update();
	Render();
}