//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PlaneCollider
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function PCUpdate(worldMtx)
{
	vec3.transformMat4(this.worldPt, this.point, worldMtx);

	// Rotate normal into world space
	var rotM = mat3.create();
	mat3.fromMat4(rotM, worldMtx);
	vec3.transformMat3(this.worldNormal, this.normal, rotM);
	vec3.normalize(this.worldNormal, this.worldNormal);
}

function PlaneCollide(pointA, pointB, outPos, outVel)
{
	var collision = false;

	// intersect line with plane
	var seg = vec3.create();
	vec3.sub(seg, pointB, pointA);

	var denom = vec3.dot(this.worldNormal, seg);
	if (denom != 0)
	{
		var ptOnPlane = vec3.create();
		vec3.sub(ptOnPlane, this.worldPt, pointA);

		var nume = vec3.dot(this.worldNormal, ptOnPlane);
		var r = nume / denom;

		if (r > 0 && r < 1)
		{
			collision = true;
			vec3.scaleAndAdd(outPos, pointA, seg, r);
			vec3.scale(outVel, this.worldNormal, this.bounce);
		}
	}

	return collision;
}

function PlaneCollider(pointStrs, bounce)
{
	this.collide = PlaneCollide;
	this.update = PCUpdate;

	this.bounce = bounce;
	this.point = vec3.fromValues(parseFloat(pointStrs[0]), parseFloat(pointStrs[1]), parseFloat(pointStrs[2]));
	this.normal = vec3.fromValues(parseFloat(pointStrs[3]), parseFloat(pointStrs[4]), parseFloat(pointStrs[5]));

	this.worldPt = vec3.create();
	this.worldNormal = vec3.create();

	vec3.normalize(this.normal, this.normal);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TriangleCollider
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function TCUpdate(worldMtx)
{
	// Transform points into world space
	for (var i = 0; i < this.points.length; i++)
	{
		var worldPt = vec3.create();
		vec3.transformMat4(worldPt, this.points[i], worldMtx);
		this.worldPts[i] = worldPt;
	}

	// Rotate normal into world space
	var rotM = mat3.create();
	mat3.fromMat4(rotM, worldMtx);
	vec3.transformMat3(this.worldNormal, this.normal, rotM);
	vec3.normalize(this.worldNormal, this.worldNormal);
}

function TriangleCollide(pointA, pointB, outPos, outVel)
{
	var collision = false;

	// intersect line with triangle
	var seg = vec3.create();
	vec3.sub(seg, pointB, pointA);

	var denom = vec3.dot(this.worldNormal, seg);
	if (denom != 0)
	{
		var ptOnPlane = vec3.create();
		vec3.sub(ptOnPlane, this.worldPts[0], pointA);

		var nume = vec3.dot(this.worldNormal, ptOnPlane);
		var r = nume / denom;

		if (r > 0 && r < 1)
		{
			// This segment intersects the plane, now check the triangle specifically
			var isect = vec3.create();
			vec3.scaleAndAdd(isect, pointA, seg, r);

			var u = vec3.create();
			var v = vec3.create();
			var w = vec3.create();
			vec3.sub(u, this.worldPts[1], this.worldPts[0]);
			vec3.sub(v, this.worldPts[2], this.worldPts[0]);
			vec3.sub(w, isect, this.worldPts[0]);

			var uu = vec3.dot(u, u);
			var vv = vec3.dot(v, v);
			var uv = vec3.dot(u, v);
			var wu = vec3.dot(w, u);
			var wv = vec3.dot(w, v);

			denom = (uv * uv) - (uu * vv);

			nume = (uv * wv) - (vv * wu);
			var s = nume / denom;

			nume = (uv * wu) - (uu * wv);
			var t = nume / denom;

			if (s >= 0 && t >= 0 && s + t <= 1)
			{
				// Intersection inside the triangle
				collision = true;
				vec3.scale(outVel, this.worldNormal, this.bounce);
				vec3.scaleAndAdd(outPos, isect, this.worldNormal, 0.1);
			}
		}
	}

	return collision;
}

function TraingleCollider(pointStrs, bounce)
{
	this.collide = TriangleCollide;
	this.update = TCUpdate;

	this.bounce = bounce;
	this.points = [];
	this.normal = vec3.create();

	this.worldPts = [];
	this.worldNormal = vec3.create();

	for (var i = 0; i < pointStrs.length; i += 3)
	{
		var point = vec3.fromValues(parseFloat(pointStrs[i]), parseFloat(pointStrs[i + 1]), parseFloat(pointStrs[i + 2]));
		this.points.push(point);
	}

	var edge01 = vec3.create();
	var edge02 = vec3.create();

	vec3.sub(edge01, this.points[1], this.points[0]);
	vec3.sub(edge02, this.points[2], this.points[1]);
	vec3.cross(this.normal, edge02, edge01);
	vec3.normalize(this.normal, this.normal);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ParticleSystem
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function PSUpdate(deltaTimeMS, worldMtx)
{
	var seconds = deltaTimeMS / 1000;

	// Update all colliders
	for (var i = 0; i < this.colliders.length; i++)
	{
		this.colliders[i].update(worldMtx);
	}

	// Update all emitters
	for (var i = 0; i < this.emitters.length; i++)
	{
		this.emitters[i].update(seconds, worldMtx, this.forces, this.colliders);
	}
}

function PSDraw(gl, worldMtx)
{
	for (var i = 0; i < this.emitters.length; i++)
	{
		this.emitters[i].draw(gl, worldMtx);
	}
}

function ParticleSystem(scene, name, src)
{
	this.name = name;
	this.src = src;

	this.emitters = [];
	this.forces = [];
	this.colliders = [];

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
					switch (children[i].nodeName)
					{
						case "particleEmitter":
							var nodeName = children[i].attributes.getNamedItem("name").value;
							var nodeSrc = children[i].attributes.getNamedItem("src").value;
							var emitter = scene.getParticleEmitter(nodeName, nodeSrc);
							this.emitters.push(emitter);
							break;
						case "force":
							var forceVals = children[i].textContent.split(",");
							var force = vec3.fromValues(parseFloat(forceVals[0]), parseFloat(forceVals[1]), parseFloat(forceVals[2]));
							this.forces.push(force);
							break;
						case "triangleCollider":
							var bounce = children[i].attributes.getNamedItem("bounce").value;
							var points = children[i].textContent.split(",");
							var collider = new TraingleCollider(points, parseFloat(bounce));
							this.colliders.push(collider);
							break;
						case "planeCollider":
							var bounce = children[i].attributes.getNamedItem("bounce").value;
							var points = children[i].textContent.split(",");
							var collider = new PlaneCollider(points, parseFloat(bounce));
							this.colliders.push(collider);
							break;
						default:
							break;
					}
				}
			}
		}
	}
}