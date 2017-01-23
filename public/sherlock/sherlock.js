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

var reserveData = undefined;
var reserveDataUpdate = '';

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
	socket.emit('sherlockReserveData');
	
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
	
	socket.on('sherlockReserveData', function(data){
		reserveData = data;
		var date = new Date(Number(reserveData.time));
		reserveDataUpdate = '';
		reserveDataUpdate += (date.getMonth()+1) + '월 ';
		reserveDataUpdate += date.getDate() + '일 ';
		if(date.getHours() < 12) reserveDataUpdate += '오전 ';
		else reserveDataUpdate += '오후 ';
		if(date.getHours()%12 == 0) reserveDataUpdate += '12시 ';
		else reserveDataUpdate += (date.getHours()%12) + '시 ';
		if(date.getMinutes()<10) reserveDataUpdate += '0';
		reserveDataUpdate += date.getMinutes() + '분';
	});
	
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
	if(timeMode1 == 1) timeGap1 = time1 + 3600000 -newTime;
	if(timeMode2 == 1) timeGap2 = time2 + 3600000 -newTime;
	if(timeMode3 == 1) timeGap3 = time3 + 3600000 -newTime;
	if(timeMode4 == 1) timeGap4 = time4 + 3600000 -newTime;
	if(timeMode5 == 1) timeGap5 = time5 + 3600000 -newTime;
	if(timeMode6 == 1) timeGap6 = time6 + 3600000 -newTime;
	
	Context.fillStyle = "#faf8ef";
	Context.fillRect(0, 0, 900, 240);
	if(timeMode1==0) Context.fillStyle = "#00CC00";
	else Context.fillStyle = "#ff0000";
	Context.fillRect(0, 0, 150, 110);
	if(timeMode2==0) Context.fillStyle = "#00CC00";
	else Context.fillStyle = "#ff0000";
	Context.fillRect(160, 0, 150, 110);
	if(timeMode3==0) Context.fillStyle = "#00CC00";
	else Context.fillStyle = "#ff0000";
	Context.fillRect(320, 0, 150, 110);
	if(timeMode4==0) Context.fillStyle = "#00CC00";
	else Context.fillStyle = "#ff0000";
	Context.fillRect(0, 120, 150, 110);
	if(timeMode5==0) Context.fillStyle = "#00CC00";
	else Context.fillStyle = "#ff0000";
	Context.fillRect(160, 120, 150, 110);
	if(timeMode6==0) Context.fillStyle = "#00CC00";
	else Context.fillStyle = "#ff0000";
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
	if(timeMode1 == 1) {
		if(timeGap1 < 600000) Context.fillStyle = "#FF0000";
		else Context.fillStyle = "#000000";
		Context.fillText(Math.floor(timeGap1/60000)+'분 '+Math.floor((timeGap1%60000)/1000)+'초', 80, 55);
	}
	if(timeMode2 == 1) {
		if(timeGap2 < 600000) Context.fillStyle = "#FF0000";
		else Context.fillStyle = "#000000";
		Context.fillText(Math.floor(timeGap2/60000)+'분 '+Math.floor((timeGap2%60000)/1000)+'초', 240, 55);
	}
	if(timeMode3 == 1) {
		if(timeGap3 < 600000) Context.fillStyle = "#FF0000";
		else Context.fillStyle = "#000000";
		Context.fillText(Math.floor(timeGap3/60000)+'분 '+Math.floor((timeGap3%60000)/1000)+'초', 400, 55);
	}
	if(timeMode4 == 1) {
		if(timeGap4 < 600000) Context.fillStyle = "#FF0000";
		else Context.fillStyle = "#000000";
		Context.fillText(Math.floor(timeGap4/60000)+'분 '+Math.floor((timeGap4%60000)/1000)+'초', 80, 175);
	}
	if(timeMode5 == 1) {
		if(timeGap5 < 600000) Context.fillStyle = "#FF0000";
		else Context.fillStyle = "#000000";
		Context.fillText(Math.floor(timeGap5/60000)+'분 '+Math.floor((timeGap5%60000)/1000)+'초', 240, 175);
	}
	if(timeMode6 == 1) {
		if(timeGap6 < 600000) Context.fillStyle = "#FF0000";
		else Context.fillStyle = "#000000";
		Context.fillText(Math.floor(timeGap6/60000)+'분 '+Math.floor((timeGap6%60000)/1000)+'초', 400, 175);
	}
	
	// 고흐, 스토커, 저주, 레시피, 웨딩, 화이트
	Context.font = '10px Nanum';
	Context.fillStyle = "#000000";
	if(reserveData != undefined)
	Context.fillText('크루즈', 500, 20);
	Context.fillText('스토커', 500, 45);
	Context.fillText('고흐', 500, 70);
	Context.fillText('레시피', 500, 95);
	Context.fillText('저주', 500, 120);
	Context.fillText('화이트', 500, 145);
	
	var nowTime = (newTime+9*3600000)%86400000;
	var gapTime = 0;
	var gapPoint = 0;
	
	if(nowTime > 36000000){
		gapTime = nowTime-36000000;
		gapPoint = Math.floor((gapTime/3600000)*27);
	}
	
	for(var j=0; j<6; j++){
		var reserveItem = undefined;
		switch(j){
			case 0: reserveItem = reserveData.wedding; break;
			case 1: reserveItem = reserveData.stalker; break;
			case 2: reserveItem = reserveData.gogh; break;
			case 3: reserveItem = reserveData.recipe; break;
			case 4: reserveItem = reserveData.curse; break;
			case 5: reserveItem = reserveData.white; break;
		}
		for(var i=0; i<10; i++){
			if(reserveItem[i] == 0){
				if(gapPoint > i*36+Math.floor(j*4.5)){
					Context.fillStyle = "#AAAAAA";
				}else{
					Context.fillStyle = "#00CC00";
				}
			}else{
				if(gapPoint > i*36+Math.floor(j*4.5)){
					Context.fillStyle = "#AAAAAA";
				}else{
					Context.fillStyle = "#FFAAAA";
				}
			}
			Context.fillRect(530+i*36+Math.floor(j*4.5), 8+j*25, 27, 18);
		}
	}
	Context.fillStyle = "#000000";
	for(var i=0; i<reserveData.gogh.length; i++){
		// Context.fillText(reserveData.gogh[i], 500+30*i, 30);
	}
	
	
	if(nowTime > 36000000){
		Context.fillStyle = "#ff0000";
		Context.fillRect(530+gapPoint, 8, 2, 150);
		Context.fillRect(530+gapPoint, 8, 27, 2);
		Context.fillRect(530+gapPoint+27, 8, 2, 143);
		Context.fillRect(530+gapPoint, 149, 27, 2);
		// Context.fillText(gapPoint, 690, 180);
		Context.fillStyle = "#000000";
		Context.fillText(Math.floor(nowTime/3600000)+'시 '+Math.floor((nowTime%3600000)/60000)+'분', 530+gapPoint, 170);
	}
	Context.fillText('최종 업데이트 시간 : '+reserveDataUpdate, 690, 220);
	// Context.fillText(reserveData.gogh[0], 500, 30);
	
	Context.font = '9px Nanum';
	for(var i=0; i<10; i++){
		for(var j=0; j<6; j++){
			var num = 1000 + j*10;
			for(var k=0; k<i; k++){
				num += 120;
				if(num%100 >= 60){
					num += 40;
				}
			}
			
			var numstring = '';
			numstring += String(Math.floor(num/100));
			numstring += ':';
			if(num%100 < 10){
				numstring += '0';
			}
			numstring += String(num%100);
			Context.fillText(numstring, Math.floor(543.5 + i*36 + j*4.5), 20+j*25);
		}
	}
}

function gameLoop()
{
	Update();
	Render();
}