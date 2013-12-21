function CreateTexture(srcFormat, srcType, srcData)
{
	this.glTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.glTexture);	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
	gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.width, this.height, 0, srcFormat, srcType, srcData);
}

function TextureLoaded(tex)
{
	var gl = tex.scene.gl;
	tex.glTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex.glTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, tex.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, tex.minFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, tex.wrapS);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, tex.wrapT);
    gl.texImage2D(gl.TEXTURE_2D, 0, tex.format, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
}

function BindTexture(gl, texIndex)
{
	gl.activeTexture(gl.TEXTURE0 + texIndex);
	gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
}

function Texture(scene, name, src)
{
	//this.scene = scene;
	this.name = name;
	this.src = src;

	this.bind = BindTexture;
	this.create = CreateTexture;
	this.save = SaveTexture;
	this.toString = TextureToString;
	this.doObjectAssignment = TextureDoAssignment;

	this.width = 0;
	this.height = 0;
	this.format = scene.gl.RGBA;
	this.minFilter = scene.gl.NEAREST;
	this.magFilter = scene.gl.NEAREST;
	this.wrapS = scene.gl.CLAMP_TO_EDGE;
	this.wrapT = scene.gl.CLAMP_TO_EDGE;
	this.glTexture = null;

	if (src && src != "frameBuffer")
	{
		this.image = new Image();
		this.image.onload = function() { 
			TextureLoaded(TheScene.getTexture(name, null)); 
		};
		this.image.src = src;
	}
}

function TextureDoAssignment(scene, property, propertyValue)
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
		default:
			console.log("Texture::doObjectAssignment - unsupported property: " + property);
			result = false;
			break;
	}

	return result;
}

function TextureToString()
{
	var str = this.name + ";";
	str += this.src + ";";

	return str;
}

function SaveTexture(path)
{
	// For now, I am not saving textures.  This will need to get implemented
}