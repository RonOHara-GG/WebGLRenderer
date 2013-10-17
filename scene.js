
function FindRenderPass(passName)
{
	for (i = 0; i < this.renderPasses.length; i++)
	{
		if (this.renderPasses[i].name == passName)
			return this.renderPasses[i];
	}

	return null;
}

function FindRenderObject(objName)
{
	for (i = 0; i < this.renderObjects.length; i++)
	{
		if (this.renderObjects[i].name == objName)
			return this.renderObjects[i];
	}

	return null;
}

function Scene(sceneXML)
{
	this.renderPasses = [];
	this.renderObjects = [];

	this.FindRenderPass = FindRenderPass;
	this.FindRenderObject = FindRenderObject;

	childNodes = sceneXML.documentElement.childNodes
	for( i = 0; childNodes.length ; i++ )
	{
		if( childNodes[i].nodeType == 1 )
		{
			if (childNodes[i].nodeName == "renderPass")
			{
				var passName = childNodes[i].attributes.getNamedItem("name");
				var renderPass = this.FindRenderPass(passName)
				if (!renderPass)
				{
					renderPass = new RenderPass(passName, childNodes[i].attributes.getNamedItem("src"));
					renderPasses.push(renderPass);
				}


				renderObjectNodes = childNodes[i].childNodes;
				for (j = 0; j < renderObjects.length; j++)
				{
					if (renderObjectNodes[i].nodeName == "renderObject")
					{
						objName = renderObjectNodes[i].attributes.getNamedItem("name");

						// Try to find this render object if its already loaded
						var renderObj = this.FindRenderObject(objName);
						if (!renderObj)
						{
							// Not loaded, load it now
							renderObj = new RenderObject(objName, renderObjectNodes[i].attributes.getNamedItem("src"));
							renderObjects.push(renderObj);
						}

						// Reference this object in the render pass
						renderPass.renderObjects.push(renderObj);
					}
				}
			}
		}
	}
}