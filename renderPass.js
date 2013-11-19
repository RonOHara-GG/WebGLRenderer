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

function UpdateLights(scene)
{
	gl.lightUpdateToken++;
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		if (this.renderObjects[i].shader.lightUpdateToken != gl.lightUpdateToken)
		{
			this.renderObjects[i].shader.lightUpdateToken = gl.lightUpdateToken;
			this.renderObjects[i].shader.lightCount = 0;
			this.renderObjects[i].shader.bind(scene.gl);
			for (var j = 0; j < this.lights.length; j++)
			{
				this.renderObjects[i].shader.addLight(this.lights[j], scene);
			}
		}
	}
	this.lightsDirty = false;
}

function DrawRenderPass(gl, scene)
{
	if (this.lightsDirty)
		this.updateLights(scene);

	// Bind render target
	if( this.frameBuffer )
		this.frameBuffer.bind(gl);
	else
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	// Set viewport
	this.viewport.bind(gl);

	// Set camera
	this.camera.bind(gl);

	// Clear
	this.clear(gl);
	
	// Bind override shader
	if( this.overrideShader )
		this.overrideShader.bindOverride(gl);

	// Draw objects
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		this.renderObjects[i].draw(gl);
	}

	if( this.overrideShader )
		this.overrideShader.unbindOverride(gl);
}

function RenderPass(scene, name, src)
{
	this.renderObjects = [];
	this.lights = [];

	//this.scene = scene;
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
	this.frameBuffer = null;

	this.lightsDirty = false;

	this.draw = DrawRenderPass
	this.clear = DoClear
	this.updateLights = UpdateLights;
	this.overrideShader = null;

	// Load the source
	rpXML = LoadXML(src);
	if (rpXML)
	{
		// Get the attribute properties
		for( var i = 0; i < rpXML.documentElement.attributes.length; i++ )
		{
			var attrib = rpXML.documentElement.attributes[i];
			switch( attrib.name )
			{
				case "sortMode":
					this.sortMode = attrib.value;
					break;
				case "clearMode":
					var clearMode = attrib.value;
					this.clearColor = (clearMode.indexOf("color") >= 0);
					this.clearDepth = (clearMode.indexOf("depth") >= 0);
					this.clearStencil = (clearMode.indexOf("stencil") >= 0);
					break;
				case "clearDepth":
					this.clearDepth = attrib.value;
					break;
				case "clearStencil":
					this.clearStencil = attrib.value;
					break;
				case "clearColor":
					var clearColors = attrib.value.csvToArray();
					this.clearColorRed = parseInt(clearColors[0][0]) / 255.0;
					this.clearColorGreen = parseInt(clearColors[0][1]) / 255.0;
					this.clearColorBlue = parseInt(clearColors[0][2]) / 255.0;
					break;
				default:
					break;
			}
		}

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
				else if (childElements[i].nodeName == "frameBuffer")
				{
					this.frameBuffer = scene.getFrameBuffer(objName, objSrc);
				}
				else if (childElements[i].nodeName == "overrideShader")
				{
					this.overrideShader = scene.getShader(objName, objSrc);
				}
			}
		}
	}
}