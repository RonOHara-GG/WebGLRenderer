function BindCamera(gl)
{
	gl.view = this.view;
	gl.proj = this.proj;
	mat4.mul(gl.viewProj, gl.proj, gl.view);
}

function UpdateCamera(deltaTimeMS)
{
	// Update view matrix
	mat4.lookAt(this.view, this.pos, this.target, this.up);
}

function ResizeCamera(aspectRatio)
{
	if (this.ortho)
	{
		mat4.ortho(this.proj, this.left, this.right, this.bottom, this.top, this.near, this.far);
	}
	else
	{
		mat4.perspective(this.proj, this.fov, aspectRatio, this.near, this.far);
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

			}
		}
	}
}