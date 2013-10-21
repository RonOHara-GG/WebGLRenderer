function DrawRenderObject(gl)
{
	// Bind shader
	this.shader.bind(gl);

	// Update shader params
	mvp = mat4.create();
	mat4.mul(mvp, worldMatrix, viewProj);

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

	this.draw = DrawRenderObject
	this.updateWorldMatrix = ROUpdateWorldMatrix

	this.mesh = null;
	this.shader = null;
	this.pos = vec3.create();
	this.rot = quat.create();
	this.worldMatrix = mat4.create();

	roXML = LoadXML(src);
	if( roXML )
	{
		var pos = roXML.documentElement.attributes.getNamedItem("pos").value;
		var values = pos.csvToArray();
		this.pos.fromValues(values[0][0], values[0][1], values[0][2]);
		var rot = roXML.documentElement.attributes.getNamedItem("rot").value;
		values = rot.csvToArray();
		this.rot.fromValues(values[0][0], values[0][1], values[0][2], values[0][3]);

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
					this.shader = scene.getShader(nodeName, src);
				}
			}
		}
	}

	ROUpdateWorldMatrix();
}