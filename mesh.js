function DrawMesh(gl)
{
	if (this.vb)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
		switch (this.vertFormat)
		{
			case "P3N3":
				gl.enableVertexAttribArray(0);
				gl.enableVertexAttribArray(1);
				gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6*4, 0*4);
				gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6*4, 3*4);
				break;
			default:
				alert("unsupported vertex format: " + this.vertFormat);
				break; 
		}

		if (this.ib)
		{
			// Indexed draw
			gl.drawElements(gl.TRIANGLES, this.triangleCount, gl.UNSIGNED_SHORT, 0);
		}
		else
		{
			// Non indexed draw
			gl.drawArrays(gl.TRIANGLES, 0, this.triangleCount);
		}
	}
}

function Mesh(scene, name, src)
{
	this.scene = scene;
	this.name = name;
	this.src = src;

	this.draw = DrawMesh;

	this.vb = null;
	this.ib = null;
	this.triangleCount = 0;

	meshXML = LoadXML(src);
	if( meshXML )
	{
		//http://wiki.delphigl.com/index.php/Tutorial_WebGL_Sample

		this.triangleCount = parseInt(meshXML.documentElement.attributes.getNamedItem("triangleCount"));

		meshChildren = meshXML.documentElement.childNodes;
		for (var i = 0; i < meshChildren.length; i++)
		{
			if (meshChildren[i].nodeType == 1)
			{
				if (meshChildren[i].nodeName == "verts")
				{
					this.vertCount = parseInt(meshChildren[i].attributes.getNamedItem("count").value);
					this.vertFormat = meshChildren[i].attributes.getNamedItem("format").value;


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
											var pos = new Vector3(positions[k].textContent);
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
											var nrm = new Vector3(normals[k].textContent);
											nrmArray.push(nrm);
										}
									}
								}
							}
						}
					}

					var interleaved = [];
					for( var j = 0; j < this.vertCount; j++ )
					{
						interleaved.push(posArray[j].x);
						interleaved.push(posArray[j].y);
						interleaved.push(posArray[j].z);
						interleaved.push(nrmArray[j].x);
						interleaved.push(nrmArray[j].y);
						interleaved.push(nrmArray[j].z);
					}

					this.vb = scene.gl.createBuffer();
					scene.gl.bindBuffer(scene.gl.ARRAY_BUFFER, this.vb);
					scene.gl.bufferData(scene.gl.ARRAY_BUFFER, new Float32Array(interleaved), scene.gl.STATIC_DRAW);
				}
			}
		}
	}
}