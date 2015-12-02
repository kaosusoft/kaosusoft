window.addEventListener("load", onMouseMove, false);
window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);
window.addEventListener("mousedown", onMouseDown, false);
window.addEventListener("mousemove", onMouseMove, false);

function InputSystem()
{
	this.mouseX = 0;
	this.mouseY = 0;
	this.isKeyPressed = [];
	return this;
}

function onMouseDown(e){
	var theCanvas = document.getElementById("canvas");
	
	inputSystem.mouseX = e.pageX - theCanvas.offsetLeft;
	inputSystem.mouseY = e.pageY - theCanvas.offsetTop;
	
	mouseClick();
}

function onMouseMove(e)
{
	var theCanvas = document.getElementById("canvas");
	
	inputSystem.mouseX = e.pageX - theCanvas.offsetLeft;
	inputSystem.mouseY = e.pageY - theCanvas.offsetTop;
	
	mouseMove();
}

function onKeyDown(e)
{
	inputSystem.isKeyPressed[e.keyCode] = true;
}

function onKeyUp(e)
{
	inputSystem.isKeyPressed[e.keyCode] = false;
}

var inputSystem = new InputSystem();

InputSystem.prototype.isKeyDown = function(keyCode)
{
	if(this.isKeyPressed[keyCode] == true)
	{
		return true;
	}else
	{
		return false;
	}
};
