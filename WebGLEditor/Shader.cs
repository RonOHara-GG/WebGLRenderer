using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using OpenTK;
using OpenTK.Graphics.OpenGL;

namespace WebGLEditor
{
    public class Shader : Asset
    {
        public int mvpUniform = 0;
        public int normalUniform = 0;
        public int worldUniform = 0;
        public int shadowMtxUniform = 0;

        public int positionAttribute = 0;
        public int normalAttribute = 0;
        public int uvAttribute = 0;
        public List<int> lightDirs;
        public List<int> lightCols;

        public int lightCount = 0;
        public int maxLights = 0;
        public int lightUpdateToken = 0;

        public int textureCount = 0;


        public Shader(Scene scene, string name, string src)
            : base(scene, name, src)
        {
            lightDirs = new List<int>();
            lightCols = new List<int>();

	        this.shaderProgram = null;
            
            try
	        {
                XmlDocument shaderXML = new XmlDocument();
                shaderXML.Load(src);
                foreach( XmlAttribute attrib in shaderXML.DocumentElement.Attributes )
		        {
			        switch (attrib.Name)
			        {
				        case "maxLights":
					        this.maxLights = Convert.ToInt32(attrib.Value);
					        break;
				        case "textureCount":
					        this.textureCount = Convert.ToInt32(attrib.Value);
				        default:
					        break;
			        }
		        }


		        string vertShaderSrc = null;
		        string fragShaderSrc = null;

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
						        vertShaderSrc = LoadFile(childSrc);
						        break;
					        case "fragshader":
						        fragShaderSrc = LoadFile(childSrc);
						        break;
				        }
			        }
		        }

		        var vs = this.createShader(scene.gl, scene.gl.VERTEX_SHADER, vertShaderSrc);
		        var fs = this.createShader(scene.gl, scene.gl.FRAGMENT_SHADER, fragShaderSrc);

		        if (vs && fs)
		        {
			        this.shaderProgram = this.createShaderProgram(scene.gl, vs, fs);
		        }
	        }
            catch(Exception)
            {
                System.Windows.Forms.MessageBox.Show("Failed to load shader: " + src);
            }

	        if (this.shaderProgram)
	        {
		        this.mvpUniform = scene.gl.getUniformLocation(this.shaderProgram, "uMVPMatrix");
		        this.worldUniform = scene.gl.getUniformLocation(this.shaderProgram, "uWorldMatrix");
		        this.normalUniform = scene.gl.getUniformLocation(this.shaderProgram, "uNormalMatrix");
		        this.shadowMtxUniform = scene.gl.getUniformLocation(this.shaderProgram, "uShadowMatrix");
		        this.positionAttribute = scene.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
		        this.normalAttribute = scene.gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
		        this.uvAttribute = scene.gl.getAttribLocation(this.shaderProgram, "aVertexUV");

		        for (var i = 0; i < this.textureCount; i++ )
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

        function AddLight(light)
        {
	        if( this.lightCount < this.maxLights )
	        {	
		        this.scene.gl.uniform3fv(this.lightDirs[this.lightCount], light.dir);
		        this.scene.gl.uniform3fv(this.lightCols[this.lightCount], light.color);
		        this.lightCount++;
	        }
        }
    }
}
