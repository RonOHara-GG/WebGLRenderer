function UpdateRenderObject(deltaTimeMS)
{
	if (this.updateCallback)
	{
		this.updateCallback(deltaTimeMS);
	}
}

function DrawRenderObject(gl)
{
	// Bind shader
	this.shader.bind(gl);

	// Update shader params
	var mvp = mat4.create();
	mat4.mul(mvp, gl.viewProj, this.worldMatrix);
	this.shader.setMVP(gl, mvp);

	var nrm = mat3.create();
	mat3.fromMat4(nrm, this.worldMatrix);
	this.shader.setNormalMatrix(gl, nrm);

	// Draw mesh
	if (this.mesh)
	{
		this.mesh.draw(gl);
	}
}

function ROUpdateWorldMatrix()
{
	mat4.fromRotationTranslation(this.worldMatrix, this.rot, this.pos);
}

function RenderObject(scene, name, src)
{
	this.scene = scene;
	this.name = name;
	this.src = src;

	this.update = UpdateRenderObject
	this.draw = DrawRenderObject
	this.updateWorldMatrix = ROUpdateWorldMatrix

	this.mesh = null;
	this.shader = null;
	this.pos = vec3.create();
	this.rot = quat.create();
	this.worldMatrix = mat4.create();
	this.updateCallback = null;

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
					values = rot.csvToArray();
					this.rot = quat.fromValues(values[0][0], values[0][1], values[0][2], values[0][3]);
					break;
				case "update":
					this.updateCallback = window[attrib.value];
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
			}
		}
	}

	this.updateWorldMatrix();
}