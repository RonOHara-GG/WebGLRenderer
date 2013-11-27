function DrawMesh(gl)
{
	if (this.vb)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
		
		var format = this.vertFormat;
		var elements = format.length / 2;
		var offset = 0;
		for (var k = 0; k < elements; k++)
		{
			var idx = k * 2;
			var fmtelement = format.substring(idx, idx + 2);
			switch (fmtelement)
			{
				case "P3":
					gl.enableVertexAttribArray(gl.shaderPositionLocation);
					gl.vertexAttribPointer(gl.shaderPositionLocation, 3, gl.FLOAT, false, this.vertexStride, offset);
					offset += 12;
					break;
				case "N3": 
					if (gl.shaderNormalLocation >= 0)
					{
						gl.enableVertexAttribArray(gl.shaderNormalLocation);
						gl.vertexAttribPointer(gl.shaderNormalLocation, 3, gl.FLOAT, false, this.vertexStride, offset);
					}
					offset += 12;
					break;
				case "T2":
					if (gl.shaderUVLocattion >= 0)
					{
						gl.enableVertexAttribArray(gl.shaderUVLocattion);
						gl.vertexAttribPointer(gl.shaderUVLocattion, 2, gl.FLOAT, false, this.vertexStride, offset);
					}
					offset += 8;
					break;
				default:
					alert("unsupported vertex format: " + fmtelement);
					break;
			}
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

function MeshToString()
{
	var str;

	str = "mesh:" + this.name;
	str += ";";
	str += "src:" + this.src;

	return str;
}

function Mesh(scene, name, src)
{
	//this.scene = scene;
	this.name = name;
	this.src = src;

	this.draw = DrawMesh;
	this.toString = MeshToString;
	this.save = SaveMesh;

	this.vb = null;
	this.ib = null;
	this.triangleCount = 0;
	this.vertexStride = 0;
	this.boxMin = vec3.create();
	this.boxMax = vec3.create();

	if (EditorName)
		this.fullPath = GetFullPath(src);

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
					var uvArray = [];

					vertPieces = meshChildren[i].childNodes;
					for (var j = 0; j < vertPieces.length; j++)
					{
						if (vertPieces[j].nodeType == 1)
						{
							if (vertPieces[j].nodeName == "positions")
							{
								var positions = vertPieces[j].childNodes;
								for (var k = 0; k < positions.length; k++)
								{
									if (positions[k].nodeType == 1)
									{
										if (positions[k].nodeName == "v3")
										{
											var posVals = positions[k].textContent.csvToArray();
											var pos = vec3.fromValues(posVals[0][0], posVals[0][1], posVals[0][2]);
											posArray.push(pos);

											vec3.max(this.boxMax, this.boxMax, pos);
											vec3.min(this.boxMin, this.boxMin, pos);
										}
									}
								}
							}
							else if (vertPieces[j].nodeName == "normals")
							{
								var normals = vertPieces[j].childNodes;
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
							else if (vertPieces[j].nodeName == "texcoords")
							{
								var uvs = vertPieces[j].childNodes;
								for (var k = 0; k < uvs.length; k++)
								{
									if (uvs[k].nodeType == 1)
									{
										if (uvs[k].nodeName == "v2")
										{
											var vals = uvs[k].textContent.csvToArray();
											var uv = vec2.fromValues(vals[0][0], vals[0][1]);
											uvArray.push(uv);
										}
									}
								}
							}
						}
					}

					var interleaved = [];

					for (var j = 0; j < this.vertCount; j++)
					{
						var format = this.vertFormat;
						var elements = format.length / 2;
						this.vertexStride = 0;
						for (var k = 0; k < elements; k++)
						{
							var idx = k * 2;
							var fmtelement = format.substring(idx, idx + 2);
							switch (fmtelement)
							{
								case "P3":
									interleaved.push(posArray[j][0]);
									interleaved.push(posArray[j][1]);
									interleaved.push(posArray[j][2]);
									this.vertexStride += 12;
									break;
								case "N3":
									interleaved.push(nrmArray[j][0]);
									interleaved.push(nrmArray[j][1]);
									interleaved.push(nrmArray[j][2]);
									this.vertexStride += 12;
									break;
								case "T2":
									interleaved.push(uvArray[j][0]);
									interleaved.push(uvArray[j][1]);
									this.vertexStride += 8;
									break;
								default:
									alert("unsupported vertex format: " + fmtelement);
									break;
							}
						}
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

function SaveMesh(path)
{
	if (EditorName)
	{
		// Load the original mesh file and save it in the new directory
		var file = LoadFile(this.fullPath);
		SaveFile(path + this.src, file);
	}
}