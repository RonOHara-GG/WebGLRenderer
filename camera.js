function BindCamera(gl)
{
	gl.view = this.view;
	gl.proj = this.proj;
	mat4.mul(gl.viewProj, gl.proj, gl.view);
}

function UpdateCamera(deltaTimeMS)
{
	// Update view matrix
	if( !this.identityView )
		mat4.lookAt(this.view, this.pos, this.target, this.up);
	else
		mat4.identity(this.view);

	if( this.shadowCamera )
	{
		var depthScaleMtx = mat4.create();
		depthScaleMtx[0] = depthScaleMtx[5] = depthScaleMtx[10] = depthScaleMtx[12] = depthScaleMtx[13] = depthScaleMtx[14] = 0.5;
		this.shadowMatrix = mat4.create();
		mat4.mul(this.shadowMatrix, this.proj, this.view);
		mat4.mul(this.shadowMatrix, depthScaleMtx, this.shadowMatrix);
	}
}

function BuildProjectionMatrix(aspectRatio)
{
	if (this.ortho)
	{
		mat4.ortho(this.proj, this.left, this.right, this.bottom, this.top, this.near, this.far);
	}
	else
	{
		mat4.perspective(this.proj, this.fov * 0.0174532925, aspectRatio, this.near, this.far);
	}
}

function ResizeCamera(aspectRatio)
{
	if( !this.static )
	{
		this.buildProj(aspectRatio);
	}
}

function Camera(scene, name, src)
{
	this.scene = scene;
	this.name = name;
	this.src = src;

	this.bind = BindCamera;
	this.update = UpdateCamera;
	this.resize = ResizeCamera;
	this.buildProj = BuildProjectionMatrix;

	this.pos = vec3.create();
	this.target = vec3.create();
	this.up = vec3.fromValues(0.0, 1.0, 0.0);
	this.ortho = false;
	this.static = false;
	this.fov = 45;
	this.near = 1.0;
	this.far = 1.0;
	this.proj = mat4.create();
	this.view = mat4.create();
	this.left = 0;
	this.right = 0;
	this.top = 0;
	this.bottom = 0;
	this.shadowLight = null;
	this.shadowDistance = 100;
	this.identityView = false;
	this.shadowCamera = false;
	this.shadowMatrix = null;

	cameraXML = LoadXML(src);
	if (cameraXML)
	{
		for (var i = 0; i < cameraXML.documentElement.attributes.length; i++)
		{
			var attrib = cameraXML.documentElement.attributes[i];
			switch (attrib.name)
			{
				case "ortho":
					this.ortho = (attrib.value == "true");
					break;
				case "fov":
					this.fov = parseFloat(attrib.value);
					break;
				case "near":
					this.near = parseFloat(attrib.value);
					break;
				case "far":
					this.far = parseFloat(attrib.value);
					break;
				case "left":
					this.left = parseFloat(attrib.value);
					break;
				case "right":
					this.right = parseFloat(attrib.value);
					break;
				case "top":
					this.top = parseFloat(attrib.value);
					break;
				case "bottom":
					this.bottom = parseFloat(attrib.value);
					break;
				case "static":
					this.static = (attrib.value == "true");
					break;
				case "shadowDistance":
					this.shadowDistance = parseFloat(attrib.value);
					break;
				case "identityView":
					this.identityView = (attrib.value === "true");
				default:
					break;
			}
		}

		children = cameraXML.documentElement.childNodes;
		for (var i = 0; i < children.length; i++)
		{
			if (children[i].nodeType == 1)
			{
				if (children[i].nodeName == "position")
				{
					var posX = parseFloat(children[i].attributes.getNamedItem("x").value);
					var posY = parseFloat(children[i].attributes.getNamedItem("y").value);
					var posZ = parseFloat(children[i].attributes.getNamedItem("z").value);
					this.pos = vec3.fromValues(posX, posY, posZ);
				}
				else if (children[i].nodeName == "lookAt")
				{
					var lookAtX = parseFloat(children[i].attributes.getNamedItem("x").value);
					var lookAtY = parseFloat(children[i].attributes.getNamedItem("y").value);
					var lookAtZ = parseFloat(children[i].attributes.getNamedItem("z").value);
					this.target = vec3.fromValues(lookAtX, lookAtY, lookAtZ);
				}
				else if (children[i].nodeName == "up")
				{
					var upX = parseFloat(children[i].attributes.getNamedItem("x").value);
					var upY = parseFloat(children[i].attributes.getNamedItem("y").value);
					var upZ = parseFloat(children[i].attributes.getNamedItem("z").value);
					this.up = vec3.fromValues(upX, upY, upZ);
				}
				else if (children[i].nodeName == "shadowLight")
				{
					this.shadowLight = scene.getLight(children[i].attributes.getNamedItem("name").value, children[i].attributes.getNamedItem("src").value);
				}
			}
		}
	}


	if( this.shadowLight )
	{
		this.shadowCamera = true;
		switch( this.shadowLight.type )
		{
			case "dir":
				var temp = vec3.create();
				vec3.scale(temp, this.shadowLight.dir, -this.shadowDistance);
				vec3.add(this.pos, this.target, temp);
				break;
			default:
				break;
		}
	}

	if( this.static )
		this.buildProj(1);
}