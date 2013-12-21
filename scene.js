
function GetRenderPass(passName, src)
{
	for (var i = 0; i < this.renderPasses.length; i++)
	{
		if (this.renderPasses[i].name == passName)
			return this.renderPasses[i];
	}

	// Doesnt exist, load it now
	if (src)
	{
		if (src == "create") src = null;
		var renderPass = new RenderPass(this, passName, src);
		this.renderPasses.push(renderPass);
		return renderPass;
	}
	return null;
}

function GetUpdatePass(passName, src)
{
	for (var i = 0; i < this.updatePasses.length; i++)
	{
		if (this.updatePasses[i].name == passName)
			return this.updatePasses[i];
	}

	// Doesnt exist, load it now
	if (src)
	{
		if (src == "create") src = null;
		var updatePass = new UpdatePass(this, passName, src);
		this.updatePasses.push(updatePass);
		return updatePass;
	}
	return null;
}

function GetRenderObject(objName, src)
{
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		if (this.renderObjects[i].name == objName)
			return this.renderObjects[i];
	}	

	// Doesnt exist, load it now
	if (src)
	{
		if (src == "create") src = null;
		var renderObj = new RenderObject(this, objName, src);
		this.renderObjects.push(renderObj);
		return renderObj;
	}
	return null;
}

function GetViewport(name, src)
{
	for (var i = 0; i < this.viewports.length; i++)
	{
		if( this.viewports[i].name == name )
			return this.viewports[i];
	}

	// Doesnt exist, load it now
	if (src)
	{
		if (src == "create") src = null;
		var viewport = new Viewport(this, name, src);
		this.viewports.push(viewport);
		return viewport;
	}
	return null;
}

function GetCamera(name, src)
{
	for (var i = 0; i < this.cameras.length; i++)
	{
		if( this.cameras[i].name == name )
			return this.cameras[i];
	}

	// Doesnt exist, load it now
	if (src)
	{
		if (src == "create") src = null;
		var camera = new Camera(this, name, src);
		this.cameras.push(camera);
		return camera;
	}
	return null;
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
		if (src == "create") src = null;
		var frameBuffer = new FrameBuffer(this, name, src);
		this.frameBuffers.push(frameBuffer);
		return frameBuffer;
	}
	return null;
}

function GetMesh(name, src)
{
	for( var i = 0; i < this.meshes.length; i++ )
	{
		if( this.meshes[i].name == name )
			return this.meshes[i];
	}

	if (src)
	{
		if (src == "create") src = null;
		var mesh = new Mesh(this, name, src);
		this.meshes.push(mesh);
		return mesh;
	}
	else
	{
		return null;
	}
}

function GetShader(name, src)
{
	for (var i = 0; i < this.shaders.length; i++)
	{
		if (this.shaders[i].name == name)
			return this.shaders[i];
	}

	if (src)
	{
		if (src == "create") src = null;
		var shader = new Shader(this, name, src);
		this.shaders.push(shader);
		return shader;
	}
	return null;
}

function GetLight(name, src)
{
	for (var i = 0; i < this.lights.length; i++)
	{
		if (this.lights[i].name == name)
			return this.lights[i];
	}

	if (src)
	{
		if (src == "create") src = null;
		var light = new Light(this, name, src);
		this.lights.push(light);
		return light;
	}
	return null;
}

function GetTexture(name, src)
{
	for (var i = 0; i < this.textures.length; i++)
	{
		if (this.textures[i].name == name)
			return this.textures[i];
	}

	if (src)
	{
		if (src == "create") src = null;
		var tex = new Texture(this, name, src);
		this.textures.push(tex);
		return tex;
	}
	return null;
}

function ImportFile(filename)
{
	var object = null;
	xml = LoadXML(filename);
	if (xml)
	{
		var name = xml.documentElement.attributes.getNamedItem("name").value;
		switch (xml.documentElement.nodeName)
		{
			case "mesh":
				object = this.getMesh(name, filename);
				break;
			case "renderobject":
				object = this.getRenderObject(name, filename);
				break;
			default:
				console.log("Unsupported file type: " + xml.documentElement.nodeName);
				break;
		}
		if (object)
		{
			var localName = "./" + filename.replace(/^.*[\\\/]/, '');
			object.src = localName;
		}
	}

	return object;
}

