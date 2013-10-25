
function DoUpdatePass(deltaTimeMS)
{
	// Update cameras
	for( var i = 0; i < this.cameras.length; i++ )
	{
		this.cameras[i].update(deltaTimeMS);
	}

	// Update render objects
	for (var i = 0; i < this.renderObjects.length; i++)
	{
		this.renderObjects[i].update(deltaTimeMS);
	}
	
	// Update all lights
	for( var i = 0; i < this.lights.length; i++ )
	{
		this.lights[i].update(deltaTimeMS);
	}
}

function UpdatePass(scene, name, src)
{
	this.renderObjects = [];
	this.lights = [];
	this.cameras = [];

	this.scene = scene;
	this.name = name;
	this.src = src;

	
	this.update = DoUpdatePass
}