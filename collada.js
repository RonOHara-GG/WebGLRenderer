function Collada_FloatArray(fa)
{
	this.id = fa.attributes.getNamedItem("id").value;
	this.count = fa.attributes.getNamedItem("count").value;
	this.floats = [];

	var floatData = fa.textContent.split(" ");
	for (var j = 0; j < floatData.length; j++)
	{
		this.floats.push(parseFloat(floatData[j]));
	}
}

function Collada_Param(param)
{
	this.name = param.attributes.getNamedItem("name").value;
	this.type = param.attributes.getNamedItem("type").value;
}

function Collada_Accessor(acc)
{
	this.source = acc.attributes.getNamedItem("source").value;
	this.count = acc.attributes.getNamedItem("count").value;
	this.stride = acc.attributes.getNamedItem("stride").value;
	this.params = [];

	for (var i = 0; i < acc.childNodes.length; i++)
	{
		var child = acc.childNodes[i];
		if (child.nodeType == 1)
		{
			if (child.nodeName == "param")
			{
				var param = new Collada_Param(child);
				this.params.push(param);
			}
		}
	}
}

function Collada_TechniqueCommon(tc)
{
	this.accessor = null;

	for (var j = 0; j < tc.childNodes.length; j++)
	{
		var child = tc.childNodes[j];
		if (child.nodeType == 1)
		{
			switch (child.nodeName)
			{
				case "accessor":
					this.accessor = new Collada_Accessor(child);
					break;
				default:
					break;
			}
		}
	}
}

function Collada_MeshSrc(source)
{
	this.id = source.attributes.getNamedItem("id").value;
	this.float_array = null;
	this.technique_common = null;

	for (var i = 0; i < source.childNodes.length; i++)
	{
		var child = source.childNodes[i];
		if (child.nodeType == 1)
		{
			switch (child.nodeName)
			{
				case "float_array":
					this.float_array = new Collada_FloatArray(child);
					break;
				case "technique_common":
					this.technique_common = new Collada_TechniqueCommon(child);
					break;
				default:
					break;
			}
		}
	}
}

function Collada_Input(input, mesh)
{
	this.semantic = input.attributes.getNamedItem("semantic").value;
	var sourceName = input.attributes.getNamedItem("source").value.substring(1);
	
	this.offset = 0;
	var offsetAttrib = input.attributes.getNamedItem("offset");
	if (offsetAttrib)
		this.offset = parseInt(offsetAttrib.value);
	this.source = null;
	
	if( mesh )
	{
		if( mesh.vertices && mesh.vertices.id == sourceName )
		{
			this.source = mesh.vertices.input.source;
		}
		else
		{
			for( var i = 0; i < mesh.sources.length; i++ )
			{
				if( mesh.sources[i].id == sourceName )
					this.source = mesh.sources[i];
			}
		}
	}
}

function Collada_Vertices(verts, mesh)
{
	this.id = verts.attributes.getNamedItem("id").value;
	this.input = null;
	
	for (var j = 0; j < verts.childNodes.length; j++)
	{
		var child = verts.childNodes[j];
		if (child.nodeType == 1)
		{
			if( child.nodeName == "input" )
			{
				this.input = new Collada_Input(child, mesh);		
			}
		}
	}
}

function Collada_Triangles(tri, mesh)
{
	this.material = tri.attributes.getNamedItem("material").value;
	this.count = tri.attributes.getNamedItem("count").value;
	this.inputs = [];
	this.p = [];

	for( var i = 0; i < tri.childNodes.length; i++ )
	{
		var child = tri.childNodes[i];
		if( child.nodeType == 1 )
		{
			switch( child.nodeName )
			{
				case "input":
					var input = new Collada_Input(child, mesh);
					this.inputs.push(input);
					break;
				case "p":
					var parray = child.textContent.split(" ");
					for( var j = 0; j < parray.length; j++ )
					{
						this.p.push(parseFloat(parray[j]));
					}
					break;
				default:
					break;
			}
		}
	}
}

