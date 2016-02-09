
var mouseX = 0;
var mouseY = 0;

var line_number = 6;
var line_gap = 300 / (line_number-1);
var line_left_margin = 25;
var line_top_margin = 50;
var line_distance = 250;
var point_top_margin = 20;
var line_data1 = [];
var line_data2 = [];
var point_data = [];
var selection = 0;
var selection_data = [0, 0, 0, 0, 0, 0, 0, 0];
var selection_color = ["#FF0000", "#FF5E00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF", "#FFB2D9"];
var result_data = [0, 0, 0, 0, 0, 0, 0, 0];
var sadari_speed = 10;
var sadari_selection = [];
var targetX = 0;
var targetY = 0;
var direction = 0;
var next_direction = 0;
var nowX = 0;
var nowY = 0;
var path_data = [];

var player = {
	name: '',
	player1: undefined,
	player2: undefined
};

var nowTime = 0;

$(document).ready(function(){
	var canvas = document.getElementById('canvas');
	
	line_number = data.range;
	line_gap = 300 / (line_number-1);
	line_data1 = [data.input_1_1, data.input_1_2, data.input_1_3, data.input_1_4, data.input_1_5, data.input_1_6, data.input_1_7, data.input_1_8];
	line_data2 = [data.input_2_1, data.input_2_2, data.input_2_3, data.input_2_4, data.input_2_5, data.input_2_6, data.input_2_7, data.input_2_8];
	if(isCan){
		point_data.push(data.point1);
		point_data.push(data.point2);
		point_data.push(data.point3);
		point_data.push(data.point4);
		point_data.push(data.point5);
		point_data.push(data.point6);
		point_data.push(data.point7);
	}
	
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

function makePath(){
	if(selection < 1) {
		path_data.splice(0, path_data.length);
		return;
	}
	// next_direction = 1;
	// targetX = i;
	// targetY = 0;
	// nowX = i;
	// nowY = -1;
	// path_data.clear();
// 	
	// var temp = point_data[selection-1][0];
	// if(i>0 && i<line_number-1){
		// if(point_data[i-1][1]<temp) {
			// next_direction = -1;
			// targetX = i-1;
			// targetY = 1;
		// }
	// }else if(i == line_number-1){
		// next_direction = -1;
		// targetX = i-1;
		// targetY = 1;
	// }
	
	path_data.splice(0, path_data.length);
	var temp_direction = 0;
	var tempX = selection-1;
	var tempY = -1;
	path_data.push(new point(tempX, tempY, temp_direction));
	var temp;
	var br = 0;
	var line = selection-1;
	
	while(true){
		tempX = path_data[path_data.length-1].x;
		tempY = path_data[path_data.length-1].y;
		temp_direction = path_data[path_data.length-1].direction;
		if(tempY == -1){
			line = tempX;
		}else if(tempY % 2 == 0){
			line = tempX;
		}else{
			line = tempX + 1;
		}
		
		
		if(line>0 && line < line_number-1){
			if(tempY<0){
				tempY = 0;
				temp_direction = 1;
				temp = point_data[selection-1][tempY];
				if(point_data[selection-2][1]<temp){
					temp_direction = -1;
					tempX = selection - 2;
					tempY = 1;
				}
				if(tempY > point_data[tempX].length-1) {
					path_data.push(new point(tempX, 100, temp_direction));
					break;
				}
				path_data.push(new point(tempX, tempY, temp_direction));
			}else{
				if(temp_direction == 0){
					if(tempY % 2 == 1){
						var t_tempY = tempY + 2;
						var t_tempX = tempX;
						temp_direction = -1;
						var min_point = 0, max_point = 0;
						if(t_tempY > point_data[tempX].length-1) {
							min_point = point_data[tempX][tempY];
							max_point = 101;
							t_tempY = 100;
						}else{
							min_point = point_data[tempX][tempY];
							max_point = point_data[t_tempX][t_tempY];
						}
						for(var i=0; i<point_data[line].length; i+=2){
							if(point_data[line][i]<max_point && point_data[line][i] > min_point){
								t_tempX = line;
								t_tempY = i;
								temp_direction = 1;
								break;
							}
						}
						tempX = t_tempX;
						tempY = t_tempY;
						if(tempY > 99) {
							path_data.push(new point(line, tempY, temp_direction));
							break;
						}
						path_data.push(new point(tempX, tempY, temp_direction));
					}else{
						var t_tempX = tempX;
						var t_tempY = tempY + 2;
						temp_direction = 1;
						var min_point = 0, max_point = 0;
						if(t_tempY > point_data[tempX].length-1) {
							min_point = point_data[tempX][tempY];
							max_point = 101;
							t_tempY = 100;
						}else{
							min_point = point_data[tempX][tempY];
							max_point = point_data[line][t_tempY];
						}
						for(var i=1; i<point_data[line-1].length; i+=2){
							if(point_data[line-1][i]<max_point && point_data[line-1][i] > min_point){
								tempX = line-1;
								t_tempY = i;
								temp_direction = -1;
								break;
							}
						}
						tempY = t_tempY;
						if(tempY > 99) {
							path_data.push(new point(line, tempY, temp_direction));
							break;
						}
						path_data.push(new point(tempX, tempY, temp_direction));
					}
				}else if(temp_direction == 1){
					tempX = tempX;
					tempY = tempY+1;
					temp_direction = 0;
					if(tempY > point_data[tempX].length-1) {
						path_data.push(new point(tempX, 100, temp_direction));
						break;
					}
					path_data.push(new point(tempX, tempY, temp_direction));
				}else{
					tempX = tempX;
					tempY = tempY-1;
					temp_direction = 0;
					if(tempY > point_data[tempX].length-1) {
						path_data.push(new point(tempX, 100, temp_direction));
						break;
					}
					path_data.push(new point(tempX, tempY, temp_direction));
				}
			}
		}else if(line == 0){
			if(tempY<0){
				tempY = 0;
				temp = point_data[selection-1][tempY];
				temp_direction = 1;
				if(tempY > point_data[tempX].length-1) {
					path_data.push(new point(tempX, 100, temp_direction));
					break;
				}
				path_data.push(new point(tempX, tempY, temp_direction));
			}else{
				if(temp_direction == 0){
					temp_direction = 1;
					tempX = tempX;
					tempY = tempY+2;
					if(tempY > point_data[tempX].length-1) {
						path_data.push(new point(tempX, 100, temp_direction));
						break;
					}
					path_data.push(new point(tempX, tempY, temp_direction));
				}else{
					temp_direction = 0;
					tempX = tempX;
					tempY = tempY+1;
					if(tempY > point_data[tempX].length-1) {
						path_data.push(new point(tempX, 100, temp_direction));
						break;
					}
					path_data.push(new point(tempX, tempY, temp_direction));
				}
			}
		}else if(line == line_number-1){
			if(tempY<0){
				tempY = 1;
				temp_direction = -1;
				if(tempY > point_data[tempX-1].length-1) {
					path_data.push(new point(tempX, 100, temp_direction));
					break;
				}
				path_data.push(new point(tempX-1, tempY, temp_direction));
			}else{
				if(temp_direction == 0){
					var t_tempY = tempY + 2;
					var t_tempX = tempX;
					temp_direction = -1;
					var min_point = 0, max_point = 0;
					if(t_tempY > point_data[tempX].length-1) {
						t_tempX = line;
						t_tempY = 100;
					}
					
					tempX = t_tempX;
					tempY = t_tempY;
					if(tempY > 99) {
						path_data.push(new point(line, tempY, temp_direction));
						break;
					}
					path_data.push(new point(tempX, tempY, temp_direction));
				}else{
					tempX = tempX;
					tempY = tempY-1;
					temp_direction = 0;
					if(tempY > point_data[tempX].length-1) {
						path_data.push(new point(tempX, 100, temp_direction));
						break;
					}
					path_data.push(new point(tempX, tempY, temp_direction));
				}
			}
		}
		br++;
		if(br>25) break;
	}
	result_data[line] = selection;	
}

function mouseClick(){
	if(isCan){
		for(var i=0; i<line_number; i++){
			if(Math.abs(mouseX-(line_left_margin + i * line_gap))<(line_gap/2) && Math.abs(mouseY-25)<20){
				if(selection_data[i]==0) {
					selection = i+1;
					makePath();
				}
				break;
			}
		}
	}else{
		if(valid<=0){
			location.reload(true);
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
	
	if(valid > 0) {
		nowTime = new Date().getTime();
		var gapTime = nowTime - date;
		date = nowTime;
		valid -= gapTime;
	}
	
	Context.fillStyle = "#000000";
	Context.textAlign = 'center';
	Context.font = 'bold 12px Nanum';
	Context.strokeStyle = "#000000";
	Context.lineWidth = 2;
	
	for(var i=0; i<line_number; i++){
		Context.fillStyle = selection_color[i];
		Context.fillText(line_data1[i], line_left_margin + i * line_gap, 30);
		if(result_data[i] > 0){
			Context.fillStyle = selection_color[result_data[i]-1];
		}else{
			Context.fillStyle = "#000000";
		}
		Context.fillText(line_data2[i], line_left_margin + i * line_gap, 320);
		Context.beginPath();
		Context.strokeStyle = "#000000";
		Context.moveTo(line_left_margin + i * line_gap, line_top_margin);
		Context.lineTo(line_left_margin + i * line_gap, line_top_margin + line_distance);
		Context.stroke();
	}
	
	if(isCan){
		for(var i=0; i<line_number-1; i++){
			for(var j=0; j<point_data[i].length; j+=2){
				Context.strokeStyle = "#000000";
				Context.moveTo(line_left_margin + i * line_gap, line_top_margin + point_top_margin + (line_distance - 2 * point_top_margin) * point_data[i][j]/100);
				Context.lineTo(line_left_margin + (i+1) * line_gap, line_top_margin + point_top_margin + (line_distance - 2 * point_top_margin) * point_data[i][j+1]/100);
				Context.stroke();
			}
		}
		
		Context.beginPath();
		Context.strokeStyle = selection_color[selection-1];
		Context.lineWidth = 3;
		
		for(var i=0; i<path_data.length; i++){
			var nowPointX = 0, nowPointY = 0;
			var targetPointX = 0, targetPointY = 0;
			
			var pathX = path_data[i].x;
			var pathY = path_data[i].y;
			var pathDirection = path_data[i].direction;		
			
			if(pathY < 0){
				nowPointX = line_left_margin + pathX * line_gap;
				nowPointY = line_top_margin;
				Context.moveTo(nowPointX, nowPointY);
			}else if(pathY > 99){
				nowPointX = line_left_margin + pathX * line_gap;
				nowPointY = line_top_margin + line_distance;
				Context.lineTo(nowPointX, nowPointY);
				
			}else{
				if(pathY % 2 == 1){
					nowPointX = line_left_margin + (pathX+1) * line_gap;
					nowPointY = line_top_margin + point_top_margin + (line_distance - 2 * point_top_margin) * point_data[pathX][pathY]/100;
				}else{
					nowPointX = line_left_margin + pathX * line_gap;
					nowPointY = line_top_margin + point_top_margin + (line_distance - 2 * point_top_margin) * point_data[pathX][pathY]/100;
				}
				
				Context.lineTo(nowPointX, nowPointY);
			}
		}
		Context.stroke();
	}else{
		Context.fillStyle = "#000000";
		Context.textAlign = 'center';
		Context.font = 'bold 12px Nanum';
		Context.strokeStyle = "#000000";
		Context.lineWidth = 2;
		
		Context.fillStyle = "#FF0000";
		Context.textAlign = 'center';
		Context.font = 'bold 18px Nanum';
		Context.fillText("개표시간이 아직 남았습니다.", 175, 180);
		if(valid>0){
			Context.fillText(Math.ceil(valid/1000)+"초", 175, 220);
		}else{
			Context.fillText("새로고침 하세요.", 175, 220);
		}
		
	}
	
}

function gameLoop()
{
	Update();
	Render();
	
	// frameCounter.countFrame();
}