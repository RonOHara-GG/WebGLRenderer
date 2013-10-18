function Camera(scene, name, src)
{
	this.scene = scene;
	this.name = name;
	this.src = src;

	this.posX = 0;
	this.posY = 0;
	this.posZ = 0;
	this.lookAtX = 0;
	this.lookAtY = 0;
	this.lookAtZ = 0;
	this.upX = 0;
	this.upY = 0;
	this.upZ = 1.0;

	cameraXML = LoadXML(src);
	if (cameraXML)
	{
		children = cameraXML.documentElement.childNodes;
		for (var i = 0; i < children.length; i++)
		{
			if (children[i].nodeType == 1)
			{
				if (children[i].nodeName == "position")
				{
					this.posX = parseFloat(children[i].attributes.getNamedItem("x").value);
					this.posY = parseFloat(children[i].attributes.getNamedItem("y").value);
					this.posZ = parseFloat(children[i].attributes.getNamedItem("z").value);
				}
				else if (children[i].nodeName == "lookAt")
				{
					this.lookAtX = parseFloat(children[i].attributes.getNamedItem("x").value);
					this.lookAtY = parseFloat(children[i].attributes.getNamedItem("y").value);
					this.lookAtZ = parseFloat(children[i].attributes.getNamedItem("z").value);
				}
			}
		}
	}
}