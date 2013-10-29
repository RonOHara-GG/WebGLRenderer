function BindFrameBuffer(gl)
{
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
}

function FrameBuffer(scene, name, src)
{
	this.scene = scene;
	this.name = name;
	this.src = src;

	this.bind = BindFrameBuffer

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
		/*
		this.colorTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.colorTexture);	
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		this.depthTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

	
		this.frameBuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTexture, 0);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
		*/
		
		this.colorTexture = scene.getTexture(this.name + "_color", null);
		this.colorTexture.width = this.width;
		this.colorTexture.height = this.height;
		this.colorTexture.create(gl.RGBA, gl.UNSIGNED_BYTE, null);

		this.depthTexture = scene.getTexture(this.name + "_depth", null);
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