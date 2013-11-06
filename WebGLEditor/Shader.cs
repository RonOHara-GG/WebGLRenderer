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
        public int viewUniform = 0;
        public int projUniform = 0;
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
					        maxLights = Convert.ToInt32(attrib.Value);
					        break;
				        case "textureCount":
					        textureCount = Convert.ToInt32(attrib.Value);
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
			        shaderProgram = CreateShaderProgram(vs, fs);
		        }
	        }
            catch(Exception)
            {
                System.Windows.Forms.MessageBox.Show("Failed to load shader: " + src);
            }

	        if (shaderProgram > 0)
	        {
		        mvpUniform = GL.GetUniformLocation(shaderProgram, "uMVPMatrix");
		        worldUniform = GL.GetUniformLocation(shaderProgram, "uWorldMatrix");
                viewUniform = GL.GetUniformLocation(shaderProgram, "uViewMatrix");
                projUniform = GL.GetUniformLocation(shaderProgram, "uProjMatrix");
		        normalUniform = GL.GetUniformLocation(shaderProgram, "uNormalMatrix");
		        shadowMtxUniform = GL.GetUniformLocation(shaderProgram, "uShadowMatrix");
		        positionAttribute = GL.GetAttribLocation(shaderProgram, "aVertexPosition");
		        normalAttribute = GL.GetAttribLocation(shaderProgram, "aVertexNormal");
		        uvAttribute = GL.GetAttribLocation(shaderProgram, "aVertexUV");

		        for (var i = 0; i < textureCount; i++ )
		        {
			        int texSampler = GL.GetUniformLocation(shaderProgram, "texture" + i);
                    GL.Uniform1(texSampler, i);
		        }	

		        for (var i = 0; i < maxLights; i++)
		        {
			        int lightDir = GL.GetUniformLocation(shaderProgram, "uLightDir" + i);
			        int lightCol = GL.GetUniformLocation(shaderProgram, "uLightColor" + i);

			        lightDirs.Add(lightDir);
			        lightCols.Add(lightCol);
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
                System.Windows.Forms.MessageBox.Show("Failed to create shader program: " + name);
                GL.DeleteProgram(prg);
                prg = 0;
            }

            return prg;
        }

        public void Bind(GLContext gl)
        {
	        if( gl.overrideShader == null)
	        {
                GL.UseProgram(shaderProgram);

		        gl.shaderPositionLocation = positionAttribute;
		        gl.shaderNormalLocation = normalAttribute;
		        gl.shaderUVLocattion = uvAttribute;

		        gl.uMVP = mvpUniform;
		        gl.uNrmMtx = normalUniform;
		        gl.uWorldMtx = worldUniform;
                gl.uViewMtx = viewUniform;
                gl.uProjMtx = projUniform;
		        gl.uShadowMtx = shadowMtxUniform;
	        }
        }

        public void BindOverride(GLContext gl)
        {
	        UnbindOverride(gl);
	        Bind(gl);
	        gl.overrideShader = this;
        }

        public void UnbindOverride(GLContext gl)
        {
	        gl.overrideShader = null;
        }

        public void AddLight(Light light)
        {
	        if( lightCount < maxLights )
	        {	
                GL.Uniform3(lightDirs[lightCount], light.dir);
                GL.Uniform3(lightCols[lightCount], light.color);
		        lightCount++;
	        }
        }
    }
}
