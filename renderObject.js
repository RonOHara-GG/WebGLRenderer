function RenderObject(scene, name, src)
{
	this.scene = scene;
	this.name = name;
	this.src = src;

	this.mesh = null;
	this.pos = null;
	this.rot = null;

	roXML = LoadXML(src);
	if( roXML )
	{
		pos = roXML.documentElement.attributes.getNamedItem("pos").value;
		this.pos = new Vector3(pos);
		rot = roXML.documentElement.attributes.getNamedItem("rot").value;
		this.rot = new Quat(rot);

		var children = roXML.documentElement.childNodes;
		for( var i = 0; i < children.length; i++ )
		{
			if( children[i].nodeType == 1 )
			{
				var nodeName = children[i].attributes.getNamedItem("name").value;
				var nodeSrc = children[i].attributes.getNamedItem("src").value;
				if( children[i].nodeName == "mesh" )
				{
					this.mesh = scene.getMesh(nodeName, nodeSrc);
				}
			}
		}
	}
}