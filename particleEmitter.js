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

		pointSpriteShader = scene.getShader("pointSpriteShader", "./pointSpriteShader.xml");
		pointSpriteShader.uProj = gl.getUniformLocation(pointSpriteShader.shaderProgram, "uPMatrix");
		pointSpriteShader.uViewUp = gl.getUniformLocation(pointSpriteShader.shaderProgram, "uViewUp");
		pointSpriteShader.uViewRight = gl.getUniformLocation(pointSpriteShader.shaderProgram, "uViewRight");
		pointSpriteShader.cornersLocation = gl.getAttribLocation(pointSpriteShader.shaderProgram, "aCornerNormal");
		pointSpriteShader.posLocation = gl.getAttribLocation(pointSpriteShader.shaderProgram, "aSpritePosition");
		pointSpriteShader.colorLocation = gl.getAttribLocation(pointSpriteShader.shaderProgram, "aSpriteColor");
	}
}

function PEUpdate(deltaTime)
{
	// Update all particles
	for (var i = 0; i < this.particles.length; i++)
	{
		this.particles[i].update(deltaTime);
	}

	// Remove dead particles
	for (var i = this.particles.length - 1; i > 0; i--)
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
	particlesToSpawn = math.Min(particlesToSpawn, space);
	for (var i = 0; i < particlesToSpawn; i++)
	{
		var def = Math.floor(Math.random() * this.particleDefs.length);
		var particle = this.particleDefs[def].spawn(this.getSpawnPos(), this.getEmitDir());
		this.particles.push(particle);
	}
}

function PESpawnPosition()
{
	return this.pos;
}

function PEEmitDir()
{	
	var emitDir = null;

	switch (this.type)
	{
		case "cone":
			var crossVec = vec3.create();
			var randVec = vec3.fromValues(Math.random(), Math.random(), Math.Random());
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

function PEDraw(gl, worldMtx)
{
	// Bind the shader
	pointSpriteShader.bind(gl);

	// Set shader variables
	gl.uniformMatrix4fv(pointSpriteShader.uProj, false, gl.proj);
	gl.uniform3f(pointSpriteShader.uViewUp, gl.view[1], gl.view[5], gl.view[9]);
	gl.uniform3f(pointSpriteShader.uViewRight, gl.view[0], gl.view[4], gl.view[8]);

	var mv = mat4.create();
	mat4.mul(mv, gl.view, worldMtx);
	gl.uniformMatrix4fv(gl.uMV, false, mv);



	// Bind point sprite data
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pointSpriteIndices);
	gl.bindBuffer(gl.ARRAY_BUFFER, pointSpriteCorners);
	gl.enableVertexAttribArray(pointSpriteShader.cornersLocation);
	gl.vertexAttribPointer(pointSpriteShader.cornersLocation, 2, gl.FLOAT, false, 8, 0);

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

	// Draw instances
	gl.angleInstArraysExt.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, this.particles.length);

	// Cleanup
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function ParticleEmitter(scene, name, src)
{
	this.name = name;
	this.src = src;

	this.update = PEUpdate;
	this.draw = PEDraw;
	this.getSpawnPos = PESpawnPosition;
	this.getEmitDir = PEEmitDir;

	this.type = "cone";
	this.pos = vec3.create();
	this.dir = vec3.create();
	this.particleDefs = [];

	this.particles = [];

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
					case "type":
						this.type = attrib.value;
						break;
					case "pos":
						var values = attrib.value.split(",");
						this.pos = vec3.fromValues(values[0], values[1], values[2]);
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