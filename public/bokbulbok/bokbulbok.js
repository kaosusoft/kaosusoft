
var mouseX = 0;
var mouseY = 0;

var player = {
	name: '',
	player1: undefined,
	player2: undefined
};

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
	
	onPageLoadComplete();
});

function onPageLoadComplete()
{
	var FPS = 30;
	
	setInterval(gameLoop, 1000/FPS);
	
	var player1_img = new Image();
	var player2_img = new Image();
	player1_img.src = "../bokbulbok/img/player1.png";
	player2_img.src = "../bokbulbok/img/player2.png";
	player.player1 = new Object(player1_img);
	player.player2 = new Object(player2_img);
	player.player1.SetPosition(26, 85+67*4);
	player.player2.SetPosition(26+67*8, 85+67*4);
}

function mouseClick(){
	
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
	Context.fillRect(0, 0, 900, 690);
	
	Context.fillStyle = "#DDDDDD";
	

	// 전광판
	player.player1.Draw(Context, 227, 10);
	player.player2.Draw(Context, 361, 10);
	
}

function gameLoop()
{
	Update();
	Render();
	
	// frameCounter.countFrame();
}