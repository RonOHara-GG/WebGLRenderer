function BindDepthTarget(gl)
{
}

function DepthTarget(scene, name, src)
{
	//this.scene = scene;
	this.name = name;
	this.src = src;

	this.bind = BindDepthTarget

	this.width = 0;
	this.height = 0;
	this.format = "D24S8";

	rtXML = LoadXML(src);
	if (rtXML)
	{
		this.width = parseInt(rtXML.documentElement.attributes.getNamedItem("width").value);
		this.height = parseInt(rtXML.documentElement.attributes.getNamedItem("height").value);
		this.format = rtXML.documentElement.attributes.getNamedItem("format").value;
	}
}