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

function InitShaderProgram(gl, vsCode, fsCode)
{
	var vs = this.createShader(gl, gl.VERTEX_SHADER, vsCode);
	var fs = this.createShader(gl, gl.FRAGMENT_SHADER, fsCode);

	if (vs && fs)
	{
		this.shaderProgram = this.createShaderProgram(gl, vs, fs);
	}
}

function InitShaderParams()
{
	if (this.shaderProgram)
	{
		this.mvpUniform = scene.gl.getUniformLocation(this.shaderProgram, "uMVPMatrix");
		this.worldUniform = scene.gl.getUniformLocation(this.shaderProgram, "uWorldMatrix");
		this.normalUniform = scene.gl.getUniformLocation(this.shaderProgram, "uNormalMatrix");
		this.shadowMtxUniform = scene.gl.getUniformLocation(this.shaderProgram, "uShadowMatrix");
		this.positionAttribute = scene.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
		this.normalAttribute = scene.gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
		this.uvAttribute = scene.gl.getAttribLocation(this.shaderProgram, "aVertexUV");

		for (var i = 0; i < this.textureCount; i++)
		{
			var texSampler = scene.gl.getUniformLocation(this.shaderProgram, "texture" + i);
			gl.uniform1i(texSampler, i);
		}

		for (var i = 0; i < this.maxLights; i++)
		{
			var lightDir = scene.gl.getUniformLocation(this.shaderProgram, "uLightDir" + i);
			var lightCol = scene.gl.getUniformLocation(this.shaderProgram, "uLightColor" + i);

			this.lightDirs.push(lightDir);
			this.lightCols.push(lightCol);
		}
	}
}

function BindShader(gl)
{
	if( !gl.overrideShader )
	{
		gl.useProgram(this.shaderProgram);

		gl.shaderPositionLocation = this.positionAttribute;
		gl.shaderNormalLocation = this.normalAttribute;
		gl.shaderUVLocattion = this.uvAttribute;

		gl.uMVP = this.mvpUniform;
		gl.uNrmMtx = this.normalUniform;
		gl.uWorldMtx = this.worldUniform;
		gl.uShadowMtx = this.shadowMtxUniform;
	}
}

function BindOverrideShader(gl)
{
	this.unbindOverride(gl);
	this.bind(gl);
	gl.overrideShader = this;
}

function UnbindOverrideShader(gl)
{
	gl.overrideShader = null;
}

function AddLight(light, scene)
{
	if( this.lightCount < this.maxLights )
	{	
		scene.gl.uniform3fv(this.lightDirs[this.lightCount], light.dir);
		scene.gl.uniform3fv(this.lightCols[this.lightCount], light.color);
		this.lightCount++;
	}
}

function Shader(scene, name, src)
{
	//this.scene = scene;
	this.name = name;
	this.src = src;

	this.bind = BindShader;
	this.bindOverride = BindOverrideShader
	this.unbindOverride = UnbindOverrideShader
	this.addLight = AddLight;
	this.createShader = CreateShader;
	this.createShaderProgram = CreateShaderProgram;
	this.save = SaveShader;
	this.initShaderProgram = InitShaderProgram;
	this.initShaderParams = InitShaderParams;

	this.shaderProgram = null;

	this.mvpUniform = 0;
	this.normalUniform = 0;
	this.worldUniform = 0;
	this.shadowMtxUniform = 0;
	this.positionAttribute = 0;
	this.normalAttribute = 0;
	this.uvAttribute = 0;
	this.lightDirs = [];
	this.lightCols = [];

	this.vsName = null;
	this.fsName = null;
	this.vsSrc = null;
	this.fsSrc = null;
	this.vertShaderSrc = null;
	this.fragShaderSrc = null;

	this.lightCount = 0;
	this.maxLights = 0;
	this.lightUpdateToken = 0;

	this.textureCount = 0;
	
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
				case "textureCount":
					this.textureCount = parseInt(attrib.value);
				default:
					break;
			}
		}

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
						this.vsName = childName;
						this.vsSrc = childSrc;
						this.vertShaderSrc = LoadFile(childSrc);
						break;
					case "fragshader":
						this.fsName = childName;
						this.fsSrc = childSrc;
						this.fragShaderSrc = LoadFile(childSrc);
						break;
				}
			}
		}

		this.initShaderProgram(scene.gl, this.vertShaderSrc, this.fragShaderSrc);

		if (!EditorName)
		{
			this.vertShaderSrc = null;
			this.fragShaderSrc = null;
		}
	}

	this.initShaderParams();
}

function SaveShader(path)
{
	var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\n";

	xml += "<shader name=\"" + this.name + "\" maxLights=\"" + this.maxLights + "\" textureCount=\"" + this.textureCount + "\">\n";
	xml += "\t<vertshader name=\"" + this.vsName + "\" src=\"" + this.vsSrc + "\"/>\n";
	xml += "\t<fragshader name=\"" + this.fsName + "\" src=\"" + this.fsSrc + "\"/>\n";
	xml += "</shader>";

	SaveFile(path + this.src, xml);

	// Save the shader files too
	if (EditorName)
	{
		SaveFile(path + this.vsSrc, this.vertShaderSrc);
		SaveFile(path + this.fsSrc, this.fragShaderSrc);
	}
}