function ParticleUpdate(deltaTime, forces, colliders)
{
	if (this.life > 0)
	{
		var time = Math.min(this.life, deltaTime);

		var startPos = vec3.create();
		vec3.copy(startPos, this.pos);

		for (var i = 0; i < forces.length; i++)
		{
			vec3.scaleAndAdd(this.vel, this.vel, forces[i], time);
		}

		vec3.scaleAndAdd(this.pos, this.pos, this.vel, time);

		// Collide
		for (var i = 0; i < colliders.length; i++)
		{
			colliders.collide(startPos, this.pos, this.pos, this.vel);
		}
		
		this.life -= deltaTime;
	}
}

function RandRangeF(a, b)
{
	return Math.random() * (b - a) + a;
}

function RandRange(a, b)
{
	return Math.floor(Math.random() * (b - a)) + a;
}

function ParticleSpawn(location, direction)
{
	var particle = new Object;

	particle.vp = vec3.create();
	particle.pos = vec3.create();
	particle.vel = vec3.create();
	vec3.copy(particle.pos, location);
	particle.size = RandRange(this.minSize, this.maxSize);
	particle.color = this.colors[Math.floor(Math.random() * this.colors.length)];
	particle.life = RandRangeF(this.minLife, this.maxLife);
	particle.speed = RandRangeF(this.minSpeed, this.maxSpeed);
	particle.texture = this.textures[Math.floor(Math.random() * this.textures.length)];

	vec3.scale(particle.vel, direction, particle.speed);

	particle.update = ParticleUpdate;

	return particle;
}

function Particle(scene, name, src)
{
	this.name = name;
	this.src = src;

	this.spawn = ParticleSpawn;

	this.cameraFacing = true;
	this.minSize = 1.0;
	this.maxSize = 10.0;
	this.minLife = 5.0;
	this.maxLife = 30.0;
	this.minSpeed = 1.0;
	this.maxSpeed = 5.0;

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
						this.minSize = parseFloat(attrib.value);
						break;
					case "maxSize":
						this.maxSize = parseFloat(attrib.value);
						break;
					case "minLife":
						this.minLife = parseFloat(attrib.value);
						break;
					case "maxLife":
						this.maxLife = parseFloat(attrib.value);
						break;
					case "minSpeed":
						this.minSpeed = parseFloat(attrib.value);
						break;
					case "maxSpeed":
						this.maxSpeed = parseFloat(attrib.value);
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
					switch (children[i].nodeName)
					{
						case "color":
							var colorStrs = children[i].textContent.split(",");
							var color = vec4.create();
							vec4.scale(color, vec4.fromValues(parseInt(colorStrs[0]), parseInt(colorStrs[1]), parseInt(colorStrs[2]), (colorStrs.length > 3) ? parseInt(colorStrs[3]) : 255), 1/255);							
							this.colors.push(color);
							break;
						case "texture":
							var nodeName = children[i].attributes.getNamedItem("name").value;
							var nodeSrc = children[i].attributes.getNamedItem("src").value;
							var tex = scene.getTexture(nodeName, nodeSrc);
							this.textures.push(tex);
							break;
						default:
							break;
					}
				}
			}

		}
	}
}