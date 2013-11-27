function UpdateRenderObject(deltaTimeMS)
{
	if (this.updateCallback)
	{
		this.updateCallback(deltaTimeMS);
	}
}

function DrawSelectedRenderObject(gl)
{
	var corners = [];
}

function DrawRenderObject(gl)
{
	// Bind shader
	this.shader.bind(gl);

	// Update shader params
	if( gl.uMVP )
	{
		var mvp = mat4.create();
		mat4.mul(mvp, gl.viewProj, this.worldMatrix);
		gl.uniformMatrix4fv(gl.uMVP, false, mvp);
	}

	if( gl.uWorldMtx )
	{
		gl.uniformMatrix4fv(gl.uWorldMtx, false, this.worldMatrix);
	}
	
	if( gl.uNrmMtx )
	{
		var nrm = mat3.create();
		mat3.fromMat4(nrm, this.worldMatrix);
		gl.uniformMatrix3fv(gl.uNrmMtx, false, nrm);
	}

	if( this.shadowCamera && gl.uShadowMtx )
	{
		gl.uniformMatrix4fv(gl.uShadowMtx, false, this.shadowCamera.shadowMatrix);
	}

	// Bind Textures
	for( var i = 0; i < this.textures.length; i++ )
	{
		if( this.textures[i] )
		{
			this.textures[i].bind(gl, i);
		}
	}

	// Draw mesh
	if (this.mesh)
	{
		this.mesh.draw(gl);
	}
}

function ROUpdateWorldMatrix()
{
	mat4.fromRotationTranslation(this.worldMatrix, this.rot, this.pos);
	mat4.scale(this.worldMatrix, this.worldMatrix, this.scale);
}

function ROToString()
{
	var str = "";

	str += "renderObject;";
	str += this.name + ";";
	str += this.src + ";";
	str += this.posString() + ";";
	str += this.rotString() + ";";
	str += this.scaleString() + ";";
	str += this.updateFunctionName + ";";
	str += (this.shader ? this.shader.name : "none") + ";";
	str += (this.mesh ? this.mesh.name : "none") + ";";

	for (var i = 0; i < this.textures.length; i++)
	{
		str += this.textures[i].name;
		if (i < (this.textures.length - 1))
			str += ",";
	}
	str += ";";

	str += (this.shadowCamera ? this.shadowCamera.name : "none") + ";";
	return str;
}

function RODoAssignment(scene, property, propertyValue)
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
		case "pos":
			var split = propertyValue.csvToArray();
			this.pos = vec3.fromValues(parseFloat(split[0][0]), parseFloat(split[0][1]), parseFloat(split[0][2]));
			result = true;
			break;
		case "rot":
			var split = propertyValue.csvToArray();
			this.rot = quat.fromValues(parseFloat(split[0][0]), parseFloat(split[0][1]), parseFloat(split[0][2]), parseFloat(split[0][3]));
			result = true;
			break;
		case "scale":
			var split = propertyValue.csvToArray();
			this.scale = vec3.fromValues(parseFloat(split[0][0]), parseFloat(split[0][1]), parseFloat(split[0][2]));
			result = true;
			break;
		case "updateFunction":
			this.updateFunctionName = propertyValue;
			this.updateCallback = window[this.updateFunctionName];
			result = true;
			break;
		case "shader":
			var shader = scene.getShader(propertyValue);
			if (shader)
			{
				this.shader = shader;
				result = true;
			}
			break;
		case "mesh":
			var mesh = scene.getMesh(propertyValue);
			if (mesh)
			{
				this.mesh = mesh;
				result = true;
			}
			break;
		case "shadowCamera":
			var shadowcam = scene.getCamera(propertyValue);
			if (shadowcam)
			{
				this.shadowCamera = shadowcam;
				result = true;
			}
			break;
		default:
			console.log("RenderObject::doObjectAssignment - unsupported property: " + property);
			break;
	}

	return result;
}

function ROPositionToString()
{
	var str = this.pos[0] + "," + this.pos[1] + "," + this.pos[2];
	return str;
}

function RORotationToString()
{
	var str = this.rot[0] + "," + this.rot[1] + "," + this.rot[2] + "," + this.rot[3];
	return str;
}

function ROScaleToString()
{
	var str = this.scale[0] + "," + this.scale[1] + "," + this.scale[2];
	return str;
}

function ROSelect(selected)
{
	this.selected = selected;
}

