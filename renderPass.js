function RenderPass(name, src)
{
	this.renderObjects = [];

	this.name = name;
	this.src = src;

	// Set defaults
	this.sortMode = "none";
	this.clearMode = "none";
	this.clearColorRed = 0;
	this.clearColorGreen = 0;
	this.clearColorBlue = 0;
	this.clearDepth = 1;
	this.clearStencil = 0;

	// Load the source
	rpXML = LoadXML(src);
	if (rpXML)
	{
		// Get the attribute properties

	}
}