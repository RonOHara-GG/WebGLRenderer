function PSUpdate(deltaTimeMS)
{
	var seconds = deltaTimeMS * 1000;

	// Update all emitters
	for (var i = 0; i < this.emitters.length; i++)
	{
		this.emitters[i].update(seconds);
	}
}

function PSDraw(gl)
{
	for (var i = 0; i < this.emitters.length; i++)
	{
		this.emitters[i].draw(gl, this.worldMtx);
	}
}

function ParticleSystem(scene, name, src)
{
	this.name = name;
	this.src = src;

	this.emitters = [];

	this.update = PSUpdate;
	this.draw = PSDraw;

	if (src)
	{
		var xml = LoadXML(src);
		if (xml)
		{
		/*
			for (var i = 0; i < xml.documentElement.attributes.length; i++)
			{
				var attrib = xml.documentElement.attributes[i];
				switch (attrib.name)
				{
					case "pos":
						var values = attrib.value.split(",");
						this.pos = vec3.fromValues(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]));
						break;
					case "rot":
						var values = attrib.value.split(",");
						this.rot = quat.fromValues(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]));
						break;
					default:
						break;
				}
			}
		*/

			var children = xml.documentElement.childNodes;
			for (var i = 0; i < children.length; i++)
			{
				if (children[i].nodeType == 1)
				{
					var nodeName = children[i].attributes.getNamedItem("name").value;
					var nodeSrc = children[i].attributes.getNamedItem("src").value;
					switch (children[i].nodeName)
					{
						case "particleEmitter":
							var emitter = scene.getParticleEmitter(nodeName, nodeSrc);
							this.emitters.push(emitter);
							break;
						default:
							break;
					}
				}
			}
		}
	}
}