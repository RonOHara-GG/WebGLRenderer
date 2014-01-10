function CreateShader(gl, type, src)
{
	var shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		console.log("shader compile error(" + this.name + "): " + gl.getShaderInfoLog(shader) + "\n\n" + src);
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
		console.log("Failed to create shader program: " + this.name);
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

function InitShaderParams(gl)
{
	if (this.shaderProgram)
	{
		this.mvpUniform = gl.getUniformLocation(this.shaderProgram, "uMVPMatrix");
		this.mvUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
		this.worldUniform = gl.getUniformLocation(this.shaderProgram, "uWorldMatrix");
		this.normalUniform = gl.getUniformLocation(this.shaderProgram, "uNormalMatrix");
		this.shadowMtxUniform = gl.getUniformLocation(this.shaderProgram, "uShadowMatrix");
		this.positionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
		this.normalAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
		this.uvAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexUV");
		this.wfAttribute = gl.getAttribLocation(this.shaderProgram, "aWFAttribute");

		this.bind(gl);
		for (var i = 0; i < this.textureCount; i++)
		{
			var texSampler = gl.getUniformLocation(this.shaderProgram, "texture" + i);
			gl.uniform1i(texSampler, i);
		}

		for (var i = 0; i < this.maxDLights; i++)
		{
			var lightDir = gl.getUniformLocation(this.shaderProgram, "uDLightDir" + i);
			var lightCol = gl.getUniformLocation(this.shaderProgram, "uDLightColor" + i);

			this.dLightDirs.push(lightDir);
			this.dLightCols.push(lightCol);
		}

		for (var i = 0; i < this.maxPLights; i++)
		{
			var lightPos = gl.getUniformLocation(this.shaderProgram, "uPLightPos" + i);
			var lightCol = gl.getUniformLocation(this.shaderProgram, "uPLightColor" + i);

			this.pLightPoss.push(lightPos);
			this.pLightCols.push(lightCol);
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
		gl.shaderWFLocation = this.wfAttribute;

		gl.uMVP = this.mvpUniform;
		gl.uMV = this.mvUniform;
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
	if (light.type == "dir")
	{
		if (this.dLightCount < this.maxDLights)
		{
			scene.gl.uniform3fv(this.dLightDirs[this.dLightCount], light.dir);
			scene.gl.uniform3fv(this.dLightCols[this.dLightCount], light.color);
			this.dLightCount++;
		}
	}
	else if (light.type == "point")
	{
		if (this.pLightCount < this.maxPLights)
		{
			scene.gl.uniform3fv(this.pLightPoss[this.pLightCount], light.pos);
			scene.gl.uniform3fv(this.pLightCols[this.pLightCount], light.color);
			scene.gl.uniform3fv(this.pLightAtts[this.pLightCount], light.attenuation);
			this.pLightCount++;
		}
	}
	else
	{
		console.log("Unsupported light type - " + light.type);
	}
}

function ShaderDoAssignment(scene, property, propertyValue)
{
	var result = false;

	switch (property)
	{
		case "name":
			this.name = propertyValue;
			result = true;
			break;
		case "src":
			this.src = propertyValue;
			result = true;
			break;
		case "vs":
			var source = LoadFile(propertyValue);
			if (source)
			{
				this.vsSrc = propertyValue;
				this.vertShaderSrc = source;
				result = true;

				if (this.vertShaderSrc && this.fragShaderSrc)
				{
					this.initShaderProgram(scene.gl, this.vertShaderSrc, this.fragShaderSrc);
					this.initShaderParams(scene.gl);
				}
			}
			break;
		case "fs":
			var source = LoadFile(propertyValue);
			if (source)
			{
				this.fsSrc = propertyValue;
				this.fragShaderSrc = source;
				result = true;

				if (this.vertShaderSrc && this.fragShaderSrc)
				{
					this.initShaderProgram(scene.gl, this.vertShaderSrc, this.fragShaderSrc);
					this.initShaderParams(scene.gl);
				}
			}
			break;
		case "maxDLights":
			this.maxDLights = parseInt(propertyValue);
			result = true;
			break;
		case "maxPLights":
			this.maxPLights = parseInt(propertyValue);
			result = true;
			break;
		case "textureCount":
			this.textureCount = parseInt(propertyValue);
			result = true;
			break;
		default:
			console.log("Shader::doObjectAssignment - unsupported property: " + property);
			break;
	}

	return result;
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
	this.toString = ShaderToString;
	this.doObjectAssignment = ShaderDoAssignment;

	this.shaderProgram = null;

	this.mvpUniform = 0;
	this.mvUniform = 0;
	this.normalUniform = 0;
	this.worldUniform = 0;
	this.shadowMtxUniform = 0;
	this.positionAttribute = 0;
	this.normalAttribute = 0;
	this.uvAttribute = 0;
	this.wfAttribute = -1;
	this.dLightDirs = [];
	this.dLightCols = [];
	this.pLightPoss = [];
	this.pLightCols = [];
	this.pLightAtts = [];

	this.vsName = null;
	this.fsName = null;
	this.vsSrc = null;
	this.fsSrc = null;
	this.vertShaderSrc = null;
	this.fragShaderSrc = null;

	this.dLightCount = 0;
	this.pLightCount = 0;
	this.maxDLights = 0;
	this.maxPLights = 0;
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
				case "maxDLights":
					this.maxDLights = parseInt(attrib.value);
					break;
				case "maxPLights":
					this.maxPLights = parseInt(attrib.value);
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

		if (this.vertShaderSrc && this.fragShaderSrc)
			this.initShaderProgram(scene.gl, this.vertShaderSrc, this.fragShaderSrc);

		if (!EditorName)
		{
			this.vertShaderSrc = null;
			this.fragShaderSrc = null;
		}
	}

	if( scene )
		this.initShaderParams(scene.gl);
}

function ShaderToString()
{
	var str = this.name + ";";
	str += this.src + ";";
	str += this.maxDLights + ";";
	str += this.maxPLights + ";";
	str += this.textureCount + ";";
	str += this.vsSrc + ";";
	str += this.fsSrc + ";";

	return str;
}

function SaveShader(path)
{
	var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\n";

	xml += "<shader name=\"" + this.name + "\" maxDLights=\"" + this.maxDLights + "\" maxPLights=\"" + this.maxPLights + "\" textureCount=\"" + this.textureCount + "\">\n";
	xml += "\t<vertshader name=\"" + this.vsName + "\" src=\"" + this.vsSrc + "\"/>\n";
	xml += "\t<fragshader name=\"" + this.fsName + "\" src=\"" + this.fsSrc + "\"/>\n";
	xml += "</shader>";

	SaveFile(path + this.src, xml);

	// Save the shader files too
	if (EditorName)
	{
		if (this.vertShaderSrc )
			SaveFile(path + this.vsSrc, this.vertShaderSrc);
		if (this.fragShaderSrc)
			SaveFile(path + this.fsSrc, this.fragShaderSrc);
	}
}