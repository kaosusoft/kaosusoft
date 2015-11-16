function Object(img)
{
	this.x = 0;
	this.y = 0;
	this.img = img;
	return this;
}

Object.prototype.Render = function(context)
{
	context.drawImage(this.img, this.x, this.y);
};

Object.prototype.Translate = function(x, y)
{
	this.x += x;
	this.y += y;
};

Object.prototype.SetPosition = function(x, y)
{
	this.x = x;
	this.y = y;
};
