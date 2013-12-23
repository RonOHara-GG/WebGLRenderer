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
				
			// index without duplicates
			var duplicates = [];
			indices[0] = 0;
			var pointCount = triangleCount * 3;
			for( var i = 1; i < pointCount; i++ )
			{
				// check this point vs all previous points to see if its a duplicate
				var dupIdx;
				for( dupIdx = 0; dupIdx < i; dupIdx++ )
				{
					var dup = true;
					if( positions.length > 0 )
					{
						if( positions[dupIdx][0] != positions[i][0] || positions[dupIdx][1] != positions[i][1] || positions[dupIdx][2] != positions[i][2] )
						{
							dup = false;
						}
					}

					if( normals.length > 0 )
					{
						if( normals[dupIdx][0] != normals[i][0] || normals[dupIdx][1] != normals[i][1] || normals[dupIdx][2] != normals[i][2] )
						{
							dup = false;
						}
					}

					if( uvs.length > 0 )
					{
						if( uvs[dupIdx][0] != uvs[i][0] || uvs[dupIdx][1] != uvs[i][1] )
						{
							dup = false;
						}
					}

					if( dup )
					{
						// break so that the dup index is valid
						duplicates.push(i);
						break;
					}
				}

				if( dupIdx < i )
					indices[i] = dupIdx;
				else
					indices[i] = i;
			}

			// strip all verts that are unused and re-index
			for( var i = 0; i < duplicates.length; i++ )
			{
				var dupIdx = duplicates[i];
				
				// strip this vertex data from the arrays
				if( positions.length > 0 )
					positions.splice(dupIdx, 1);
				if( normals.length > 0 )
					normals.splice(dupIdx, 1);
				if( uvs.length > 0 )
					uvs.splice(dupIdx, 1);

				// adjust indices
				for( var j = 0; j < indices.length; j++ )
				{
					if( indices[j] > dupIdx )
						indices[j]--;
				}

				// adjust dupilcates
				for( var j = i + 1; j < duplicates.length; j++ )
				{
					if( duplicates[j] > dupIdx )
						duplicates[j]--;
				}
			}
		}
	}
	
	var vertCount = positions.length;

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

		mesh += positions[i][0] + ",";
		mesh += positions[i][1] + ",";
		mesh += positions[i][2];

		mesh += "</v3>\n";
	}
	mesh += "\t\t</positions>\n";
	if (normals.length > 0)
	{
		mesh += "\t\t<normals>\n"
		for (var i = 0; i < vertCount; i++)
		{
			mesh += "\t\t\t<v3>";

			mesh += normals[i][0] + ",";
			mesh += normals[i][1] + ",";
			mesh += normals[i][2];

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

			mesh += uvs[i][0] + ",";
			mesh += uvs[i][1];

			mesh += "</v2>\n";
		}
		mesh += "\t\t</texcoords>\n";
	}
	mesh += "\t</verts>\n";
	mesh += "\t<indices>";
	for (var i = 0; i < indices.length; i++)
	{
		mesh += indices[i];
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