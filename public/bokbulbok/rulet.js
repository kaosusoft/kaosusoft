
var mouseX = 0;
var mouseY = 0;
var centerX = 175;
var centerY = 200;
var rulet_radius = 120;
var start_radius = 150;
var division_degree = [0, Math.PI];
var division_degree_show = [0, 2 * Math.PI, 2 * Math.PI, 2 * Math.PI, 2 * Math.PI, 2 * Math.PI, 2 * Math.PI, 2 * Math.PI];
var divisions = 2;
var plusButtonCenterX = 290;
var plusButtonCenterY = 45;
var plusButtonWidth = 50;
var plusButtonHeight = 50;
var plusButtonGap = 10;
var minusButtonCenterX = 60;
var minusButtonCenterY = 45;
var minusButtonWidth = 50;
var minusButtonHeight = 50;
var minusButtonGap = 10;
var okButtonCenterX = 290;
var okButtonCenterY = 355;
var okButtonWidth = 50;
var okButtonHeight = 50;
var okButtonRadius = 15;
var cancleButtonCenterX = 60;
var cancleButtonCenterY = 355;
var cancleButtonWidth = 50;
var cancleButtonHeight = 50;
var cancleButtonGap = 10;
var startButtonCenterX = centerX;
var startButtonCenterY = 355;
var startButtonWidth = 50;
var startButtonHeight = 50;
var startButtonRadius = 15;
var startSpeed = 0.6;
var arrowSpeed = 0;
var arrowDegree = 0;
var arrowRadius = 100;
var phase = 0;
var player = [];
var oldTime;
var newTime;

var color = ["#FF0000", "#FF5E00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF", "#FFB2D9"];

function player_input(){
	if($('#input_player').val().length>0){
		player.push($('#input_player').val());
		$('#input_player').val('');
	}
}

$(document).ready(function(){
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
	
	$('#btn_add').click(function(){
		player_input();
	});
	
	onPageLoadComplete();
});

function onPageLoadComplete()
{
	var FPS = 30;
	
	setInterval(gameLoop, 1000/FPS);
}

function point(x, y, direction){
	this.x = x;
	this.y = y;
	this.direction = direction;
};

function mouseClick(){
	if(mouseX > plusButtonCenterX-plusButtonWidth/2 && mouseX < plusButtonCenterX + plusButtonWidth/2 &&
		mouseY > plusButtonCenterY-plusButtonHeight/2 && mouseY < plusButtonCenterY + plusButtonHeight/2){
			if(phase == 0){
				if(divisions < 8) {
					divisions += 1;
					division_degree.splice(0, division_degree.length);
					for(var i=0; i<divisions; i++){
						division_degree.push(2 * Math.PI / divisions * i);
					}
				}
			}
		}
		
	if(mouseX > minusButtonCenterX-minusButtonWidth/2 && mouseX < minusButtonCenterX + minusButtonWidth/2 &&
	mouseY > minusButtonCenterY-minusButtonHeight/2 && mouseY < minusButtonCenterY + minusButtonHeight/2){
		if(divisions > 2) {
			if(phase == 0){
				divisions -= 1;
				division_degree.splice(0, division_degree.length);
				for(var i=0; i<divisions; i++){
					division_degree.push(2 * Math.PI / divisions * i);
				}
			}
		}
	}
	
	if(mouseX > okButtonCenterX-okButtonWidth/2 && mouseX < okButtonCenterX + okButtonWidth/2 &&
	mouseY > okButtonCenterY-okButtonHeight/2 && mouseY < okButtonCenterY + okButtonHeight/2){
		if(phase == 0) phase = 1;
		else if(phase == 1) phase = 2;
	}
	
	if(mouseX > cancleButtonCenterX-cancleButtonWidth/2 && mouseX < cancleButtonCenterX + cancleButtonWidth/2 &&
	mouseY > cancleButtonCenterY-cancleButtonHeight/2 && mouseY < cancleButtonCenterY + cancleButtonHeight/2){
		if(phase == 1) phase = 0;
		else if(phase == 2) phase = 1;
		else if(phase == 0) player.splice(0, player.length);
		if(phase == 4) phase = 2;
	}
	
	if(mouseX > startButtonCenterX-startButtonWidth/2 && mouseX < startButtonCenterX + startButtonWidth/2 &&
	mouseY > startButtonCenterY-startButtonHeight/2 && mouseY < startButtonCenterY + startButtonHeight/2){
		if(phase == 2){
			phase = 3;
			arrowSpeed = startSpeed * (0.6 + 3 * Math.random()/5);
			arrowDegree = 0;
			oldTime = new Date().getTime();
		}
	}
}