function FindSceneObject(objectName, objectType)
{
	var obj = null;
	switch (objectType)
	{
		case "renderObject":
			obj = this.getRenderObject(objectName, null);
			break;
		case "renderPass":
			obj = this.getRenderPass(objectName, null);
			break;
		case "updatePass":
			obj = this.getUpdatePass(objectName, null);
			break;
		case "viewport":
			obj = this.getViewport(objectName, null);
			break;
		case "camera":
			obj = this.getCamera(objectName, null);
			break;
		case "frameBuffer":
			obj = this.getFrameBuffer(objectName, null);
			break;
		case "shader":
			obj = this.getShader(objectName, null);
			break;
		case "light":
			obj = this.getLight(objectName, null);
			break;
		case "texture":
			obj = this.getTexture(objectName, null);
			break;
		default:
			console.log("Unsupported objectType given to FindSceneObject: " + objectType);
			break;
	}
	return obj;
}

function DoObjectAssignment(objectName, objectType, property, propertyValue)
{
	var result = false;
	console.log("scene.doObjectAssignment(" + objectName + ", " + objectType + ", " + property + ", " + propertyValue + ")");

	// Find the object
	var object = this.findObject(objectName, objectType);
	if (object)
	{
		result = object.doObjectAssignment(this, property, propertyValue);
	}

	console.log("DoObjectAssignment(" + objectName + ", " + objectType + ", " + property + ", " + propertyValue + ") - result: " + result);
	return result;
}

function AddToPass(passType, passName, objectType, objectName)
{
	var result = false;
	var pass = null;
	switch (passType)
	{
		case "updatePass":
			pass = this.getUpdatePass(passName, null);
			break;
		case "renderPass":
			pass = this.getRenderPass(passName, null);
			break;
		default:
			console.log("AddToPass - unsupported pass type: " + passType);
			break;
	}

	if (pass)
	{
		var object = this.findObject(objectName, objectType);
		if (object)
		{
			switch (objectType)
			{
				case "renderObject":
					pass.renderObjects.push(object);
					result = true;
					break;
				case "camera":
					pass.cameras.push(object);
					result = true;
					break;
				case "light":
					pass.lights.push(object);
					pass.lightsDirty = true;
					result = true;
					break;
				default:
					console.log("AddToPass unsupported object type: " + objectType);
					break;
			}
		}
	}

	return result;
}

function SelectObject(objectName, objectType)
{
	var result = false;
	if (this.selectedObject)
	{
		// Deselect the current object
		this.selectedObject.setSelected(false);
		this.selectedObject = null;
	}

	// Find the object
	var obj = this.findObject(objectName, objectType);
	if (obj)
	{
		this.selectedObject = obj;
		this.selectedObject.setSelected(true);
	}

	return result;
}

function UnprojPoint(point, iproj, iview)
{
	var pt = vec4.create();
	vec4.transformMat4(pt, point, iproj);
	vec4.transformMat4(pt, pt, iview);

	var world = vec3.fromValues(pt[0] / pt[3], pt[1] / pt[3], pt[2] / pt[3]);

	return world;
}

function DistSortRenderObjects(dists, objs)
{
	var sorted = [];

	while( 1 )
	{
		var nearest = objs.length;
		var nearestval = 1.1;

		for (var j = 0; j < objs.length; j++)
		{
			if (dists[j] < nearestval)
			{
				nearestval = dists[j];
				nearest = j;
			}
		}

		if (nearest != objs.length)
		{
			sorted.push(objs[nearest]);
			dists[nearest] = 2;
		}
		else
		{
			break;
		}
	}

	return sorted;
}

