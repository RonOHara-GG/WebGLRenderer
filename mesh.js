function DrawMesh(gl)
{
	if (this.vb)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
		switch (this.vertFormat)
		{
			case "P3":
				gl.enableVertexAttribArray(gl.shaderPositionLocation);
				gl.vertexAttribPointer(gl.shaderPositionLocation, 3, gl.FLOAT, false, 0, 0);
				break;
			case "P3N3":
				gl.enableVertexAttribArray(gl.shaderPositionLocation);
				gl.enableVertexAttribArray(gl.shaderNormalLocation);
				gl.vertexAttribPointer(gl.shaderPositionLocation, 3, gl.FLOAT, false, 24, 0);
				gl.vertexAttribPointer(gl.shaderNormalLocation, 3, gl.FLOAT, false, 24, 12);
				break;				
			default:
				alert("unsupported vertex format: " + this.vertFormat);
				break; 
		}

		if (this.ib)
		{
			// Indexed draw
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ib);
			gl.drawElements(gl.TRIANGLES, this.triangleCount * 3, gl.UNSIGNED_SHORT, 0);
		}
		else
		{
			// Non indexed draw
			gl.drawArrays(gl.TRIANGLES, 0, this.triangleCount * 3);
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
		this.triangleCount = parseInt(meshXML.documentElement.attributes.getNamedItem("triangleCount").value);

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
											var posVals = positions[k].textContent.csvToArray();
											var pos = vec3.fromValues(posVals[0][0], posVals[0][1], posVals[0][2]);
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
											var vals = normals[k].textContent.csvToArray();
											var nrm = vec3.fromValues(vals[0][0], vals[0][1], vals[0][2]);
											nrmArray.push(nrm);
										}
									}
								}
							}
						}
					}

					var interleaved = [];
					switch (this.vertFormat)
					{
						case "P3":
							for (var j = 0; j < this.vertCount; j++)
							{
								interleaved.push(posArray[j][0]);
								interleaved.push(posArray[j][1]);
								interleaved.push(posArray[j][2]);
							}
							break;
						case "P3N3":
							for (var j = 0; j < this.vertCount; j++)
							{
								interleaved.push(posArray[j][0]);
								interleaved.push(posArray[j][1]);
								interleaved.push(posArray[j][2]);
								interleaved.push(nrmArray[j][0]);
								interleaved.push(nrmArray[j][1]);
								interleaved.push(nrmArray[j][2]);
							}
							break;
					}

					this.vb = scene.gl.createBuffer();
					scene.gl.bindBuffer(scene.gl.ARRAY_BUFFER, this.vb);
					scene.gl.bufferData(scene.gl.ARRAY_BUFFER, new Float32Array(interleaved), scene.gl.STATIC_DRAW);
				}
				else if (meshChildren[i].nodeName == "indices")
				{
					var vals = meshChildren[i].textContent.csvToArray();

					this.ib = scene.gl.createBuffer();
					scene.gl.bindBuffer(scene.gl.ELEMENT_ARRAY_BUFFER, this.ib);
					scene.gl.bufferData(scene.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vals[0]), scene.gl.STATIC_DRAW);
				}
			}
		}
	}
}