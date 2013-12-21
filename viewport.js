function BindViewport(gl)
{
	if( this.percentageMode )
	{
		this.rect[0] = this.left * gl.canvasWidth;
		this.rect[1] = this.top * gl.canvasHeight;
		this.rect[2] = this.width * gl.canvasWidth;
		this.rect[3] = this.height * gl.canvasHeight;
	}
	else
	{
		this.rect[0] = this.left;
		this.rect[1] = this.top;
		this.rect[2] = this.width;
		this.rect[3] = this.height;
	}
	gl.viewport(this.rect[0], this.rect[1], this.rect[2], this.rect[3]);
}

function VPDoAssignment(scene, property, propertyValue)
{
	var result = false;

	switch (property)
	{
		case "name":
			this.name = propertyValue;
			result = true;
			break;
		case "src":
			this.src = propertyValue;
			result = true;
			break;
		case "left":
			this.left = parseFloat(propertyValue);
			result = true;
			break;
		case "top":
			this.top = parseFloat(propertyValue);
			result = true;
			break;
		case "width":
			this.width = parseFloat(propertyValue);
			result = true;
			break;
		case "height":
			this.height = parseFloat(propertyValue);
			result = true;
			break;
		case "percentageMode":
			this.percentageMode = (propertyValue == "true");
			result = true;
			break;
		default:
			console.log("Viewport::doObjectAssignment - unsupported property: " + property);
			break;
	}
}

function Viewport(scene, name, src)
{
	//this.scene = scene;
	this.name = name;
	this.src = src;

	this.bind = BindViewport
	this.save = SaveViewport
	this.toString = VPToString;
	this.doObjectAssignment = VPDoAssignment;

	this.rect = [];

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

function VPToString()
{
	var str = this.name + ";";
	str += this.src + ";";
	str += this.left + ";";
	str += this.top + ";";
	str += this.width + ";";
	str += this.height + ";";
	str += this.percentageMode ? "true" : "false";

	return str;
}

function SaveViewport(path)
{
	var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\n";

	xml += "<viewport name=\"" + this.name + "\" left=\"" + this.left + "\" top=\"" + this.top + "\" width=\"" + this.width + "\" height=\"" + this.height + "\" percentageMode=\"" + this.percentageMode + "\"/>\n";
	SaveFile(path + this.src, xml);
}