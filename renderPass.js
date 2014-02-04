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
		if ( this.renderObjects[i].shader && this.renderObjects[i].shader.lightUpdateToken != gl.lightUpdateToken)
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
	if( this.viewport )
		this.viewport.bind(gl);

	// Set camera
	if (this.camera)
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

		if (this.debugDraw && this.renderObjects[i].selected)
		{
			this.renderObjects[i].drawSelected(gl);
		}
	}

	if( this.overrideShader )
		this.overrideShader.unbindOverride(gl);
}

function ParseClearMode()
{
	this.clearColor = (this.clearMode.indexOf("color") >= 0);
	this.clearDepth = (this.clearMode.indexOf("depth") >= 0);
	this.clearStencil = (this.clearMode.indexOf("stencil") >= 0);
}

function ParseClearColor()
{
	var clearColors = this.clearColorValue.csvToArray();
	this.clearColorRed = parseInt(clearColors[0][0]) / 255.0;
	this.clearColorGreen = parseInt(clearColors[0][1]) / 255.0;
	this.clearColorBlue = parseInt(clearColors[0][2]) / 255.0;
}

function RenderPassDoAssignment(scene, property, propertyValue)
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
		case "sortMode":
			this.sortMode = propertyValue;
			result = true;
			break;
		case "clearMode":
			this.clearMode = propertyValue;
			this.parseClearMode();
			result = true;
			break;
		case "clearColor":
			this.clearColorValue = propertyValue;
			this.parseClearColor();
			result = true;
			break;
		case "clearDepth":
			this.clearDepthVal = propertyValue;
			result = true;
			break;
		case "clearStencil":
			this.clearStencilVal = propertyValue;
			result = true;
			break;
		case "viewport":
			var vp = scene.getViewport(propertyValue, null);
			if (vp)
			{
				this.viewport = vp;
				result = true;
			}
			break;
		case "camera":
			var cam = scene.getCamera(propertyValue, null);
			if (cam)
			{
				this.camera = cam;
				result = true;
			}
			break;
		case "frameBuffer":
			var fb = scene.getFrameBuffer(propertyValue, null);
			if (fb)
			{
				this.frameBuffer = fb;
				result = true;
			}
			break;
		case "overrideShader":
			var s = scene.getShader(propertyValue, null);
			if (s)
			{
				this.overrideShader = s;
				result = true;
			}
			break;
		default:
			console.log("RenderPass::doObjectAssignment - unsupported property: " + property);
			break;
	}

	return result;
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
	this.clearMode = "none";
	this.clearColorValue = "0,0,0";
	this.clearColor = false;
	this.clearDepth = false;
	this.clearStencil = false;
	this.clearColorRed = 0;
	this.clearColorGreen = 0;
	this.clearColorBlue = 0;
	this.clearDepthVal = 1;
	this.clearStencilVal = 0;

	this.viewport = null;
	this.camera = null;
	this.frameBuffer = null;

	this.lightsDirty = false;
	this.overrideShader = null;
	this.debugDraw = false;

	this.draw = DrawRenderPass;
	this.clear = DoClear;
	this.updateLights = UpdateLights;
	this.toString = RenderPassToString;
	this.save = SaveRenderPass;
	this.parseClearMode = ParseClearMode;
	this.parseClearColor = ParseClearColor;
	this.doObjectAssignment = RenderPassDoAssignment;

	// Load the source
	if (src)
	{
		rpXML = LoadXML(scene.path + src);
		if (rpXML)
		{
			// Get the attribute properties
			for (var i = 0; i < rpXML.documentElement.attributes.length; i++)
			{
				var attrib = rpXML.documentElement.attributes[i];
				switch (attrib.name)
				{
					case "sortMode":
						this.sortMode = attrib.value;
						break;
					case "clearMode":
						this.clearMode = attrib.value;
						this.parseClearMode();
						break;
					case "clearDepth":
						this.clearDepthVal = attrib.value;
						break;
					case "clearStencil":
						this.clearStencilVal = attrib.value;
						break;
					case "clearColor":
						this.clearColorValue = attrib.value;
						this.parseClearColor();
						break;
					case "debugDraw":
						this.debugDraw = (attrib.value == "true");
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
}

function SaveRenderPass(path)
{
	var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\n";

	xml += "<renderPass name=\"" + this.name + "\" sortMode=\"" + this.sortMode + "\" clearMode=\"" + this.clearMode + "\" clearColor=\"" + this.clearColorValue + "\" clearDepth=\"" + this.clearDepthVal + "\" clearStencil=\"" + this.clearStencilVal + "\" debugDraw=\"" + this.debugDraw + "\">\n";

	if (this.viewport)
	{
		xml += "\t<viewport name=\"" + this.viewport.name + "\" src=\"" + this.viewport.src + "\"/>\n";
	}
	if (this.camera)
	{
		xml += "\t<camera name=\"" + this.camera.name + "\" src=\"" + this.camera.src + "\"/>\n";
	}
	if (this.frameBuffer)
	{
		xml += "\t<frameBuffer name=\"" + this.frameBuffer.name + "\" src=\"" + this.frameBuffer.src + "\"/>\n";
	}
	if (this.overrideShader)
	{
		xml += "\t<overrideShader name=\"" + this.overrideShader.name + "\" src=\"" + this.overrideShader.src + "\"/>\n";
	}

	xml += "</renderPass>";
	SaveFile(path + this.src, xml);
}

function RenderPassToString()
{
	var str = this.name + ";";
	str += this.src + ";";
	str += this.sortMode + ";";	
	str += this.clearMode + ";";
	str += this.clearColorValue + ";";
	str += this.clearDepthVal + ";";
	str += this.clearStencilVal + ";";
	str += (this.viewport ? this.viewport.name : "none")  + ";"; ;
	str += (this.camera ? this.camera.name : "none") + ";"; ;
	str += (this.frameBuffer ? this.frameBuffer.name : "none") + ";"; ;
	str += (this.overrideShader ? this.overrideShader.name : "none") + ";"; ;

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
	
	return str;
}