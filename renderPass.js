function RenderPass(scene, name, src)
{
	this.renderObjects = [];

	this.scene = scene;
	this.name = name;
	this.src = src;

	// Set defaults
	this.sortMode = "none";
	this.clearMode = "none";
	this.clearColorRed = 0;
	this.clearColorGreen = 0;
	this.clearColorBlue = 0;
	this.clearDepth = 1;
	this.clearStencil = 0;

	this.viewport = null;
	this.camera = null;
	this.renderTarget = null;
	this.depthTarget = null;

	// Load the source
	rpXML = LoadXML(src);
	if (rpXML)
	{
		// Get the attribute properties
		this.sortMode = rpXML.documentElement.attributes.getNamedItem("sortMode");
		this.clearMode = rpXML.documentElement.attributes.getNamedItem("clearMode");
		this.clearDepth = rpXML.documentElement.attributes.getNamedItem("clearDepth");
		this.clearStencil = rpXML.documentElement.attributes.getNamedItem("clearStencil");
		clearColor = rpXML.documentElement.attributes.getNamedItem("clearColor");
		clearColors = clearColor.csvToArray;
		this.clearColorRed = parseInt(clearColors[0]);
		this.clearColorGreen = parseInt(clearColors[1]);
		this.clearColorBlue = parseInt(clearColors[2]);

		childElements = rpXML.documentElement.childNodes;
		for( i = 0; i < childElements.length; i++ )
		{
			objName = childElements[i].attributes.getNamedItem("name");
			objSrc = childElements[i].attributes.getNamedItem("src");
			if( childElements[i].nodeName == "viewport" )
			{
				this.viewport = scene.getViewport(objName, objSrc);
			}
			else if( childElements[i].nodeName == "camera" )
			{
				this.camera = scene.getCamera(objName, objSrc);
			}
			else if( childElements[i].nodeName == "renderTarget" )
			{
				this.renderTarget = scene.getRenderTarget(objName, objSrc);
			}
			else if( childElements[i].nodeName == "depthTarget" )
			{
				this.depthTarget = scene.getDepthTarget(objName, objSrc);
			}
		}
	}
}