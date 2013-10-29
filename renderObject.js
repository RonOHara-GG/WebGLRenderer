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
	this.scale = vec3.fromValues(1,1,1);
	this.worldMatrix = mat4.create();
	this.updateCallback = null;
	this.textures = [];
	this.shadowCamera = null;

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