function PickSceneObjects(x, y)
{
	var ret = "";

	var invProj = mat4.create();
	var invView = mat4.create();
	var hitObjects = [];
	var hitDistances = [];

	for( var i = 0; i < this.renderPasses.length; i++ )
	{
		var rp = this.renderPasses[i];
		if (!rp.frameBuffer)
		{
			rp.viewport.bind(this.gl);
			rp.camera.bind(this.gl);
			mat4.invert(invProj, this.gl.proj);
			mat4.invert(invView, this.gl.view);

			var rect = rp.viewport.rect;
			var projX = (x - rect[0]) / rect[2];
			var projY = 1.0 - ((y - rect[1]) / rect[3]);

			projX = (projX * 2) - 1;
			projY = (projY * 2) - 1;

			var worldPointA = UnprojPoint(vec4.fromValues(projX, projY, -1, 1), invProj, invView);
			var worldPointB = UnprojPoint(vec4.fromValues(projX, projY, 1, 1), invProj, invView);

			for (var j = 0; j < rp.renderObjects.length; j++)
			{
				var dist = rp.renderObjects[j].lineTest(worldPointA, worldPointB);
				if (dist > 0 && dist < 1)
				{
					hitObjects.push(rp.renderObjects[j]);
					hitDistances.push(dist);
				}
			}
		}
	}

	if (hitObjects.length > 0)
	{
		var sorted = DistSortRenderObjects(hitDistances, hitObjects);
		for (var i = 0; i < sorted.length; i++)
		{
			ret += sorted[i].name;
			if ((i + 1) < sorted.length)
				ret += ",";
		}
	}
	else
	{
		ret = "none";
	}

	return ret;
}

