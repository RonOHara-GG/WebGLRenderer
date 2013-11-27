function BindViewport(gl)
{
	if( this.percentageMode )
	{
		var tempLeft = this.left * gl.canvasWidth;
		var tempTop = this.top * gl.canvasHeight;
		var tempWidth = this.width * gl.canvasWidth;
		var tempHeight = this.height * gl.canvasHeight;
		gl.viewport(tempLeft, tempTop, tempWidth, tempHeight);
	}
	else
	{
		gl.viewport(this.left, this.top, this.width, this.height);
	}
}

function Viewport(scene, name, src)
{
	//this.scene = scene;
	this.name = name;
	this.src = src;

	this.bind = BindViewport
	this.save = SaveViewport

	this.left = 0;
	this.top = 0;
	this.width = 1;
	this.height = 1;
	this.percentageMode = true;

	// load the xml
	viewportXML = LoadXML(src);
	if (viewportXML)
	{
		this.left = parseFloat(viewportXML.documentElement.attributes.getNamedItem("left").value);
		this.top = parseFloat(viewportXML.documentElement.attributes.getNamedItem("top").value);
		this.width = parseFloat(viewportXML.documentElement.attributes.getNamedItem("width").value);
		this.height = parseFloat(viewportXML.documentElement.attributes.getNamedItem("height").value);
		this.percentageMode = viewportXML.documentElement.attributes.getNamedItem("percentageMode").value === "true";
	}
}

function SaveViewport(path)
{
	var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\n";

	xml += "<viewport name=\"" + this.name + "\" left=\"" + this.left + "\" top=\"" + this.top + "\" width=\"" + this.width + "\" height=\"" + this.height + "\" percentageMode=\"" + this.percentageMode + "\"/>\n";
	SaveFile(path + this.src, xml);
}