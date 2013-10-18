
function GetRenderPass(passName, src)
{
	for (var i = 0; i < this.renderPasses.length; i++)
	{
		if (this.renderPasses[i].name == passName)
			return this.renderPasses[i];
	}

	// Doesnt exist, load it now
	renderPass = new RenderPass(this, passName, src);
	this.renderPasses.push(renderPass);
	return renderPass;
}

function GetRenderObject(objName, src)
{
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		if (this.renderObjects[i].name == objName)
			return this.renderObjects[i];
	}	

	// Doesnt exist, load it now
	renderObj = new RenderObject(this, objName, src);
	this.renderObjects.push(renderObj);
	return renderObj;
}

function GetViewport(name, src)
{
	for (var i = 0; i < this.viewports.length; i++)
	{
		if( this.viewports[i].name == name )
			return this.viewports[i];
	}

	// Doesnt exist, load it now
	viewport = new Viewport(this, name, src);
	this.viewports.push(viewport);
	return viewport;
}

function GetCamera(name, src)
{
	for (var i = 0; i < this.cameras.length; i++)
	{
		if( this.cameras[i].name == name )
			return this.cameras[i];
	}

	// Doesnt exist, load it now
	camera = new Camera(this, name, src);
	this.cameras.push(camera);
	return camera;
}

function GetRenderTarget(name, src)
{
	for (var i = 0; i < this.renderTargets.length; i++)
	{
		if( this.renderTargets[i].name == name )
			return this.renderTargets[i];
	}

	// Doesnt exist, load it now
	renderTarget = new RenderTarget(this, name, src);
	this.renderTargets.push(renderTarget);
	return renderTarget;
}

function GetDepthTarget(name, src)
{
	for (var i = 0; i < this.depthTargets.length; i++)
	{
		if( this.depthTargets[i].name == name )
			return this.depthTargets[i];
	}

	// Doesnt exist, load it now
	depthTarget = new DepthTarget(this, name, src);
	this.depthTargets.push(depthTarget);
	return depthTarget;
}

function Draw(gl)
{
	for (var i = 0; i < renderPasses.length; i++)
	{
		renderPasses[i].draw(gl);
	}
}

function Scene(sceneXML)
{
	this.renderPasses = [];
	this.renderObjects = [];
	this.viewports = [];
	this.cameras = [];
	this.renderTargets = [];
	this.depthTargets = [];

	this.getRenderPass = GetRenderPass;
	this.getRenderObject = GetRenderObject;
	this.getViewport = GetViewport;
	this.getCamera = GetCamera;
	this.getRenderTarget = GetRenderTarget;
	this.getDepthTarget = GetDepthTarget;
	this.draw = Draw;

	childNodes = sceneXML.documentElement.childNodes
	for (var i = 0; i < childNodes.length; i++)
	{
		if( childNodes[i].nodeType == 1 )
		{
			if (childNodes[i].nodeName == "renderPass")
			{
				var passName = childNodes[i].attributes.getNamedItem("name").value
				var srcFile = childNodes[i].attributes.getNamedItem("src").value
				var renderPass = this.getRenderPass(passName, srcFile)

				renderObjectNodes = childNodes[i].childNodes;
				for (var j = 0; j < renderObjectNodes.length; j++)
				{
					if (renderObjectNodes[j].nodeType == 1)
					{
						if (renderObjectNodes[j].nodeName == "renderObject")
						{
							objName = renderObjectNodes[j].attributes.getNamedItem("name").value;
							objSrc = renderObjectNodes[j].attributes.getNamedItem("src").value;

							// Try to find this render object if its already loaded
							var renderObj = this.getRenderObject(objName, objSrc);

							// Reference this object in the render pass
							renderPass.renderObjects.push(renderObj);
						}
					}
				}
			}
		}
	}
}