function GetDragAxes(x, y, freeMode)
{
	var ret = "";

	// Get all the selected objects
	var selected = [];
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		if (this.renderObjects[i].selected)
			selected.push(this.renderObjects[i]);
	}

	if (selected.length > 0)
	{
		for (var i = 0; i < selected.length; i++)
		{
			ret += selected[i].name;
			if (i < (selected.length - 1))
				ret += ",";
		}
		ret += ";";

		// Get pick axes
		if (freeMode)
		{
			for (var i = 0; i < this.renderPasses.length; i++)
			{
				var rp = this.renderPasses[i];
				if (!rp.frameBuffer)
				{
					var u = vec3.fromValues(rp.camera.view[1], rp.camera.view[5], rp.camera.view[9]);
					var r = vec3.fromValues(rp.camera.view[0], rp.camera.view[4], rp.camera.view[8]);
					ret += r[0] + "," + r[1] + "," + r[2] + "," + -u[0] + "," + -u[1] + "," + -u[2];
					break;
				}
			}
		}
		else
		{
			var pickAxes = null;
			var invProj = mat4.create();
			var invView = mat4.create();
			for (var i = 0; i < this.renderPasses.length; i++)
			{
				var rp = this.renderPasses[i];
				if (!rp.frameBuffer)
				{
					rp.viewport.bind(this.gl);
					rp.camera.bind(this.gl);
					mat4.invert(invProj, this.gl.proj);
					mat4.invert(invView, this.gl.view);

					var rect = rp.viewport.rect;
					var projX = (x - rect[0]) / rect[2];
					var projY = 1.0 - ((y - rect[1]) / rect[3]);

					projX = (projX * 2) - 1;
					projY = (projY * 2) - 1;

					var worldPointA = UnprojPoint(vec4.fromValues(projX, projY, -1, 1), invProj, invView);
					var worldPointB = UnprojPoint(vec4.fromValues(projX, projY, 1, 1), invProj, invView);
					var dir = vec3.create();
					vec3.sub(dir, worldPointB, worldPointA);
					vec3.normalize(dir, dir);

					for (var j = 0; j < rp.renderObjects.length; j++)
					{
						var ro = rp.renderObjects[j];
						if (ro.selected)
						{
							pickAxes = ro.getDragAxis(worldPointA, dir);
							break;
						}
					}
					if (pickAxes)
					{
						console.log("pickAxes: " + pickAxes);
						var cup = vec3.fromValues(rp.camera.view[1], rp.camera.view[5], rp.camera.view[9]);
						var cright = vec3.fromValues(rp.camera.view[0], rp.camera.view[4], rp.camera.view[8]);
						var view = mat3.create();
						mat3.fromMat4(view, rp.camera.view);
						switch (pickAxes)
						{
							case "xy":
								var vx = vec3.fromValues(1, 0, 0);
								var vy = vec3.fromValues(0, 1, 0);
								vec3.transformMat3(vx, vx, view);
								vec3.transformMat3(vy, vy, view);
								var rdot = vec3.dot(vx, cright);
								var udot = vec3.dot(vx, cup);
								var yudot = vec3.dot(vy, cup);
								var xval;
								var yval;
								if (Math.abs(rdot) > Math.abs(udot))
								{
									// x = left/right
									if (rdot < 0)
										xval = vec3.fromValues(1, 0, 0);
									else
										xval = vec3.fromValues(-1, 0, 0);

									if (yudot < 0)
										yval = vec3.fromValues(0, -1, 0);
									else
										yval = vec3.fromValues(0, 1, 0);
								}
								else
								{
									// x = up/down
									if (udot < 0)
										xval = vec3.fromValues(0, -1, 0);
									else
										xval = vec3.fromValues(0, 1, 0);

									if (yudot < 0)
										yval = vec3.fromValues(-1, 0, 0);
									else
										yval = vec3.fromValues(1, 0, 0);
								}
								ret += xval[0] + "," + xval[1] + "," + xval[2] + "," + yval[0] + "," + yval[1] + "," + yval[2];
								break;
							case "xz":
								var vx = vec3.fromValues(1, 0, 0);
								var vz = vec3.fromValues(0, 0, 1);
								vec3.transformMat3(vx, vx, view);
								vec3.transformMat3(vz, vz, view);
								var rdot = vec3.dot(vx, cright);
								var udot = vec3.dot(vx, cup);
								var zudot = vec3.dot(vz, cup);
								var xval;
								var yval;
								if (Math.abs(rdot) > Math.abs(udot))
								{
									// x = left/right
									if (rdot < 0)
										xval = vec3.fromValues(1, 0, 0);
									else
										xval = vec3.fromValues(-1, 0, 0);

									if (zudot < 0)
										yval = vec3.fromValues(0, 0, 1);
									else
										yval = vec3.fromValues(0, 0, -1);
								}
								else
								{
									// x = up/down
									if (udot < 0)
										xval = vec3.fromValues(0, -1, 0);
									else
										xval = vec3.fromValues(0, 1, 0);

									if (zudot < 0)
										yval = vec3.fromValues(-1, 0, 0);
									else
										yval = vec3.fromValues(1, 0, 0);
								}
								ret += xval[0] + "," + xval[1] + "," + xval[2] + "," + yval[0] + "," + yval[1] + "," + yval[2];
								break;
							case "yz":
								var vy = vec3.fromValues(0, 1, 0);
								var vz = vec3.fromValues(0, 0, 1);
								vec3.transformMat3(vy, vy, view);
								vec3.transformMat3(vz, vz, view);
								var rdot = vec3.dot(vy, cright);
								var udot = vec3.dot(vy, cup);
								var zudot = vec3.dot(vz, cup);
								var xval;
								var yval;
								if (Math.abs(rdot) > Math.abs(udot))
								{
									// y = left/right
									if (rdot < 0)
										xval = vec3.fromValues(0, 1, 0);
									else
										xval = vec3.fromValues(0, -1, 0);

									if (zudot < 0)
										yval = vec3.fromValues(0, 0, 1);
									else
										yval = vec3.fromValues(0, 0, -1);
								}
								else
								{
									// y = up/down
									if (udot < 0)
										xval = vec3.fromValues(0, -1, 0);
									else
										xval = vec3.fromValues(0, 1, 0);

									if (zudot < 0)
										yval = vec3.fromValues(-1, 0, 0);
									else
										yval = vec3.fromValues(1, 0, 0);
								}
								ret += xval[0] + "," + xval[1] + "," + xval[2] + "," + yval[0] + "," + yval[1] + "," + yval[2];
								break;
							case "none":
							default:
								ret = "none";
								break;
						}
						break;
					}
				}
			}
		}

		//ret += "-1,0,0,0,1,0";
	}
	else
	{
		ret = "none";
	}

	return ret;
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

