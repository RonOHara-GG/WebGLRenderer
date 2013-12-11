function UpdateRenderObject(deltaTimeMS)
{
	if (this.updateCallback)
	{
		this.updateCallback(deltaTimeMS);
	}
}

function DrawSelectedRenderObject(gl)
{
	if (this.mesh)
	{
		var min = this.mesh.boxMin;
		var max = this.mesh.boxMax;
		var extent = vec3.create;
		vec3.sub(extent, max, min);
		var dist = vec3.length(extent) * 0.1;
		vec3.scale(extent, extent, 0.5);

		
		var points = [];

		points.push(min);
		points.push(vec3.fromValues(min[0] + dist, min[1], min[2]));
		points.push(min);
		points.push(vec3.fromValues(min[0], min[1] + dist, min[2]));
		points.push(min);
		points.push(vec3.fromValues(min[0], min[1], min[2] + dist));

		var corner = vec3.fromValues(min[0], min[1], max[2]);
		points.push(corner);
		points.push(vec3.fromValues(corner[0] + dist, corner[1], corner[2]));
		points.push(corner);
		points.push(vec3.fromValues(corner[0], corner[1] + dist, corner[2]));
		points.push(corner);
		points.push(vec3.fromValues(corner[0], corner[1], corner[2] - dist));

		corner = vec3.fromValues(min[0], max[1], max[2]);
		points.push(corner);
		points.push(vec3.fromValues(corner[0] + dist, corner[1], corner[2]));
		points.push(corner);
		points.push(vec3.fromValues(corner[0], corner[1] - dist, corner[2]));
		points.push(corner);
		points.push(vec3.fromValues(corner[0], corner[1], corner[2] - dist));

		corner = vec3.fromValues(min[0], max[1], min[2]);
		points.push(corner);
		points.push(vec3.fromValues(corner[0] + dist, corner[1], corner[2]));
		points.push(corner);
		points.push(vec3.fromValues(corner[0], corner[1] - dist, corner[2]));
		points.push(corner);
		points.push(vec3.fromValues(corner[0], corner[1], corner[2] + dist));

		points.push(max);
		points.push(vec3.fromValues(max[0] - dist, max[1], max[2]));
		points.push(max);
		points.push(vec3.fromValues(max[0], max[1] - dist, max[2]));
		points.push(max);
		points.push(vec3.fromValues(max[0], max[1], max[2] - dist));

		corner = vec3.fromValues(max[0], max[1], min[2]);
		points.push(corner);
		points.push(vec3.fromValues(corner[0] - dist, corner[1], corner[2]));
		points.push(corner);
		points.push(vec3.fromValues(corner[0], corner[1] - dist, corner[2]));
		points.push(corner);
		points.push(vec3.fromValues(corner[0], corner[1], corner[2] + dist));

		corner = vec3.fromValues(max[0], min[1], min[2]);
		points.push(corner);
		points.push(vec3.fromValues(corner[0] - dist, corner[1], corner[2]));
		points.push(corner);
		points.push(vec3.fromValues(corner[0], corner[1] + dist, corner[2]));
		points.push(corner);
		points.push(vec3.fromValues(corner[0], corner[1], corner[2] + dist));

		corner = vec3.fromValues(max[0], min[1], max[2]);
		points.push(corner);
		points.push(vec3.fromValues(corner[0] - dist, corner[1], corner[2]));
		points.push(corner);
		points.push(vec3.fromValues(corner[0], corner[1] + dist, corner[2]));
		points.push(corner);
		points.push(vec3.fromValues(corner[0], corner[1], corner[2] - dist));

		DrawLines(gl, points, this.worldMatrix, vec3.fromValues(1, 0, 0));
		DrawMoveControl(gl, extent, this.worldMatrix);		
	}
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
			this.updateWorldMatrix();
			result = true;
			break;
		case "rot":
			var split = propertyValue.csvToArray();
			this.rot = quat.fromValues(parseFloat(split[0][0]), parseFloat(split[0][1]), parseFloat(split[0][2]), parseFloat(split[0][3]));
			this.updateWorldMatrix();
			result = true;
			break;
		case "scale":
			var split = propertyValue.csvToArray();
			this.scale = vec3.fromValues(parseFloat(split[0][0]), parseFloat(split[0][1]), parseFloat(split[0][2]));
			this.updateWorldMatrix();
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

function ROLineTest(a, b)
{
	var dist = -1;

	if( this.mesh )
	{
		var dir = vec3.create();
		vec3.sub(dir, b, a);

		var min = vec3.create();
		var max = vec3.create();
		vec3.transformMat4(min, this.mesh.boxMin, this.worldMatrix);
		vec3.transformMat4(max, this.mesh.boxMax, this.worldMatrix);

		var across = vec3.create();
		vec3.sub(across, max, min);
		var extent = vec3.create();
		vec3.scale(extent, across, 0.5);
		var center = vec3.create();
		vec3.add(center, min, extent);

		var diff = vec3.create();
		vec3.sub(diff, center, a);

		var maxS = Number.MIN_VALUE;
		var minT = Number.MAX_VALUE;

		for (var i = 0; i < 3; i++)
		{
			var axis = vec3.fromValues(this.worldMatrix[i], this.worldMatrix[4 + i], this.worldMatrix[8 + i]);

			var e = vec3.dot(axis, diff);
			var f = vec3.dot(dir, axis);

			if (f == 0)
			{
				if (-e - extent[i] > 0.0 || -e + extent[i] > 0.0)
					return -1;
				continue;
			}

			var s = (e - extent[i]) / f;
			var t = (e + extent[i]) / f;

			if (s > t)
			{
				var temp = s;
				s = t;
				t = temp;
			}

			if (s > maxS)
				maxS = s;
			if (t < minT)
				minT = t;

			if (maxS > minT)
				return -1;
		}

		var len = vec3.length(dir);
		dist = minT / len;
	}

	return dist;
}

function RayPlaneIntersection(ro, rd, pp, pn)
{
	var denom = vec3.dot(pn, rd);
	if (Math.abs(denom) > 1e-6)
	{
		var ptor = vec3.create();
		vec3.sub(ptor, pp, ro);

		var dist = vec3.dot(ptor, pn) / denom;

		var isect = vec3.create();
		vec3.scaleAndAdd(isect, ro, rd, dist);
		return isect;
	}

	return null;
}

function ROGetDragAxis(ro, rd)
{
	console.log("getDragAxis rd: (" + rd[0] + ", " + rd[1] + ", " + rd[2] + ")");

	// Intersect with xy axis
	var xyPt = RayPlaneIntersection(ro, rd, this.pos, vec3.fromValues(0, 0, 1));	

	// Intersect with xz axis
	var xzPt = RayPlaneIntersection(ro, rd, this.pos, vec3.fromValues(0, 1, 0));	

	// Intersect with yz axis
	var yzPt = RayPlaneIntersection(ro, rd, this.pos, vec3.fromValues(1, 0, 0));

	console.log("getDragAxis - this.pos: (" + this.pos[0] + ", " + this.pos[1] + ", " + this.pos[2] + ")");
	var distXY = Number.MAX_VALUE;
	if (xyPt)
	{
		var delta = vec3.create();
		vec3.sub(delta, xyPt, vec3.fromValues(this.pos[0] + 0.3, this.pos[1] + 0.3, this.pos[2]));
		var dotXY = vec3.dot(delta, vec3.fromValues(0.70710678, 0.70710678, 0));
		//if (dotXY > 0)
			distXY = vec3.length(delta);
		console.log("getDragAxis - xyPt: (" + xyPt[0] + ", " + xyPt[1] + ", " + xyPt[2] + ") " + dotXY + " : " + vec3.length(delta));
	}

	var distXZ = Number.MAX_VALUE;
	if (xzPt)
	{
		var delta = vec3.create();
		vec3.sub(delta, xzPt, vec3.fromValues(this.pos[0] + 0.3, this.pos[1], this.pos[2] + 0.3));
		var dotXZ = vec3.dot(delta, vec3.fromValues(0.70710678, 0, 0.70710678));
		//if (dotXZ > 0)
			distXZ = vec3.length(delta);
		console.log("getDragAxis - xzPt: (" + xzPt[0] + ", " + xzPt[1] + ", " + xzPt[2] + ") " + dotXZ + " : " + vec3.length(delta));
	}

	var distYZ = Number.MAX_VALUE;
	if (yzPt)
	{
		var delta = vec3.create();
		vec3.sub(delta, yzPt, vec3.fromValues(this.pos[0], this.pos[1] + 0.3, this.pos[2] + 0.3));
		var dotYZ = vec3.dot(delta, vec3.fromValues(0, 0.70710678, 0.70710678));
		//if (distYZ > 0)
			distYZ = vec3.length(delta);
		console.log("getDragAxis - yzPt: (" + yzPt[0] + ", " + yzPt[1] + ", " + yzPt[2] + ") " + dotYZ);
	}

	console.log("getDragAxis - xy:" + distXY + ", xz:" + distXZ + ", yz:" + distYZ);
	if (distXY < distXZ && distXY < distYZ)
		return "xy";
	else if (distXZ < distXY && distXZ < distYZ)
		return "xz";
	else if (distYZ < distXZ && distYZ < distXY)
		return "yz";

	return "none";
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
	this.lineTest = ROLineTest;
	this.getDragAxis = ROGetDragAxis;

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