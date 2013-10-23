function CreateShader(gl, type, src)
{
	var shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		alert("shader compile error(" + this.name + "): " + gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

function CreateShaderProgram(gl, vs, fs)
{
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vs);
	gl.attachShader(shaderProgram, fs);
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
	{
		alert("Failed to create shader program: " + this.name);
		return null;
	}
	return shaderProgram;
}

function BindShader(gl)
{
	gl.useProgram(this.shaderProgram);

	gl.shaderPositionLocation = this.positionAttribute;
	gl.shaderNormalLocation = this.normalAttribute;
}

function SetMVP(gl, mvp)
{
	gl.uniformMatrix4fv(this.mvpUniform, false, mvp);
}

function SetNormalMatrix(gl, mtx)
{
	gl.uniformMatrix3fv(this.normalUniform, false, mtx);
}

function AddLight(light)
{
	if( this.lightCount < this.maxLights )
	{	
		this.scene.gl.uniform3fv(this.lightDirs[this.lightCount], light.dir);
		this.scene.gl.uniform3fv(this.lightCols[this.lightCount], light.color);
		this.lightCount++;
	}
}

function Shader(scene, name, src)
{
	this.scene = scene;
	this.name = name;
	this.src = src;

	this.bind = BindShader;
	this.setMVP = SetMVP;
	this.setNormalMatrix = SetNormalMatrix;
	this.addLight = AddLight;
	this.createShader = CreateShader;
	this.createShaderProgram = CreateShaderProgram;

	this.shaderProgram = null;

	this.mvpUniform = 0;
	this.normalUniform = 0;
	this.positionAttribute = 0;
	this.normalAttribute = 0;
	this.lightDirs = [];
	this.lightCols = [];

	this.lightCount = 0;
	this.maxLights = 0;
	this.lightUpdateToken = 0;

	shaderXML = LoadXML(src);
	if (shaderXML)
	{
		for (var i = 0; i < shaderXML.documentElement.attributes.length; i++)
		{
			var attrib = shaderXML.documentElement.attributes[i];
			switch (attrib.name)
			{
				case "maxLights":
					this.maxLights = parseInt(attrib.value);
					break;
				default:
					break;
			}
		}


		var vertShaderSrc = null;
		var fragShaderSrc = null;

		var children = shaderXML.documentElement.childNodes;
		for (var i = 0; i < children.length; i++)
		{
			if (children[i].nodeType == 1)
			{
				var childName = children[i].attributes.getNamedItem("name").value;
				var childSrc = children[i].attributes.getNamedItem("src").value;
				switch (children[i].nodeName)
				{
					case "vertshader":
						vertShaderSrc = LoadFile(childSrc);
						break;
					case "fragshader":
						fragShaderSrc = LoadFile(childSrc);
						break;
				}
			}
		}

		var vs = this.createShader(scene.gl, scene.gl.VERTEX_SHADER, vertShaderSrc);
		var fs = this.createShader(scene.gl, scene.gl.FRAGMENT_SHADER, fragShaderSrc);

		if (vs && fs)
		{
			this.shaderProgram = this.createShaderProgram(scene.gl, vs, fs);
		}
	}

	if (this.shaderProgram)
	{
		this.mvpUniform = scene.gl.getUniformLocation(this.shaderProgram, "uMVPMatrix");
		this.normalUniform = scene.gl.getUniformLocation(this.shaderProgram, "uNormalMatrix");
		this.positionAttribute = scene.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
		this.normalAttribute = scene.gl.getAttribLocation(this.shaderProgram, "aVertexNormal");

		for (var i = 0; i < this.maxLights; i++)
		{
			var lightDir = scene.gl.getUniformLocation(this.shaderProgram, "uLightDir" + i);
			var lightCol = scene.gl.getUniformLocation(this.shaderProgram, "uLightColor" + i);

			this.lightDirs.push(lightDir);
			this.lightCols.push(lightCol);
		}
	}
}