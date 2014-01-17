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
			colliders[i].collide(startPos, this.pos, this.pos, this.vel);
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

function ParticleDoAssignment(scene, property, propertyValue)
{
	var result = true;

	switch (property)
	{
		case "name":
			this.name = propertyValue;
			break;
		case "src":
			this.src = propertyValue;
			break;
		case "cameraFacing":
			this.cameraFacing = (propertyValue == "true");
			break;
		case "minSize":
			this.minSize = parseFloat(propertyValue);
			break;
		case "maxSize":
			this.maxSize = parseFloat(propertyValue);
			break;
		case "minLife":
			this.minLife = parseFloat(propertyValue);
			break;
		case "maxLife":
			this.maxSize = parseFloat(propertyValue);
			break;
		case "minSpeed":
			this.minSpeed = parseFloat(propertyValue);
			break;
		case "maxSpeed":
			this.maxSpeed = parseFloat(propertyValue);
			break;
		default:
			console.log("Particle::doObjectAssignment - unsupported property: " + property);
			result = false;
			break;
	}

	return result;
}


function Particle(scene, name, src)
{
	this.name = name;
	this.src = src;

	this.spawn = ParticleSpawn;
	this.toString = ParticleToString;
	this.doObjectAssignment = ParticleDoAssignment;

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

function ParticleToString()
{
	var str = "";

	str += "particle:" + this.name + ";";
	str += this.src + ";";

	str += this.cameraFacing + ";";
	str += this.minSize + ";";
	str += this.maxSize + ";";
	str += this.minLife + ";";
	str += this.maxLife + ";";
	str += this.minSpeed + ";";
	str += this.maxSpeed + ";";

	for (var i = 0; i < this.colors.length; i++)
	{
		if (i != 0)
			str += ":";
		str += Math.floor(this.colors[i][0] * 255) + "," + Math.floor(this.colors[i][1] * 255) + "," + Math.floor(this.colors[i][2] * 255) + "," + Math.floor(this.colors[i][3] * 255);
	}
	str += ";";

	for (var i = 0; i < this.textures.length; i++)
	{
		str += this.textures[i].name + ",";
	}
	str += ";";

	return str;
}