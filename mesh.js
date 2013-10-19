function Mesh(scene, name, src)
{
	this.scene = scene;
	this.name = name;
	this.src = src;

	this.vb = null;
	this.ib = null;

	meshXML = LoadXML(src);
	if( meshXML )
	{
		//http://wiki.delphigl.com/index.php/Tutorial_WebGL_Sample

		meshChildren = meshXML.documentElement.childNodes;
		for (var i = 0; i < meshChildren.length; i++)
		{
			if (meshChildren[i].nodeType == 1)
			{
				if (meshChildren[i].nodeName == "verts")
				{
					var vertCount = parseInt(meshChildren[i].attributes.getNamedItem("count").value);
					var vertFormat = meshChildren[i].attributes.getNamedItem("format").value;


					var posArray = [];
					var nrmArray = [];

					vertPieces = meshChildren[i].childNodes;
					for (var j = 0; j < vertPieces.length; j++)
					{
						if (vertPieces[j].nodeType == 1)
						{
							if (vertPieces[j].nodeName == "positions")
							{
								positions = vertPieces[j].childNodes;
								for (var k = 0; k < positions.length; k++)
								{
									if (positions[k].nodeType == 1)
									{
										if (positions[k].nodeName == "v3")
										{
											var pos = new Vector3(positions[k].value);
											posArray.push(pos);
										}
									}
								}
							}
							else if (vertPieces[j].nodeName == "normals")
							{
								normals = vertPieces[j].childNodes;
								for (var k = 0; k < normals.length; k++)
								{
									if (normals[k].nodeType == 1)
									{
										if (normals[k].nodeName == "v3")
										{
											var nrm = new Vector3(normals[k].value);
											nrmArray.push(nrm);
										}
									}
								}
							}
						}
					}

					var interleaved = [];
					for( var j = 0; j < vertCount; j++ )
					{
						interleaved.push(posArray[j]);
						interleaved.push(nrmArray[j]);
					}

					this.vb = scene.gl.createBuffer();
					scene.gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
					scene.gl.bufferData(gl.ARRAY_BUFFER, new WebGLFloatArray(interleaved), gl.STATIC_DRAW);
				}
			}
		}
	}
}