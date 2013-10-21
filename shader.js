function CreateShader(gl, type, src)
{
	var shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
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
}

function Shader(scene, name, src)
{
	this.scene = scene;
	this.name = name;
	this.src = src;

	this.bind = BindShader;

	this.shaderProgram = null;
	this.mvpUniform = 0;

	shaderXML = LoadXML(src);
	if (shaderXML)
	{
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
						vertShaderSrc = LoadFile(src);
						break;
					case "fragshader":
						fragShaderSrc = LoadFile(src);
						break;
				}
			}
		}

		var vs = CreateShader(scene.gl, scene.gl.VERTEX_SHADER, vertShaderSrc);
		var fs = CreateShader(scene.gl, scene.gl.FRAGMENT_SHADER, fragShaderSrc);

		if (vs && fs)
		{
			this.shaderProgram = CreateShaderProgram(scene.gl, vs, fs);
		}
	}

	if (this.shaderProgram)
	{
		this.mvpUniform = scene.gl.getUniformLocation(this.shaderProgram, "uMVPMatrix");
	}
}