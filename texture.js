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

function TexInitVideo(gl)
{
	this.glTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
}

function TexUpdate(deltaTimeMS)
{
	if ((this.type == "video" || this.type == "youtube") && this.image.playing)
	{
		var gl = TheScene.gl;
		gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, this.format, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
	}
}

function TextureLoaded(tex)
{
	var gl = tex.scene.gl;
	tex.glTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex.glTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, tex.format, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, tex.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, tex.minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, tex.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, tex.wrapT);

    console.log("Loaded " + tex.src + "(" + tex.type + ")");
}

function BindTexture(gl, texIndex)
{
	gl.activeTexture(gl.TEXTURE0 + texIndex);
	gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
}

function TexLoadFromSource(scene)
{
	if (this.src && this.src != "frameBuffer")
	{
		var pieces = this.src.split(";");
		var srcIndex = 0;
		if (pieces.length > 1)
		{
			this.type = pieces[0];
			srcIndex++;
		}

		var srcUrl = scene.path + pieces[srcIndex];
		if (this.type == "youtube")
		{
			srcUrl = getYoutubeURL(srcUrl);
		}

		console.log("Loading " + srcUrl + "(" + this.type + ")");
		var name = this.name;
		this.image = LoadImage(srcUrl, function () { TextureLoaded(TheScene.getTexture(name, null)); }, this.type);

		if (this.type == "video" || this.type == "youtube")
		{
			this.initVideo(scene.gl);
		}
	}
}

function Texture(scene, name, src)
{
	this.scene = scene;
	this.name = name;
	this.src = src;

	this.bind = BindTexture;
	this.create = CreateTexture;
	this.save = SaveTexture;
	this.toString = TextureToString;
	this.doObjectAssignment = TextureDoAssignment;
	this.initVideo = TexInitVideo;
	this.update = TexUpdate;
	this.loadSource = TexLoadFromSource;

	this.width = 0;
	this.height = 0;
	this.format = scene.gl.RGBA;
	this.minFilter = scene.gl.LINEAR;
	this.magFilter = scene.gl.NEAREST;
	this.wrapS = scene.gl.CLAMP_TO_EDGE;
	this.wrapT = scene.gl.CLAMP_TO_EDGE;
	this.glTexture = null;
	this.type = "image";

	this.loadSource(scene);
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
			this.loadSource(scene);
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
	var str = "texture:" + this.name + ";";
	str += this.src + ";";

	return str;
}

function SaveTexture(path)
{
	// For now, I am not saving textures.  This will need to get implemented
}