function Scene(sceneXMLFile, gl)
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

	this.selectedObject = null;

	this.gl = gl;
	this.src = sceneXMLFile;

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
	this.importFile = ImportFile;
	this.doObjectAssignment = DoObjectAssignment;
	this.addToPass = AddToPass;
	this.findObject = FindSceneObject;
	this.draw = Draw;
	this.update = UpdateScene;
	this.resize = ResizeScene;
	this.toString = SceneToString;
	this.save = DoSaveScene;
	this.selectObject = SelectObject;
	this.pickObjects = PickSceneObjects;
	this.getDragAxes = GetDragAxes;

	var sceneXML = LoadXML(sceneXMLFile);
	if (sceneXML)
	{
		childNodes = sceneXML.documentElement.childNodes
		for (var i = 0; i < childNodes.length; i++)
		{
			if (childNodes[i].nodeType == 1)
			{
				if (childNodes[i].nodeName == "renderPass" || childNodes[i].nodeName == "updatePass")
				{
					var passName = childNodes[i].attributes.getNamedItem("name").value
					var srcFile = childNodes[i].attributes.getNamedItem("src").value

					var thePass;
					if (childNodes[i].nodeName == "renderPass")
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
}

function DoSaveScene(path)
{
	var lastChar = path[path.length - 1];
	if (lastChar != '/' && lastChar != '\\')
		path += "\\";

	var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\n";

	xml += "<scene>\n";
	for (var i = 0; i < this.updatePasses.length; i++)
	{
		var pass = this.updatePasses[i];
		xml += "\t<updatePass name=\"" + pass.name + "\" src=\"" + pass.src + "\">\n";
		for (var j = 0; j < pass.renderObjects.length; j++)
		{
			var ro = pass.renderObjects[j];
			xml += "\t\t<renderObject name=\"" + ro.name + "\" src=\"" + ro.src + "\"/>\n";
		}
		for (var j = 0; j < pass.lights.length; j++)
		{
			var light = pass.lights[j];
			xml += "\t\t<light name=\"" + light.name + "\" src=\"" + light.src + "\"/>\n";
		}
		for (var j = 0; j < pass.cameras.length; j++)
		{
			var cam = pass.cameras[j];
			xml += "\t\t<camera name=\"" + cam.name + "\" src=\"" + cam.src + "\"/>\n";
		}
		xml += "\t</updatePass>\n";
	}

	for (var i = 0; i < this.renderPasses.length; i++)
	{
		var pass = this.renderPasses[i];
		xml += "\t<renderPass name=\"" + pass.name + "\" src=\"" + pass.src + "\">\n";
		for (var j = 0; j < pass.renderObjects.length; j++)
		{
			var ro = pass.renderObjects[j];
			xml += "\t\t<renderObject name=\"" + ro.name + "\" src=\"" + ro.src + "\"/>\n";
		}
		for (var j = 0; j < pass.lights.length; j++)
		{
			var light = pass.lights[j];
			xml += "\t\t<light name=\"" + light.name + "\" src=\"" + light.src + "\"/>\n";
		}
		xml += "\t</renderPass>\n";
	}

	xml += "</scene>";

	var srcFile;
	if (this.src)
	{
		var idx = this.src.lastIndexOf("\\");
		if (idx < 0)
			idx = this.src.lastIndexOf("/");
		srcFile = this.src.substring(idx);
	}
	else
		srcFile = "scene.xml";
	SaveFile(path + srcFile, xml);

	for (var i = 0; i < this.renderPasses.length; i++)
	{
		this.renderPasses[i].save(path);
	}
	for (var i = 0; i < this.updatePasses.length; i++)
	{
		this.updatePasses[i].save(path);
	}
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		this.renderObjects[i].save(path);
	}
	for (var i = 0; i < this.viewports.length; i++)
	{
		this.viewports[i].save(path);
	}
	for (var i = 0; i < this.cameras.length; i++)
	{
		this.cameras[i].save(path);
	}
	for (var i = 0; i < this.frameBuffers.length; i++)
	{
		this.frameBuffers[i].save(path);
	}
	for (var i = 0; i < this.meshes.length; i++)
	{
		this.meshes[i].save(path);
	}
	for (var i = 0; i < this.shaders.length; i++)
	{
		this.shaders[i].save(path);
	}
	for (var i = 0; i < this.lights.length; i++)
	{
		this.lights[i].save(path);
	}
	for (var i = 0; i < this.textures.length; i++)
	{
		this.textures[i].save(path);
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