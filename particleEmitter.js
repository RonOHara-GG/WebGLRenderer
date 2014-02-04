var pointSpriteIndices = null;
var pointSpriteCorners = null;
var pointSpriteShader = null;

function InitPointSprites(gl, scene)
{
	if (!pointSpriteCorners)
	{
		var corners = [];
		corners[0] = -1; corners[1] = 1;
		corners[2] = 1; corners[3] = 1;
		corners[4] = 1; corners[5] = -1;
		corners[6] = -1;corners[7] = -1;

		pointSpriteCorners = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointSpriteCorners);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);

		var indices = [];
		indices[0] = 0;
		indices[1] = 1;
		indices[2] = 2;
		indices[3] = 0;
		indices[4] = 2;
		indices[5] = 3;
		pointSpriteIndices = scene.gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pointSpriteIndices);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

		if (gl.angleInstArraysExt)
			pointSpriteShader = scene.getShader("pointSpriteShader", "./pointSpriteShader.xml");
		else
			pointSpriteShader = scene.getShader("pointSpriteShaderS", "./pointSpriteShaderS.xml");
		pointSpriteShader.uProj = gl.getUniformLocation(pointSpriteShader.shaderProgram, "uPMatrix");
		pointSpriteShader.uViewUp = gl.getUniformLocation(pointSpriteShader.shaderProgram, "uViewUp");
		pointSpriteShader.uViewRight = gl.getUniformLocation(pointSpriteShader.shaderProgram, "uViewRight");
		pointSpriteShader.cornersLocation = gl.getAttribLocation(pointSpriteShader.shaderProgram, "aCornerNormal");

		if (gl.angleInstArraysExt)
		{
			pointSpriteShader.posLocation = gl.getAttribLocation(pointSpriteShader.shaderProgram, "aSpritePosition");
			pointSpriteShader.colorLocation = gl.getAttribLocation(pointSpriteShader.shaderProgram, "aSpriteColor");
		}
		else
		{
			pointSpriteShader.posLocation = gl.getUniformLocation(pointSpriteShader.shaderProgram, "aSpritePosition");
			pointSpriteShader.colorLocation = gl.getUniformLocation(pointSpriteShader.shaderProgram, "aSpriteColor");			
		}
	}
}

function PEUpdate(deltaTime, worldMtx, forces, colliders)
{
	// Update all particles
	for (var i = 0; i < this.particles.length; i++)
	{
		this.particles[i].update(deltaTime, forces, colliders);
	}

	// Remove dead particles
	for (var i = this.particles.length - 1; i >= 0; i--)
	{
		if (this.particles[i].life <= 0)
		{
			// Remove the particle
			this.particles.splice(i, 1);
		}			
	}

	// Spawn new particles
	var particlesToSpawn = Math.floor(this.particlesPerSecond * deltaTime);
	var space = this.maxParticles - this.particles.length;
	particlesToSpawn = Math.min(particlesToSpawn, space);
	for (var i = 0; i < particlesToSpawn; i++)
	{
		var def = Math.floor(Math.random() * this.particleDefs.length);
		var particle = this.particleDefs[def].spawn(this.getSpawnPos(worldMtx), this.getEmitDir());
		this.particles.push(particle);
	}
}

function PESpawnPosition(worldMtx)
{
	var spawnPos = vec3.create();
	vec3.transformMat4(spawnPos, this.pos, worldMtx);
	return spawnPos;
}

function PEEmitDir()
{	
	var emitDir = null;

	switch (this.type)
	{
		case "cone":
			var crossVec = vec3.create();
			var randVec = vec3.fromValues(Math.random(), Math.random(), Math.random());
			vec3.normalize(randVec, randVec);
			vec3.cross(crossVec, randVec, this.dir);
			vec3.normalize(crossVec, crossVec);

			var h = Math.cos(this.angle);
			var phi = 2 * Math.PI * Math.random();
			var z = h + (1 - h) * Math.random();
			var sinT = Math.sqrt(1 - z * z);
			var x = Math.cos(phi) * sinT;
			var y = Math.sin(phi) * sinT;

			emitDir = vec3.create();
			vec3.scale(emitDir, randVec, x);
			vec3.scaleAndAdd(emitDir, emitDir, crossVec, y);
			vec3.scaleAndAdd(emitDir, emitDir, this.dir, z);
			break;
		default:
			console.log("Unknown emitter type - " + this.type);
			break;
	}

	return emitDir;
}

function PESort(gl)
{
	switch (this.sortMode)
	{
		case "backToFront":
			// transform all particles into view space
			for (var i = 0; i < this.particles.length; i++)
			{
				vec3.transformMat4(this.particles[i].vp, this.particles[i].pos, gl.view);
			}

			// sort
			this.particles.sort(function (a, b) { return (a.vp[2] - b.vp[2]); });
			break;
		case "frontToBack":
			// transform all particles into view space
			for (var i = 0; i < this.particles.length; i++)
			{
				vec3.transformMat4(this.particles[i].vp, this.particles[i].pos, gl.view);
			}

			// sort
			this.particles.sort(function (a, b) { return (b.vp[2] - a.vp[2]); });
			break;
		case "none":
			break;
		default:
			break;
	}
}