function Collada_LoadMesh(mesh)
{
	this.sources = [];
	this.vertices = null;
	this.triangles = null;

	for (var i = 0; i < mesh.childNodes.length; i++)
	{
		var child = mesh.childNodes[i];
		if (child.nodeType == 1)
		{
			switch (child.nodeName)
			{
				case "source":
					var src = new Collada_MeshSrc(child);
					this.sources.push(src);
					break;
				case "vertices":
					this.vertices = new Collada_Vertices(child, this);
					break;
				case "triangles":
					this.triangles = new Collada_Triangles(child, this);
					break;
				default:
					break;
			}
		}
	}
}

function Collada_LoadGeometry(geom)
{
	this.meshes = [];
	this.id = geom.attributes.getNamedItem("id").value;
	this.name = geom.attributes.getNamedItem("name").value;

	for (var i = 0; i < geom.childNodes.length; i++)
	{
		var child = geom.childNodes[i];
		if (child.nodeType == 1)
		{
			switch (child.nodeName)
			{
				case "mesh":
					var mesh = new Collada_LoadMesh(child);
					this.meshes.push(mesh);
					break;
				default:
					break;
			}
		}
	}
}

function Collada_LoadGeometries(library_geometries)
{
	for (var i = 0; i < library_geometries.childNodes.length; i++)
	{
		var child = library_geometries.childNodes[i];
		if (child.nodeType == 1)
		{
			switch (child.nodeName)
			{
				case "geometry":
					var geom = new Collada_LoadGeometry(child);
					this.geoms.push(geom);
					break;
				default:
					break;
			}
		}
	}
}

function Collada_LoadMaterial(mat)
{
	this.id = mat.attributes.getNamedItem("id").value;
	this.name = mat.attributes.getNamedItem("name").value;
	this.instance_effect_url = null;

	for( var i = 0; i < mat.childNodes.length; i++ )
	{
		var child = mat.childNodes[i];
		if( child.nodeType == 1 )
		{
			if( child.nodeName == "instance_effect" )
				this.instance_effect_url = child.attributes.getNamedItem("url").value;
		}
	}
}

function Collada_LoadMaterials(library_materials)
{
	for( var i = 0; i < library_materials.childNodes.length; i++ )
	{
		var child = library_materials.childNodes[i];
		if( child.nodeType == 1 )
		{
			if( child.nodeName == "material" )
			{
				var mat = new Collada_LoadMaterial(child);
				this.materials.push(mat);
			}
		}
	}
}

function Collada_LoadSurface(surface)
{
	this.type = surface.attributes.getNamedItem("type").value;
	this.init_from = null;
	this.format = null;

	for( var i = 0; i < surface.childNodes.length; i++ )
	{
		var child = surface.childNodes[i];
		if( child.nodeType == 1 )
		{
			switch( child.nodeName )
			{
				case "init_from":
					this.init_from = child.textContent;
					break;
				case "format":
					this.format = child.textContent;
					break;
				default:
					break;
			}
		}
	}
}

function Collada_LoadSampler2D(sampler)
{
	this.source = null;
	this.wrap_s = null;
	this.wrap_t = null;
	this.minfilter = null;
	this.magfilter = null;
	this.mipfilter = null;

	for( var i = 0; i < sampler.childNodes.length; i++ )
	{
		var child = sampler.childNodes[i];
		if( child.nodeType == 1 )
		{
			switch( child.nodeName )
			{
				case "source":
					this.source = child.textContent;
					break;
				case "wrap_s":
					this.wrap_s = child.textContent;
					break;
				case "wrap_t":
					this.wrap_t = child.textContent;
					break;
				case "minfilter":
					this.minfilter = child.textContent;
					break;
				case "magfilter":
					this.magfilter = child.textContent;
					break;
				case "mipfilter":
					this.mipfilter = child.textContent;
					break;
				default:
					break;
			}
		}
	}
}

function Collada_LoadNewParam(newparam)
{
	this.sid = newparam.attributes.getNamedItem("sid").value;
	this.surface = null;
	this.sampler2D = null;

	for( var i = 0; i < newparam.childNodes.length; i++ )
	{
		var child = newparam.childNodes[i];
		if( child.nodeType == 1 )
		{
			switch( child.nodeName )
			{
				case "surface":
					this.surface = new Collada_LoadSurface(child);
					break;
				case "sampler2D":
					this.sampler2D = new Collada_LoadSampler2D(child);
					break;
				default:
					break;
			}
		}
	}
}

