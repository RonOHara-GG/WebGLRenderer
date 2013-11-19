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


			var pindex = 0;
			for (var i = 0; i < triangleCount; i++)
			{
				for (var j = 0; j < 3; j++)
				{
					var vertIndex = 0;
					var values = [];
					for (var k = 0; k < mesh.triangles.inputs.length; k++)
					{
						var index = mesh.triangles.p[pindex++];
						var source = mesh.triangles.inputs[k].source;
						var valIndex = index * 3;
						var value = vec3.fromValues(source.float_array.floats[valIndex], source.float_array.floats[valIndex + 1], source.float_array.floats[valIndex + 2]);
						values.push(value);
						vertIndex = Math.max(index, vertIndex);
					}

					for (var k = 0; k < mesh.triangles.inputs.length; k++)
					{
						var input = mesh.triangles.inputs[k];
						switch (input.semantic)
						{
							case "VERTEX":
								positions[vertIndex] = values[k];
								break;
							case "NORMAL":
								normals[vertIndex] = values[k];
								break;
							case "TEXCOORD":
								uvs[vertIndex] = values[k];
								break;
							case "TEXTANGENT":
								break;
							case "TEXBINORMAL":
								break;
							default:
								break;
						}
					}
					indices.push(vertIndex);
					minVertIndex = Math.min(minVertIndex, vertIndex);
				}
			}
		}
	}
	var vertCount = positions.length - minVertIndex;

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

		mesh += positions[i + minVertIndex][0] + ", ";
		mesh += positions[i + minVertIndex][1] + ", ";
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

			mesh += normals[i + minVertIndex][0] + ", ";
			mesh += normals[i + minVertIndex][1] + ", ";
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

			mesh += uvs[i + minVertIndex][0] + ", ";
			mesh += uvs[i + minVertIndex][1] + ", ";

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
			mesh += ", ";
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