function PEDraw(gl, worldMtx)
{
	// Bind the shader
	pointSpriteShader.bind(gl);

	// Set shader variables
	gl.uniformMatrix4fv(pointSpriteShader.uProj, false, gl.proj);
	gl.uniformMatrix4fv(gl.uMV, false, gl.view);
	gl.uniform3f(pointSpriteShader.uViewUp, gl.view[1], gl.view[5], gl.view[9]);
	gl.uniform3f(pointSpriteShader.uViewRight, gl.view[0], gl.view[4], gl.view[8]);



	// Bind point sprite data
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pointSpriteIndices);
	gl.bindBuffer(gl.ARRAY_BUFFER, pointSpriteCorners);
	gl.enableVertexAttribArray(pointSpriteShader.cornersLocation);
	gl.vertexAttribPointer(pointSpriteShader.cornersLocation, 2, gl.FLOAT, false, 8, 0);

	// Sort particles
	this.sort(gl);

	

	// Draw instances
	if (gl.angleInstArraysExt)
	{
		// Build vertex buffer
		var particleData = [];
		for (var i = 0; i < this.particles.length; i++)
		{
			var particle = this.particles[i];
			particleData.push(particle.pos[0]);
			particleData.push(particle.pos[1]);
			particleData.push(particle.pos[2]);
			particleData.push(particle.size);
			particleData.push(particle.color[0]);
			particleData.push(particle.color[1]);
			particleData.push(particle.color[2]);
			particleData.push(particle.color[3]);
		}

		var particleBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particleData), gl.STATIC_DRAW);

		gl.enableVertexAttribArray(pointSpriteShader.posLocation);
		gl.vertexAttribPointer(pointSpriteShader.posLocation, 4, gl.FLOAT, false, 32, 0);
		gl.angleInstArraysExt.vertexAttribDivisorANGLE(pointSpriteShader.posLocation, 1);

		gl.enableVertexAttribArray(pointSpriteShader.colorLocation);
		gl.vertexAttribPointer(pointSpriteShader.colorLocation, 4, gl.FLOAT, false, 32, 16);
		gl.angleInstArraysExt.vertexAttribDivisorANGLE(pointSpriteShader.colorLocation, 1);

		gl.angleInstArraysExt.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, this.particles.length);
	}
	else
	{
		// Software instancing
		for (var i = 0; i < this.particles.length; i++)
		{
			var particle = this.particles[i];
			gl.uniform4f(pointSpriteShader.posLocation, particle.pos[0], particle.pos[1], particle.pos[2], particle.size);
			gl.uniform4fv(pointSpriteShader.colorLocation, particle.color);

			particle.texture.bind(gl, 0);

			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
		}
	}

	// Cleanup
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function PEDoAssignment(scene, property, propertyValue)
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
		case "pos":
			var vals = propertyValue.split(",");
			this.pos = vec3.fromValues(parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2]));
			break;
		case "dir":
			var vals = propertyValue.split(",");
			this.dir = vec3.fromValues(parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2]));
			vec3.normalize(this.dir, this.dir);
			break;
		case "sortMode":
			this.sortMode = propertyValue;
			break;
		case "angle":
			var deg = parseFloat(propertyValue);
			this.angle = deg * 0.0174532925;
			break;
		case "particlesPerSecond":
			this.particlesPerSecond = parseFloat(propertyValue);
			break;
		case "maxParticles":
			this.maxParticles = parseInt(propertyValue);
			break;
		case "particles":
			var vals = propertyValue.split(",");
			this.particleDefs = [];
			for (var i = 0; i < vals.length; i++)
			{
				var part = scene.getParticle(vals[i], null, false);
				if (part)
					this.particleDefs.push(part);
			}
			break;
		default:
			console.log("ParticleEmitter::doObjectAssignment - unsupported property: " + property);
			result = false;
			break;
	}

	return result;
}

function ParticleEmitter(scene, name, src)
{
	this.name = name;
	this.src = src;

	this.update = PEUpdate;
	this.draw = PEDraw;
	this.getSpawnPos = PESpawnPosition;
	this.getEmitDir = PEEmitDir;
	this.sort = PESort;
	this.toString = PEToString;
	this.doObjectAssignment = PEDoAssignment;

	this.type = "cone";
	this.pos = vec3.create();
	this.dir = vec3.create();
	this.angle = Math.PI / 4;
	this.particlesPerSecond = 100;
	this.maxParticles = 1000;
	this.sortMode = "none";
	this.particleDefs = [];

	this.particles = [];

	if (src)
	{
		var xml = LoadXML(scene.path + src);
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
					case "pos":
						var values = attrib.value.split(",");
						this.pos = vec3.fromValues(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]));
						break;
					case "dir":
						var values = attrib.value.split(",");
						this.dir = vec3.fromValues(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]));
						vec3.normalize(this.dir, this.dir);
						break;
					case "particlesPerSecond":
						this.particlesPerSecond = parseFloat(attrib.value);
						break;
					case "maxParticles":
						this.maxParticles = parseInt(attrib.value);
						break;
					case "angle":
						var deg = parseFloat(attrib.value);
						this.angle = deg * 0.0174532925;
						break;
					case "sortMode":
						this.sortMode = attrib.value;
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
						case "particle":
							var def = scene.getParticle(nodeName, nodeSrc);
							this.particleDefs.push(def);
							break;
						default:
							break;
					}
				}
			}
		}
	}


	InitPointSprites(scene.gl, scene);
}

function PEToString()
{
	var str = "";

	str += "emitter:" + this.name + ";";
	str += this.src + ";";

	str += this.type + ";";
	str += this.pos[0] + "," + this.pos[1] + "," + this.pos[2] + ";";
	str += this.dir[0] + "," + this.dir[1] + "," + this.dir[2] + ";";
	str += this.angle + ";";
	str += this.particlesPerSecond + ";";
	str += this.maxParticles + ";";
	str += this.sortMode + ";";

	for (var i = 0; i < this.particleDefs.length; i++)
	{
		if (i != 0)
			str += ",";
		str += this.particleDefs[i].name;
	}
	str += ";";


	return str;
}