function Collada_LoadEmission(emission)
{
	this.color = [];

	for( var i = 0; i < emission.childNodes.length; i++ )
	{
		var child = emission.childNodes[i];
		if( child.nodeType == 1)
		{
			if( child.nodeName == "color" )
			{
				var colorvals = child.textContent.split(" ");
				for( var j = 0; j < colorvals.length; j++ )
				{
					this.color.push(parseFloat(colorvals[j]));
				}
			}
		}
	}
}

function Collada_LoadAmbient(amb)
{
	this.color = [];

	for( var i = 0; i < amb.childNodes.length; i++ )
	{
		var child = amb.childNodes[i];
		if( child.nodeType == 1)
		{
			if( child.nodeName == "color" )
			{
				var colorvals = child.textContent.split(" ");
				for( var j = 0; j < colorvals.length; j++ )
				{
					this.color.push(parseFloat(colorvals[j]));
				}
			}
		}
	}
}

function Collada_LoadTexture(tex)
{
	this.texture = tex.attributes.getNamedItem("texture").value;
	this.texcoord = tex.attributes.getNamedItem("texcoord").value;
}

function Collada_LoadDiffuse(diff)
{
	this.texture = null;

	for( var i = 0; i < diff.childNodes.length; i++ )
	{
		var child = diff.childNodes[i];
		if( child.nodeType == 1)
		{
			if( child.nodeName == "texture" )
			{
				this.texture = new Collada_LoadTexture(child);
			}
		}
	}
}

function Collada_LoadSpecular(spec)
{
	this.color = [];

	for( var i = 0; i < spec.childNodes.length; i++ )
	{
		var child = spec.childNodes[i];
		if( child.nodeType == 1)
		{
			if( child.nodeName == "color" )
			{
				var colorvals = child.textContent.split(" ");
				for( var j = 0; j < colorvals.length; j++ )
				{
					this.color.push(parseFloat(colorvals[j]));
				}
			}
		}
	}
}

function Collada_LoadShininess(shiny)
{
	this.float = null;

	for( var i = 0; i < shiny.childNodes.length; i++ )
	{
		var child = shiny.childNodes[i];
		if( child.nodeType == 1)
		{
			if( child.nodeName == "float" )
			{
				this.float = parseFloat(child.textContent);
			}
		}
	}
}

function Collada_LoadReflective(reflect)
{
	this.color = [];

	for( var i = 0; i < reflect.childNodes.length; i++ )
	{
		var child = reflect.childNodes[i];
		if( child.nodeType == 1)
		{
			if( child.nodeName == "color" )
			{
				var colorvals = child.textContent.split(" ");
				for( var j = 0; j < colorvals.length; j++ )
				{
					this.color.push(parseFloat(colorvals[j]));
				}
			}
		}
	}
}

function Collada_LoadReflectivity(reflect)
{
	this.float = null;

	for( var i = 0; i < reflect.childNodes.length; i++ )
	{
		var child = reflect.childNodes[i];
		if( child.nodeType == 1)
		{
			if( child.nodeName == "float" )
			{
				this.float = parseFloat(child.textContent);
			}
		}
	}
}

function Collada_LoadTransparent(trans)
{
	this.opaque = trans.attributes.getNamedItem("opaque").value;
	this.color = [];

	for( var i = 0; i < trans.childNodes.length; i++ )
	{
		var child = trans.childNodes[i];
		if( child.nodeType == 1)
		{
			if( child.nodeName == "color" )
			{
				var colorvals = child.textContent.split(" ");
				for( var j = 0; j < colorvals.length; j++ )
				{
					this.color.push(parseFloat(colorvals[j]));
				}
			}
		}
	}
}

function Collada_LoadTransparency(trans)
{
	this.float = null;

	for( var i = 0; i < trans.childNodes.length; i++ )
	{
		var child = trans.childNodes[i];
		if( child.nodeType == 1)
		{
			if( child.nodeName == "float" )
			{
				this.float = parseFloat(child.textContent);
			}
		}
	}
}

