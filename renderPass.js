function DoClear(gl)
{
	var clearBits = 0;
	if (this.clearColor)
	{
		// Set the clear color
		gl.clearColor(this.clearColorRed, this.clearColorGreen, this.clearColorBlue, 1.0);
		clearBits |= gl.COLOR_BUFFER_BIT;
	}
	if (this.clearDepth)
		clearBits |= gl.DEPTH_BUFFER_BIT;
	if (this.clearStencil)
		clearBits |= gl.STENCIL_BUFFER_BIT;

	// do the clear
	if( clearBits )
		gl.clear(clearBits);
}

function UpdateLights()
{
	this.lightUpdateToken++;
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		if (this.renderObjects[i].shader.lightUpdateToken != this.lightUpdateToken)
		{
			this.renderObjects[i].shader.lightUpdateToken = this.lightUpdateToken;
			this.renderObjects[i].shader.lightCount = 0;
			this.renderObjects[i].shader.bind(this.scene.gl);
			for (var j = 0; j < this.lights.length; j++)
			{
				this.renderObjects[i].shader.addLight(this.lights[j]);
			}
		}
	}
	this.lightsDirty = false;
}

function UpdateRenderPass(deltaTimeMS)
{
	if (this.lightsDirty)
		this.updateLights();

	// Update camera
	this.camera.update(deltaTimeMS);

	// Update render objects
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		this.renderObjects[i].update(deltaTimeMS);
	}
}

function DrawRenderPass(gl)
{
	// Bind render target
	if( this.renderTarget )
		this.renderTarget.bind(gl);

	// Bind depth target
	if( this.depthTarget )
		this.depthTarget.bind(gl);

	// Set viewport
	this.viewport.bind(gl);

	// Set camera
	this.camera.bind(gl);

	// Clear
	this.clear(gl);

	// Draw objects
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		this.renderObjects[i].draw(gl);
	}
}

function RenderPass(scene, name, src)
{
	this.renderObjects = [];
	this.lights = [];

	this.scene = scene;
	this.name = name;
	this.src = src;

	// Set defaults
	this.sortMode = "none";
	this.clearColor = false;
	this.clearDepth = false;
	this.clearStencil = false;
	this.clearColorRed = 0;
	this.clearColorGreen = 0;
	this.clearColorBlue = 0;
	this.clearDepth = 1;
	this.clearStencil = 0;

	this.viewport = null;
	this.camera = null;
	this.renderTarget = null;
	this.depthTarget = null;

	this.lightUpdateToken = 0;
	this.lightsDirty = false;

	this.update = UpdateRenderPass
	this.draw = DrawRenderPass
	this.clear = DoClear
	this.updateLights = UpdateLights;

	// Load the source
	rpXML = LoadXML(src);
	if (rpXML)
	{
		// Get the attribute properties
		this.sortMode = rpXML.documentElement.attributes.getNamedItem("sortMode").value;
		var clearMode = rpXML.documentElement.attributes.getNamedItem("clearMode").value;
		this.clearColor = (clearMode.indexOf("color") >= 0);
		this.clearDepth = (clearMode.indexOf("depth") >= 0);
		this.clearStencil = (clearMode.indexOf("stencil") >= 0);

		this.clearDepth = rpXML.documentElement.attributes.getNamedItem("clearDepth").value;
		this.clearStencil = rpXML.documentElement.attributes.getNamedItem("clearStencil").value;
		var clearColor = rpXML.documentElement.attributes.getNamedItem("clearColor").value;
		var clearColors = clearColor.csvToArray();
		this.clearColorRed = parseInt(clearColors[0][0]) / 255.0;
		this.clearColorGreen = parseInt(clearColors[0][1]) / 255.0;
		this.clearColorBlue = parseInt(clearColors[0][2]) / 255.0;

		childElements = rpXML.documentElement.childNodes;
		for (var i = 0; i < childElements.length; i++)
		{
			if (childElements[i].nodeType == 1)
			{
				objName = childElements[i].attributes.getNamedItem("name").value;
				objSrc = childElements[i].attributes.getNamedItem("src").value;
				if (childElements[i].nodeName == "viewport")
				{
					this.viewport = scene.getViewport(objName, objSrc);
				}
				else if (childElements[i].nodeName == "camera")
				{
					this.camera = scene.getCamera(objName, objSrc);
				}
				else if (childElements[i].nodeName == "renderTarget")
				{
					this.renderTarget = scene.getRenderTarget(objName, objSrc);
				}
				else if (childElements[i].nodeName == "depthTarget")
				{
					this.depthTarget = scene.getDepthTarget(objName, objSrc);
				}
			}
		}
	}
}