function RenderObject(scene, name, src)
{
	//this.scene = scene;
	this.name = name;
	this.src = src;

	this.update = UpdateRenderObject
	this.draw = DrawRenderObject
	this.drawSelected = DrawSelectedRenderObject
	this.updateWorldMatrix = ROUpdateWorldMatrix
	this.toString = ROToString
	this.doObjectAssignment = RODoAssignment;
	this.save = SaveRO;
	this.posString = ROPositionToString;
	this.rotString = RORotationToString;
	this.scaleString = ROScaleToString;
	this.setSelected = ROSelect;

	this.mesh = null;
	this.shader = null;
	this.pos = vec3.create();
	this.rot = quat.create();
	this.scale = vec3.fromValues(1,1,1);
	this.worldMatrix = mat4.create();
	this.updateFunctionName = null;
	this.updateCallback = null;
	this.textures = [];
	this.shadowCamera = null;

	this.selected = false;

	roXML = LoadXML(src);
	if( roXML )
	{

		for (var i = 0; i < roXML.documentElement.attributes.length; i++)
		{
			var attrib = roXML.documentElement.attributes[i];
			switch (attrib.name)
			{
				case "pos":
					var pos = attrib.value;
					var values = pos.csvToArray();
					this.pos = vec3.fromValues(values[0][0], values[0][1], values[0][2]);
					break;
				case "rot":
					var rot = attrib.value;
					var values = rot.csvToArray();
					this.rot = quat.fromValues(values[0][0], values[0][1], values[0][2], values[0][3]);
					break;
				case "scale":
					var values = attrib.value.csvToArray();
					this.scale = vec3.fromValues(values[0][0], values[0][1], values[0][2]);
					break;
				case "update":
					this.updateFunctionName = attrib.value;
					this.updateCallback = window[this.updateFunctionName];
					break;
				default:
					break;
			}
		}

		var children = roXML.documentElement.childNodes;
		for( var i = 0; i < children.length; i++ )
		{
			if( children[i].nodeType == 1 )
			{
				var nodeName = children[i].attributes.getNamedItem("name").value;
				var nodeSrc = children[i].attributes.getNamedItem("src").value;
				if (children[i].nodeName == "mesh")
				{
					this.mesh = scene.getMesh(nodeName, nodeSrc);
				}
				else if (children[i].nodeName == "shader")
				{
					this.shader = scene.getShader(nodeName, nodeSrc);
				}
				else if (children[i].nodeName == "texture")
				{
					var tex = null;
					if( nodeSrc == "frameBuffer" )
					{
						var depthTexture = false;
						var dtAttr = children[i].attributes.getNamedItem("depthTexture");
						if( dtAttr )
							depthTexture = (dtAttr.value === "true");

						var fb = scene.getFrameBuffer(nodeName, null);
						if( fb )
						{
							if( depthTexture )
								tex = fb.depthTexture;
							else
								tex = fb.colorTexture;
						}
					}
					else
					{
						// Normal texture
						tex = scene.getTexture(nodeName, nodeSrc);
					}
											
					if( tex )
					{						
						var texIndex = 0;
						var index = children[i].attributes.getNamedItem("texIndex");
						if( index )
							texIndex = parseInt(index.value);

						this.textures[texIndex] = tex;
					}
				}
				else if (children[i].nodeName == "shadowCamera")
				{
					this.shadowCamera = scene.getCamera(nodeName, nodeSrc);
				}
			}
		}
	}

	this.updateWorldMatrix();
}

function SaveRO(path)
{
	var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\n";

	xml += "<renderobject name=\"" + this.name + "\" pos=\"" + this.posString() + "\" rot=\"" + this.rotString() + "\" scale=\"" + this.scaleString();
	if (this.updateCallback)
		xml += "\" update=\"" + this.updateFunctionName;
	xml += "\">\n";

	if (this.mesh)
		xml += "\t<mesh name=\"" + this.mesh.name + "\" src=\"" + this.mesh.src + "\"/>\n";
	if (this.shader)
		xml += "\t<shader name=\"" + this.shader.name + "\" src=\"" + this.shader.src + "\"/>\n";
	for (var i = 0; i < this.textures.length; i++)
	{
		if (this.textures[i])
		{
			if (this.textures[i].src == "frameBuffer")
			{
				var depthTexture = false;
				var idx = this.textures[i].name.indexOf("_color");
				if (idx < 0)
				{
					idx = this.textures[i].name.indexOf("_depth");
					depthTexture = true;
				}
				var texName = this.textures[i].name.substring(0, idx);

				xml += "\t<texture name=\"" + texName + "\" src=\"" + this.textures[i].src;
				if (depthTexture)
					xml += "\" depthTexture=\"true";
				xml += "\" texIndex=\"" + i + "\"/>\n";
			}
			else
			{
				xml += "\t<texture name=\"" + this.textures[i].name + "\" src=\"" + this.textures[i].src + "\" texIndex=\"" + i + "\"/>\n";
			}
		}
	}
	if (this.shadowCamera)
		xml += "\t<shadowCamera name=\"" + this.shadowCamera.name + "\" src=\"" + this.shadowCamera.src + "\"/>\n";

	xml += "</renderobject>";
	SaveFile(path + this.src, xml);
}