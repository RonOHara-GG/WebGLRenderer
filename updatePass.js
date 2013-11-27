
function DoUpdatePass(deltaTimeMS)
{
	// Update cameras
	for( var i = 0; i < this.cameras.length; i++ )
	{
		this.cameras[i].update(deltaTimeMS);
	}

	// Update render objects
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		this.renderObjects[i].update(deltaTimeMS);
	}
	
	// Update all lights
	for( var i = 0; i < this.lights.length; i++ )
	{
		this.lights[i].update(deltaTimeMS);
	}
}

function UpdatePass(scene, name, src)
{
	this.renderObjects = [];
	this.lights = [];
	this.cameras = [];

	//this.scene = scene;
	this.name = name;
	this.src = src;


	this.update = DoUpdatePass;
	this.toString = UpdatePassToString;
	this.save = SaveUpdatePass;
}

function SaveUpdatePass(path)
{
	var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\n";

	xml += "<updatePass name=\"" + this.name + "\">\n";

	xml += "</updatePass>";

	SaveFile(path + this.src, xml);
}

function UpdatePassToString()
{
	var str = this.name + ";";
	str += this.src + ";";

	for (var i = 0; i < this.renderObjects.length; i++)
	{
		str += this.renderObjects[i].name;
		if (i < (this.renderObjects.length - 1))
			str += ",";
	}
	str += ";";

	for (var i = 0; i < this.lights.length; i++)
	{
		str += this.lights[i].name;
		if (i < (this.lights.length - 1))
			str += ",";
	}
	str += ";";

	for (var i = 0; i < this.cameras.length; i++)
	{
		str += this.cameras[i].name;
		if (i < (this.cameras.length - 1))
			str += ",";
	}

	return str;
}