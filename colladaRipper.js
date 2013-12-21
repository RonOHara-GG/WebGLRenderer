function getMesh(geom)
{
	var meshName = geom.name;
	var triangleCount = 0;
	var vertFormat = "";
	var positions = [];
	var normals = [];
	var uvs = [];
	var indices = [];
	var minVertIndex = 9999999;
	if (geom.meshes.length > 0)
	{
		var mesh = geom.meshes[0];
		if (mesh.triangles)
		{
			triangleCount = mesh.triangles.count;

			for (var i = 0; i < mesh.triangles.inputs.length; i++)
			{
				var input = mesh.triangles.inputs[i];
				switch (input.semantic)
				{
					case "VERTEX":
						vertFormat += "P3";
						break;
					case "NORMAL":
						vertFormat += "N3";
						break;
					case "TEXCOORD":
						vertFormat += "T2";
						break;
					case "TEXTANGENT":
						break;
					case "TEXBINORMAL":
						break;
					default:
						break;
				}
			}


			// Build array of vertex data using triangle indices
			var pindex = 0;
			for (var i = 0; i < triangleCount; i++)
			{
				for (var j = 0; j < 3; j++)
				{
					for (var k = 0; k < mesh.triangles.inputs.length; k++)
					{
						var index = mesh.triangles.p[pindex++];
						var input = mesh.triangles.inputs[k];
						var source = input.source;

						var valIndex = index * source.technique_common.accessor.stride;
						var value = vec3.fromValues(source.float_array.floats[valIndex], source.float_array.floats[valIndex + 1], source.float_array.floats[valIndex + 2]);

						switch (input.semantic)
						{
							case "VERTEX":
								positions.push(value);
								break;
							case "NORMAL":
								normals.push(value);
								break;
							case "TEXCOORD":
								uvs.push(value);
								break;
							case "TEXTANGENT":
								break;
							case "TEXBINORMAL":
								break;
							default:
								break;
						}
					}
				}
			}
				
			indices[0] = 0;
			var pointCount = triangleCount * 3;
			for( var i = 1; i < pointCount; i++ )
			{
				// check this point vs all previous points to see if its a duplicate
				var dupIdx;
				for( dupIdx = 0; dupIdx < i; dupIdx++ )
				{
					if( positions.length > 0 )
					{
						if( positions[dupIdx][0] != positions[i][0] || positions[dupIdx][1] != positions[i][1] || positions[dupIdx][2] != positions[i][2] )
						{
							dup = false;
							break;
						}
					}

					if( normals.length > 0 )
					{
						if( normals[dupIdx][0] != normals[i][0] || normals[dupIdx][1] != normals[i][1] || normals[dupIdx][2] != normals[i][2] )
						{
							dup = false;
							break;
						}
					}

					if( uvs.length > 0 )
					{
						if( normals[dupIdx][0] != normals[i][0] || normals[dupIdx][1] != normals[i][1] )
						{
							dup = false;
							break;
						}
					}
				}
			}



					for (var k = 0; k < mesh.triangles.inputs.length; k++)
					{
						
						
					}
					indices.push(vertIndex);
					minVertIndex = Math.min(minVertIndex, vertIndex);
				}
			}
		}
	}

	// Strip unused verts
	var ridx = minVertIndex;
	var widx = 0;
	var vertCount = 0;
	while (ridx < positions.length)
	{
		if (positions[ridx])
		{
			vertCount++;
			positions[widx] = positions[ridx];
			if (normals[ridx])
				normals[widx] = normals[ridx];
			if (uvs[ridx])
				uvs[widx] = uvs[ridx];
			for (var i = 0; i < indices.length; i++)
			{
				if (indices[i] == ridx)
					indices[i] = widx;
			}

			widx++;
		}
		ridx++;
	}

	minVertIndex = 0;
	//var vertCount = positions.length - minVertIndex;

	var mesh = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\n<mesh name=\"";

	mesh += meshName;
	mesh += "\" triangleCount=\"";

	mesh += triangleCount;
	mesh += "\">\n\t<verts count=\"";

	mesh += vertCount;
	mesh += "\" format=\"";

	mesh += vertFormat;
	mesh += "\">\n\t\t<positions>\n";

	for (var i = 0; i < vertCount; i++)
	{
		mesh += "\t\t\t<v3>";

		mesh += positions[i + minVertIndex][0] + ",";
		mesh += positions[i + minVertIndex][1] + ",";
		mesh += positions[i + minVertIndex][2];

		mesh += "</v3>\n";
	}
	mesh += "\t\t</positions>\n";
	if (normals.length > 0)
	{
		mesh += "\t\t<normals>\n"
		for (var i = 0; i < vertCount; i++)
		{
			mesh += "\t\t\t<v3>";

			mesh += normals[i + minVertIndex][0] + ",";
			mesh += normals[i + minVertIndex][1] + ",";
			mesh += normals[i + minVertIndex][2];

			mesh += "</v3>\n";
		}
		mesh += "\t\t</normals>\n";
	}
	if (uvs.length > 0)
	{
		mesh += "\t\t<texcoords>\n"
		for (var i = 0; i < vertCount; i++)
		{
			mesh += "\t\t\t<v2>";

			mesh += uvs[i + minVertIndex][0] + ",";
			mesh += uvs[i + minVertIndex][1] + ",";

			mesh += "</v2>\n";
		}
		mesh += "\t\t</texcoords>\n";
	}
	mesh += "\t</verts>\n";
	mesh += "\t<indices>";
	for (var i = 0; i < indices.length; i++)
	{
		mesh += indices[i] - minVertIndex;
		if (i < (indices.length - 1))
			mesh += ",";
	}
	mesh += "</indices>\n</mesh>";
	return mesh;
}

function ripColladaFile(filename)
{
	var idx = filename.lastIndexOf("/");
	if( idx < 0 )
		idx = filename.lastIndexOf("\\")
	var path = filename.substring(0, idx + 1);
	var colladaFile = new ColladaFile(filename);

	for (var i = 0; i < colladaFile.geoms.length; i++)
	{
		var mesh = getMesh(colladaFile.geoms[i]);
		SaveFile(path + colladaFile.geoms[i].name + ".xml", mesh);
	}
}