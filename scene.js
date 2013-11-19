
function GetRenderPass(passName, src)
{
	for (var i = 0; i < this.renderPasses.length; i++)
	{
		if (this.renderPasses[i].name == passName)
			return this.renderPasses[i];
	}

	// Doesnt exist, load it now
	var renderPass = new RenderPass(this, passName, src);
	this.renderPasses.push(renderPass);
	return renderPass;
}

function GetUpdatePass(passName, src)
{
	for (var i = 0; i < this.updatePasses.length; i++)
	{
		if (this.updatePasses[i].name == passName)
			return this.updatePasses[i];
	}

	// Doesnt exist, load it now
	var updatePass = new UpdatePass(this, passName, src);
	this.updatePasses.push(updatePass);
	return updatePass;
}

function GetRenderObject(objName, src)
{
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		if (this.renderObjects[i].name == objName)
			return this.renderObjects[i];
	}	

	// Doesnt exist, load it now
	var renderObj = new RenderObject(this, objName, src);
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
	var viewport = new Viewport(this, name, src);
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
	var camera = new Camera(this, name, src);
	this.cameras.push(camera);
	return camera;
}

function GetFrameBuffer(name, src)
{
	for (var i = 0; i < this.frameBuffers.length; i++)
	{
		if( this.frameBuffers[i].name == name )
			return this.frameBuffers[i];
	}

	if( src )
	{
		// Doesnt exist, load it now
		var frameBuffer = new FrameBuffer(this, name, src);
		this.frameBuffers.push(frameBuffer);
		return frameBuffer;
	}
}

function GetMesh(name, src)
{
	for( var i = 0; i < this.meshes.length; i++ )
	{
		if( this.meshes[i].name == name )
			return this.meshes[i];
	}

	var mesh = new Mesh(this, name, src);
	this.meshes.push(mesh);
	return mesh;
}

function GetShader(name, src)
{
	for (var i = 0; i < this.shaders.length; i++)
	{
		if (this.shaders[i].name == name)
			return this.shaders[i];
	}

	var shader = new Shader(this, name, src);
	this.shaders.push(shader);
	return shader;
}

function GetLight(name, src)
{
	for (var i = 0; i < this.lights.length; i++)
	{
		if (this.lights[i].name == name)
			return this.lights[i];
	}

	var light = new Light(this, name, src);
	this.lights.push(light);
	return light;
}

function GetTexture(name, src)
{
	for (var i = 0; i < this.textures.length; i++)
	{
		if (this.textures[i].name == name)
			return this.textures[i];
	}

	var tex = new Texture(this, name, src);
	this.textures.push(tex);
	return tex;
}

function UpdateScene(deltaTimeMS)
{
	for (var i = 0; i < this.updatePasses.length; i++)
	{
		this.updatePasses[i].update(deltaTimeMS);
	}
}

function Draw(gl)
{
	for (var i = 0; i < this.renderPasses.length; i++)
	{
		this.renderPasses[i].draw(gl, this);
	}
	
	gl.lightsDirty = false;
}

function ResizeScene(width, height)
{
	var ar = width / height;
	for (var i = 0; i < this.cameras.length; i++)
	{
		this.cameras[i].resize(ar);
	}
}

function Scene(sceneXML, gl)
{

	this.renderPasses = [];
	this.updatePasses = [];
	this.renderObjects = [];
	this.viewports = [];
	this.cameras = [];
	this.frameBuffers = [];
	this.meshes = [];
	this.shaders = [];
	this.lights = [];
	this.textures = [];

	this.gl = gl;

	this.getRenderPass = GetRenderPass;
	this.getUpdatePass = GetUpdatePass;
	this.getRenderObject = GetRenderObject;
	this.getViewport = GetViewport;
	this.getCamera = GetCamera;
	this.getFrameBuffer = GetFrameBuffer;
	this.getMesh = GetMesh;
	this.getShader = GetShader;
	this.getLight = GetLight;
	this.getTexture = GetTexture;
	this.draw = Draw;
	this.update = UpdateScene;
	this.resize = ResizeScene;
	this.toString = SceneToString;

	childNodes = sceneXML.documentElement.childNodes
	for (var i = 0; i < childNodes.length; i++)
	{
		if( childNodes[i].nodeType == 1 )
		{
			if (childNodes[i].nodeName == "renderPass" || childNodes[i].nodeName == "updatePass")
			{
				var passName = childNodes[i].attributes.getNamedItem("name").value
				var srcFile = childNodes[i].attributes.getNamedItem("src").value
				
				var thePass;
				if (childNodes[i].nodeName == "renderPass" )
					thePass = this.getRenderPass(passName, srcFile)
				else
					thePass = this.getUpdatePass(passName, srcFile);

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
							thePass.renderObjects.push(renderObj);
						}
						else if (renderObjectNodes[j].nodeName == "light")
						{
							objName = renderObjectNodes[j].attributes.getNamedItem("name").value;
							objSrc = renderObjectNodes[j].attributes.getNamedItem("src").value;

							// Try to find this render object if its already loaded
							var light = this.getLight(objName, objSrc);

							thePass.lights.push(light);
							thePass.lightsDirty = true;
						}
						else if (renderObjectNodes[j].nodeName == "camera")
						{
							objName = renderObjectNodes[j].attributes.getNamedItem("name").value;
							objSrc = renderObjectNodes[j].attributes.getNamedItem("src").value;
							var cam = this.getCamera(objName, objSrc);

							thePass.cameras.push(cam);
						}
					}
				}
			}
		}
	}
}

function SceneToString()
{
	var str;

	str = "";
	for (var i = 0; i < this.updatePasses.length; i++)
	{
		str += this.updatePasses[i].name;
		if (i != this.updatePasses.length - 1)
			str += ","
	}
	str += ";";
	for (var i = 0; i < this.renderPasses.length; i++)
	{
		str += this.renderPasses[i].name;
		if (i != this.renderPasses.length - 1)
			str += ","
	}
	str += ";";
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		str += this.renderObjects[i].name;
		if (i != this.renderObjects.length - 1)
			str += ","
	}
	str += ";";
	for (var i = 0; i < this.viewports.length; i++)
	{
		str += this.viewports[i].name;
		if (i != this.viewports.length - 1)
			str += ","
	}
	str += ";";
	for (var i = 0; i < this.cameras.length; i++)
	{
		str += this.cameras[i].name;
		if (i != this.cameras.length - 1)
			str += ","
	}
	str += ";";
	for (var i = 0; i < this.frameBuffers.length; i++)
	{
		str += this.frameBuffers[i].name;
		if (i != this.frameBuffers.length - 1)
			str += ","
	}
	str += ";";
	for (var i = 0; i < this.meshes.length; i++)
	{
		str += this.meshes[i].name;
		if (i != this.meshes.length - 1)
			str += ","
	}
	str += ";";
	for (var i = 0; i < this.shaders.length; i++)
	{
		str += this.shaders[i].name;
		if (i != this.shaders.length - 1)
			str += ","
	}
	str += ";";
	for (var i = 0; i < this.lights.length; i++)
	{
		str += this.lights[i].name;
		if (i != this.lights.length - 1)
			str += ","
	}
	str += ";";
	for (var i = 0; i < this.textures.length; i++)
	{
		str += this.textures[i].name;
		if (i != this.textures.length - 1)
			str += ","
	}

	return str;
}