function Collada_LoadBlinn(blinn)
{
	this.emission = null;
	this.ambient = null;
	this.diffuse = null;
	this.specular = null;
	this.shininess = null;
	this.reflective = null;
	this.reflectivity = null;
	this.transparent = null;
	this.transparency = null;

	for( var i = 0; i < blinn.childNodes.length; i++ )
	{
		var child = blinn.childNodes[i];
		if( child.nodeType == 1 )
		{
			switch( child.nodeName )
			{
				case "emission":
					this.emission = new Collada_LoadEmission(child);
					break;
				case "ambient":
					this.ambient = new Collada_LoadAmbient(child);
					break;
				case "diffuse":
					this.diffuse = new Collada_LoadDiffuse(child);
					break;
				case "specular":
					this.specular = new Collada_LoadSpecular(child);
					break;
				case "shininess":
					this.shininess = new Collada_LoadShininess(child);
					break;
				case "reflective":
					this.reflective = new Collada_LoadReflective(child);
					break;
				case "reflectivity":
					this.reflectivity = new Collada_LoadReflectivity(child);
					break;
				case "transparent":
					this.transparent = new Collada_LoadTransparent(child);
					break;
				case "transparency":
					this.transparency = new Collada_LoadTransparency(child);
					break;
				default:
					break;
			}
		}
	}
}

function Collada_LoadEffectTechnique(tech)
{
	this.sid = tech.attributes.getNamedItem("sid");
	this.blinn = null;

	for( var i = 0; i < tech.childNodes.length; i++ )
	{
		var child = tech.childNodes[i];
		if( child.nodeType == 1 )
		{
			if( child.nodeName == "blinn" )
			{
				this.blinn = new Collada_LoadBlinn(child);
			}
		}
	}
}

function Collada_LoadEffectProfile(prof)
{
	this.newparams = [];
	this.technique = null;

	for( var i = 0; i < prof.childNodes.length; i++ )
	{
		var child = prof.childNodes[i];
		if( child.nodeType == 1 )
		{
			if( child.nodeName == "newparam" )
			{
				var newparam = new Collada_LoadNewParam(child);
				this.newparams.push(newparam);
			}
			else if( child.nodeName == "technique" )
			{
				this.technique = new Collada_LoadEffectTechnique(child);
			}
		}
	}
}

function Collada_LoadEffect(effect)
{
	this.id = effect.attributes.getNamedItem("id").value;
	this.profile_COMMON = null;

	for( var i = 0; i < effect.childNodes.length; i++ )
	{
		var child = effect.childNodes[i];
		if( child.nodeType == 1 )
		{
			if( child.nodeName == "profile_COMMON" )
			{
				this.profile_COMMON = new Collada_LoadEffectProfile(child);
			}
		}
	}
}

function Collada_LoadEffects(effects)
{
	for( var i = 0; i < effects.childNodes.length; i++ )
	{
		var child = effects.childNodes[i];
		if( child.nodeType == 1 )
		{
			if( child.nodeName == "effect" )
			{
				var effect = new Collada_LoadEffect(child);
				this.effects.push(effect);
			}
		}
	}
}


function ColladaFile(filename)
{
	this.loadGeometries = Collada_LoadGeometries;
	this.loadMaterials = Collada_LoadMaterials;
	this.loadEffects = Collada_LoadEffects;

	this.geoms = [];
	this.materials = [];
	this.effects = [];

	this.version;

	var cxml = LoadXML(filename);
	if (cxml)
	{
		this.version = cxml.documentElement.attributes.getNamedItem("version").value;

		for (var i = 0; i < cxml.documentElement.childNodes.length; i++)
		{
			var child = cxml.documentElement.childNodes[i];
			if( child.nodeType == 1 )
			{
				switch(child.nodeName)
				{
					case "asset":
						break;
					case "library_effects":
						this.loadEffects(child);
						break;
					case "library_materials":
						this.loadMaterials(child);
						break;
					case "library_geometries":
						this.loadGeometries(child);
						break;
					case "library_controllers":
						break;
					case "library_lights":
						break;
					case "library_images":
						break;
					case "library_visual_scenes":
						break;
					case "scene":
						break;
					default:
						break;
				}
			}
		}
	}
	
}