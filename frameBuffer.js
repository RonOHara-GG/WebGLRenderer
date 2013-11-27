function BindFrameBuffer(gl)
{
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
}

function FrameBuffer(scene, name, src)
{
	//this.scene = scene;
	this.name = name;
	this.src = src;

	this.bind = BindFrameBuffer
	this.save = SaveFrameBuffer;

	this.width = 0;
	this.height = 0;
	this.colorFormat = "RGBA32";
	this.colorTexture = null;
	this.depthTexture = null;
	this.frameBuffer = null;

	fbXML = LoadXML(src);
	if (fbXML)
	{
		this.width = parseInt(fbXML.documentElement.attributes.getNamedItem("width").value);
		this.height = parseInt(fbXML.documentElement.attributes.getNamedItem("height").value);
		this.colorFormat = fbXML.documentElement.attributes.getNamedItem("colorFormat").value;


		var gl = scene.gl;
		
		this.colorTexture = scene.getTexture(this.name + "_color", "frameBuffer");
		this.colorTexture.width = this.width;
		this.colorTexture.height = this.height;
		this.colorTexture.create(gl.RGBA, gl.UNSIGNED_BYTE, null);

		this.depthTexture = scene.getTexture(this.name + "_depth", "frameBuffer");
		this.depthTexture.width = this.width;
		this.depthTexture.height = this.height;
		this.depthTexture.format = gl.DEPTH_COMPONENT;
		this.depthTexture.create(gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
	
		this.frameBuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTexture.glTexture, 0);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture.glTexture, 0);


		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
}

function SaveFrameBuffer(path)
{
	var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\n";

	xml += "<frameBuffer name=\"" + this.name + "\" width=\"" + this.width + "\" height=\"" + this.height + "\" colorFormat=\"" + this.colorFormat + "\" depthFormat=\"" + this.depthFormat + "\"/>";

	SaveFile(path + this.src, xml);
}