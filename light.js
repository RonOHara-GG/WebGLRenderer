function Light(scene, name, src)
{
	this.scene = scene;
	this.name = name;
	this.src = src;

	this.type = "dir";
	this.color = vec3.fromValues(1.0, 1.0, 1.0);
	this.dir = vec3.create();

	var xml = LoadXML(src);
	if (xml)
	{
		for (var i = 0; i < xml.documentElement.attributes.length; i++)
		{
			var attrib = xml.documentElement.attributes[i];
			switch (attrib.name)
			{
				case "type":
					this.type = attrib.value;
					break;
				case "color":
					var values = attrib.value.csvToArray();
					this.color = vec3.fromValues(values[0][0] / 255.0, values[0][1] / 255.0, values[0][2] / 255.0);
					break;
				case "dir":
					var values = attrib.value.csvToArray();
					var temp = vec3.fromValues(values[0][0], values[0][1], values[0][2]);
					vec3.normalize(this.dir, temp);
					break;
				default:
					break;
			}
		}
	}	
}