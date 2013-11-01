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
        public int shaderProgram = 0;

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
                            break;
				        default:
					        break;
			        }
		        }


		        string vertShaderSrc = null;
		        string fragShaderSrc = null;

                foreach( XmlNode child in shaderXML.DocumentElement.ChildNodes)
		        {
			        if (child.NodeType == XmlNodeType.Element)
			        {
				        string childName = child.Attributes.GetNamedItem("name").Value;
				        string childSrc = child.Attributes.GetNamedItem("src").Value;
				        switch (child.Name)
				        {
					        case "vertshader":
						        vertShaderSrc = Program.LoadTextFile(childSrc);
						        break;
					        case "fragshader":
						        fragShaderSrc = Program.LoadTextFile(childSrc);
						        break;
				        }
			        }
		        }

		        int vs = CreateShader(ShaderType.VertexShader, vertShaderSrc);
		        int fs = CreateShader(ShaderType.FragmentShader, fragShaderSrc);

		        if (vs > 0 && fs > 0)
		        {
			        this.shaderProgram = CreateShaderProgram(vs, fs);
		        }
	        }
            catch(Exception)
            {
                System.Windows.Forms.MessageBox.Show("Failed to load shader: " + src);
            }

	        if (this.shaderProgram > 0)
	        {
		        this.mvpUniform = GL.GetUniformLocation(this.shaderProgram, "uMVPMatrix");
		        this.worldUniform = GL.GetUniformLocation(this.shaderProgram, "uWorldMatrix");
		        this.normalUniform = GL.GetUniformLocation(this.shaderProgram, "uNormalMatrix");
		        this.shadowMtxUniform = GL.GetUniformLocation(this.shaderProgram, "uShadowMatrix");
		        this.positionAttribute = GL.GetAttribLocation(this.shaderProgram, "aVertexPosition");
		        this.normalAttribute = GL.GetAttribLocation(this.shaderProgram, "aVertexNormal");
		        this.uvAttribute = GL.GetAttribLocation(this.shaderProgram, "aVertexUV");

		        for (var i = 0; i < this.textureCount; i++ )
		        {
			        int texSampler = GL.GetUniformLocation(this.shaderProgram, "texture" + i);
                    GL.Uniform1(texSampler, i);
		        }	

		        for (var i = 0; i < this.maxLights; i++)
		        {
			        int lightDir = GL.GetUniformLocation(this.shaderProgram, "uLightDir" + i);
			        int lightCol = GL.GetUniformLocation(this.shaderProgram, "uLightColor" + i);

			        this.lightDirs.Add(lightDir);
			        this.lightCols.Add(lightCol);
		        }
	        }
        }

        int CreateShader(ShaderType type, string src)
        {            
            int shader = GL.CreateShader(type);
            GL.ShaderSource(shader, src);
            GL.CompileShader(shader);

            int compileResult;
            GL.GetShader(shader, ShaderParameter.CompileStatus, out compileResult);
            if( compileResult != 1 )
            {
                System.Windows.Forms.MessageBox.Show("shader compile error(" + name + "): " + GL.GetShaderInfoLog(shader));
                GL.DeleteShader(shader);
                shader = 0;
            }

            return shader;
        }

        int CreateShaderProgram(int vs, int fs)
        {
            int prg = GL.CreateProgram();
            GL.AttachShader(prg, vs);
            GL.AttachShader(prg, fs);
            GL.LinkProgram(prg);
            int linkStatus;
            GL.GetProgram(prg, ProgramParameter.LinkStatus, out linkStatus);
            if( linkStatus != 1 )
            {
                System.Windows.Forms.MessageBox.Show("Failed to create shader program: " + this.name);
                GL.DeleteProgram(prg);
                prg = 0;
            }

            return prg;
        }

        public void Bind(GLContext gl)
        {
	        if( gl.overrideShader <= 0)
	        {
                GL.UseProgram(shaderProgram);

		        gl.shaderPositionLocation = this.positionAttribute;
		        gl.shaderNormalLocation = this.normalAttribute;
		        gl.shaderUVLocattion = this.uvAttribute;

		        gl.uMVP = this.mvpUniform;
		        gl.uNrmMtx = this.normalUniform;
		        gl.uWorldMtx = this.worldUniform;
		        gl.uShadowMtx = this.shadowMtxUniform;
	        }
        }

        public void BindOverride(GLContext gl)
        {
	        this.UnbindOverride(gl);
	        this.Bind(gl);
	        gl.overrideShader = this;
        }

        public void UnbindOverride(GLContext gl)
        {
	        gl.overrideShader = null;
        }

        public void AddLight(Light light)
        {
	        if( this.lightCount < this.maxLights )
	        {	
                GL.Uniform3(lightDirs[lightCount], light.dir);
                GL.Uniform3(lightCols[lightCount], light.color);
		        this.lightCount++;
	        }
        }
    }
}