function mouseMove(){

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
	Context.fillRect(0, 0, 350, 400);
	
	Context.fillStyle = "#DDDDDD";
	
	for(var i=0; i<8; i++){
		Context.beginPath();
		Context.strokeStyle = '#000000';
		if(i == divisions-1 || i == 7){
			Context.arc(centerX, centerY, rulet_radius, division_degree_show[i], 2*Math.PI, false);
			Context.lineTo(centerX, centerY);
			Context.lineTo(centerX + rulet_radius * Math.cos(division_degree_show[i]), centerY + rulet_radius * Math.sin(division_degree_show[i]));
		}else{
			Context.arc(centerX, centerY, rulet_radius, division_degree_show[i], division_degree_show[i+1], false);
			Context.lineTo(centerX, centerY);
			Context.lineTo(centerX + rulet_radius * Math.cos(division_degree_show[i]), centerY + rulet_radius * Math.sin(division_degree_show[i]));
			
		}
		Context.fillStyle = color[i];
		Context.fill();
		Context.lineWidth = 5;
		Context.stroke();
	}
	
	if(phase == 0){
		Context.beginPath();
		Context.rect(plusButtonCenterX-plusButtonWidth/2, plusButtonCenterY-plusButtonWidth/2, plusButtonWidth, plusButtonHeight);
		Context.fillStyle = 'green';
		Context.fill();
		Context.lineWidth = 3;
		Context.strokeStyle = '#003300';
		Context.stroke();
		
		Context.beginPath();
		Context.strokeStyle = '#003300';
		Context.lineWidth = 3;
		Context.moveTo(plusButtonCenterX, plusButtonCenterY-plusButtonHeight/2+plusButtonGap);
		Context.lineTo(plusButtonCenterX, plusButtonCenterY+plusButtonHeight/2-plusButtonGap);
		Context.moveTo(plusButtonCenterX-plusButtonWidth/2+plusButtonGap, plusButtonCenterY);
		Context.lineTo(plusButtonCenterX+plusButtonWidth/2-plusButtonGap, plusButtonCenterY);
		Context.stroke();
		Context.stroke();
	
		Context.beginPath();
		Context.rect(minusButtonCenterX-minusButtonWidth/2, minusButtonCenterY-minusButtonWidth/2, minusButtonWidth, minusButtonHeight);
		Context.fillStyle = 'magenta';
		Context.fill();
		Context.lineWidth = 3;
		Context.strokeStyle = '#330033';
		Context.stroke();
		
		Context.beginPath();
		Context.strokeStyle = '#330033';
		Context.lineWidth = 3;
		Context.moveTo(minusButtonCenterX-minusButtonWidth/2+minusButtonGap, minusButtonCenterY);
		Context.lineTo(minusButtonCenterX+minusButtonWidth/2-minusButtonGap, minusButtonCenterY);
		Context.stroke();
	}
	
	if(phase < 2){
		Context.beginPath();
		Context.rect(okButtonCenterX-okButtonWidth/2, okButtonCenterY-okButtonWidth/2, okButtonWidth, okButtonHeight);
		Context.fillStyle = 'yellow';
		Context.fill();
		Context.lineWidth = 3;
		Context.strokeStyle = '#333300';
		Context.stroke();
		
		Context.beginPath();
		Context.strokeStyle = '#333300';
		Context.lineWidth = 3;
		Context.arc(okButtonCenterX, okButtonCenterY, okButtonRadius, 0, 2 * Math.PI, false);
		Context.stroke();
	}
	
	if(phase < 3 || phase == 4){
		Context.beginPath();
		Context.rect(cancleButtonCenterX-cancleButtonWidth/2, cancleButtonCenterY-cancleButtonWidth/2, cancleButtonWidth, cancleButtonHeight);
		Context.fillStyle = 'red';
		Context.fill();
		Context.lineWidth = 3;
		Context.strokeStyle = '#330000';
		Context.stroke();
		
		Context.beginPath();
		Context.strokeStyle = '#330000';
		Context.lineWidth = 3;
		Context.moveTo(cancleButtonCenterX-cancleButtonWidth/2+cancleButtonGap, cancleButtonCenterY-cancleButtonHeight/2+cancleButtonGap);
		Context.lineTo(cancleButtonCenterX+cancleButtonWidth/2-cancleButtonGap, cancleButtonCenterY+cancleButtonHeight/2-cancleButtonGap);
		Context.moveTo(cancleButtonCenterX-cancleButtonWidth/2+cancleButtonGap, cancleButtonCenterY+cancleButtonHeight/2-cancleButtonGap);
		Context.lineTo(cancleButtonCenterX+cancleButtonWidth/2-cancleButtonGap, cancleButtonCenterY-cancleButtonHeight/2+cancleButtonGap);
		Context.stroke();
		Context.stroke();
	}
	
	if(phase == 2){
		Context.beginPath();
		Context.rect(startButtonCenterX-startButtonWidth/2, startButtonCenterY-startButtonWidth/2, startButtonWidth, startButtonHeight);
		Context.fillStyle = 'cyan';
		Context.fill();
		Context.lineWidth = 3;
		Context.strokeStyle = '#003333';
		Context.stroke();
		
		Context.fillStyle = '#003333';
		Context.textAlign = 'center';
		Context.font = 'bold 24px Nanum';
		Context.fillText('Go', startButtonCenterX, startButtonCenterY+8);
	}
	
	if(phase > 1){	
		Context.beginPath();
		Context.strokeStyle = '#000000';
		Context.arc(centerX, centerY, 10, 0, 2*Math.PI, false);
		Context.fillStyle = '#FFFFFF';
		Context.fill();
		Context.lineWidth = 2;
		Context.stroke();
		
		Context.beginPath();
		Context.strokeStyle = '#FFFFFF';
		Context.moveTo(centerX, centerY);
		Context.lineTo(centerX + arrowRadius * Math.cos(arrowDegree), centerY + arrowRadius * Math.sin(arrowDegree));
		Context.lineWidth = 6;
		Context.lineCap = 'round';
		Context.stroke();
		Context.lineCap = 'butt';
	}
	
	if(phase == 3){
		if(arrowSpeed < 0) phase = 4;
		else{
			newTime = new Date().getTime();
			var gapTime = newTime - oldTime;
			oldTime = newTime;
			arrowSpeed -= (0.1 * gapTime/1000 * (0.8 + 2 * Math.random()/5));
			arrowDegree = arrowDegree + arrowSpeed;
			
			while(true){
				if(arrowDegree >= (2 * Math.PI)){
					arrowDegree -= 2*Math.PI;
				}else{
					break;
				}
			}
		}
		console.log(arrowSpeed);
	}
	
	Context.fillStyle = "#000000";
	Context.textAlign = 'center';
	Context.font = 'bold 12px Nanum';
	Context.strokeStyle = "#000000";
	Context.lineWidth = 2;
	
	Context.fillStyle = "#000000";
	
	
	for(var i=0; i<divisions; i++){
		if(division_degree[i]+0.01 < division_degree_show[i]){
			division_degree_show[i] -= (division_degree_show[i]-division_degree[i])/6;
		}else if(division_degree[i]-0.01 > division_degree_show[i]){
			division_degree_show[i] += (division_degree[i]-division_degree_show[i])/6;
		}else{
			division_degree_show[i] = division_degree[i];
		}
	}
	for(var i=divisions; i<8; i++){
		if(division_degree_show[i] < 2 * Math.PI - 0.01){
			division_degree_show[i] += (2 * Math.PI - division_degree_show[i])/6;
		}else{
			division_degree_show[i] = 2 * Math.PI;
		}
	}
	
	for(var i=0; i<divisions; i++){
		Context.beginPath();
		if(i < 7){
			if(i < player.length){
				Context.fillText(player[i], centerX + 3 * rulet_radius/4 * Math.cos((division_degree_show[i]+division_degree_show[i+1])/2), centerY + 3 * rulet_radius/4 * Math.sin((division_degree_show[i]+division_degree_show[i+1])/2));
			}
			// Context.arc(centerX + rulet_radius/2 * Math.cos((division_degree_show[i]+division_degree_show[i+1])/2), centerY + rulet_radius/2 * Math.sin((division_degree_show[i]+division_degree_show[i+1])/2), 5, 0, 2 * Math.PI, false);
			// Context.fillStyle = 'black';
			// Context.fill();
		}else if(i == 7){
			if(i < player.length){
				Context.fillText(player[i], centerX + 3 * rulet_radius/4 * Math.cos((division_degree_show[i]+2*Math.PI)/2), centerY + 3 * rulet_radius/4 * Math.sin((division_degree_show[i]+2*Math.PI)/2));
			}
			// Context.arc(centerX + rulet_radius/2 * Math.cos((division_degree_show[i]+2 * Math.PI)/2), centerY + rulet_radius/2 * Math.sin((division_degree_show[i]+2*Math.PI)/2), 5, 0, 2 * Math.PI, false);
			// Context.fillStyle = 'black';
			// Context.fill();
		}
		Context.stroke();
	}
}

function gameLoop()
{
	Update();
	Render();
	
	// frameCounter.countFrame();
}