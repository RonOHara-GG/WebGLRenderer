function ParticleUpdate(deltaTime)
{
	if (this.life > 0)
	{
		var time = Math.min(this.life, deltaTime);
		vec3.scaleAndAdd(this.position, this.position, this.direction, this.speed * time);
		this.life -= deltaTime;
	}
}

function RandRange(a, b)
{
	return Math.floor(Math.random() * (b - a)) + a;
}

function ParticleSpawn(location, direction)
{
	var particle;

	particle.position = location;
	particle.direction = direction;
	particle.size = RandRange(this.minSize, this.maxSize);
	particle.color = this.colors[Math.floor(Math.random() * this.colors.length)];
	particle.life = RandRange(this.minLife, this.maxLife);
	particle.speed = RandRange(this.minSpeed, this.maxSpeed);

	particle.update = ParticleUpdate;

	return particle;
}

function Particle(scene, name, src)
{
	this.name = name;
	this.src = src;

	this.spawn = ParticleSpawn;

	this.cameraFacing = true;
	this.minSize = 1;
	this.maxSize = 10;
	this.minLife = 5;
	this.maxLife = 30;
	this.minSpeed = 1;
	this.maxSpeed = 5;

	this.colors = [];
	this.textures = [];

	if (src)
	{
		var xml = LoadXML(src);
		if (xml)
		{
			for (var i = 0; i < xml.documentElement.attributes.length; i++)
			{
				var attrib = xml.documentElement.attributes[i];
				switch (attrib.name)
				{
					case "cameraFacing":
						this.cameraFacing = (attrib.value == "true");
						break;
					case "minSize":
						this.minSize = parseInt(attrib.value);
						break;
					case "maxSize":
						this.maxSize = parseInt(attrib.value);
						break;
					default:
						break;
				}
			}

			var children = xml.documentElement.childNodes;
			for (var i = 0; i < children.length; i++)
			{
				if (children[i].nodeType == 1)
				{
					var nodeName = children[i].attributes.getNamedItem("name").value;
					var nodeSrc = children[i].attributes.getNamedItem("src").value;
					switch (children[i].nodeName)
					{
						case "color":
							var colorStrs = children[i].textContent.split(",");
							var color = vec4.create();
							vec4.scale(color, vec4.fromValues(parseInt(colorStrs[0]), parseInt(colorStrs[1]), parseInt(colorStrs[2]), (colorStrs.length > 3) ? parseInt(colorStrs[3]) : 255), 1/255);							
							this.colors.push(color);
							break;
						case "texture":
							break;
						default:
							break;
					}
				}
			}

		}
	}
}