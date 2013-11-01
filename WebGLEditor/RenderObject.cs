using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using OpenTK;
using OpenTK.Graphics.OpenGL;

namespace WebGLEditor
{
    public class RenderObject : Asset
    {
        public delegate void UpdateCallback(RenderObject obj, float deltaTimeMS);

        public Mesh mesh = null;
        public Shader shader = null;
        public Vector3 pos;
        public Quaternion rot;
        public Vector3 scale;
        public Matrix4 worldMatrix;
        public float[] normalMatrix = null;
        public List<Texture> textures = null;
        public Camera shadowCamera = null;
        public UpdateCallback updateCallback = null;


        public RenderObject(Scene scene, string name, string src) : base(scene, name, src)
        {
            this.pos = new Vector3(0, 0, 0);
            this.rot = new Quaternion(0, 0, 0, 1.0f);
            this.scale = new Vector3(1.0f, 1.0f, 1.0f);
            this.worldMatrix = new Matrix4();

            try
	        {
                XmlDocument roXML = new XmlDocument();
                roXML.Load(src);

                foreach( XmlAttribute attrib in roXML.DocumentElement.Attributes )
                {
			        if( attrib.Name == "pos")
                    {
					    string[] values = attrib.Value.Split(',');
					    this.pos = new Vector3(values[0][0], values[0][1], values[0][2]);
					}
                    else if( attrib.Name == "rot")
                    {
					    string[] values = attrib.Value.Split(',');
                        this.rot = new Quaternion(values[0][0], values[0][1], values[0][2], values[0][3]);
					}
				    else if( attrib.Name == "scale" )
                    {
					    string[] values = attrib.Value.Split(',');
                        this.scale = new Vector3(values[0][0], values[0][1], values[0][2]);
                    }
				    else if( attrib.Name == "update" )
                    {
					    this.updateCallback = Program.TheForm.FindUpdateFunction(attrib.Value);
					}
		        }

                foreach( XmlNode child in roXML.DocumentElement.ChildNodes )
		        {
			        if( child.NodeType == XmlNodeType.Element )
			        {
				        string nodeName = child.Attributes.GetNamedItem("name").Value;
				        string nodeSrc = child.Attributes.GetNamedItem("src").Value;
				        if (child.Name == "mesh")
				        {
					        this.mesh = scene.GetMesh(nodeName, nodeSrc);
				        }
				        else if (child.Name == "shader")
				        {
					        this.shader = scene.GetShader(nodeName, nodeSrc);
				        }
				        else if (child.Name == "texture")
				        {
					        Texture tex = null;
					        if( nodeSrc == "frameBuffer" )
					        {
						        var depthTexture = false;
						        XmlAttribute dtAttr = (XmlAttribute)child.Attributes.GetNamedItem("depthTexture");
						        if( dtAttr != null )
							        depthTexture = (dtAttr.Value == "true");

						        var fb = scene.GetFrameBuffer(nodeName, null);
						        if( fb )
						        {
							        if( depthTexture )
								        tex = fb.depthTexture;
							        else
								        tex = fb.colorTexture;
						        }
					        }
					        else
					        {
						        // Normal texture
						        tex = scene.GetTexture(nodeName, nodeSrc);
					        }
											
					        if( tex )
					        {						
						        var texIndex = 0;
						        XmlAttribute index = (XmlAttribute)child.Attributes.GetNamedItem("texIndex");
						        if( index != null)
							        texIndex = Convert.ToInt32(index.Value);

						        this.textures[texIndex] = tex;
					        }
				        }
				        else if (child.Name == "shadowCamera")
				        {
					        this.shadowCamera = scene.GetCamera(nodeName, nodeSrc);
				        }
			        }
		        }
	        }
            catch(Exception)
            {
                System.Windows.Forms.MessageBox.Show("Failed to load render object: " + src);
            }

	        this.UpdateWorldMatrix();
        }

        public void Update(float deltaTimeMS)
        {
	        if (updateCallback != null)
	        {
		        updateCallback(this, deltaTimeMS);
	        }
        }

        void Draw(GLContext gl)
        {
	        // Bind shader
	        this.shader.Bind();

	        // Update shader params
	        if( gl.uMVP )
	        {
		        Matrix4 mvp = Matrix4.Mult(gl.viewProj, this.worldMatrix);
		        GL.UniformMatrix4(gl.uMVP, false, mvp);
	        }

	        if( gl.uWorldMtx )
	        {
                GL.UniformMatrix4(gl.uWorldMtx, false, this.worldMatrix);
	        }
	
	        if( gl.uNrmMtx )
	        {
                GL.UniformMatrix3(gl.uNrmMtx, false, this.normalMatrix);
	        }

	        if( this.shadowCamera && gl.uShadowMtx )
	        {
		        gl.uniformMatrix4fv(gl.uShadowMtx, false, this.shadowCamera.shadowMatrix);
	        }

	        // Bind Textures
	        for( var i = 0; i < this.textures.Count; i++ )
	        {
		        if( this.textures[i] != null )
		        {
			        this.textures[i].bind(gl, i);
		        }
	        }

	        // Draw mesh
	        if (this.mesh)
	        {
		        this.mesh.draw(gl);
	        }
        }

        public void UpdateWorldMatrix()
        {
            this.worldMatrix = Matrix4.Mult(Matrix4.Mult(Matrix4.Rotate(rot), Matrix4.Translation(pos)), Matrix4.Scale(scale));

            if (normalMatrix == null)
                normalMatrix = new float[9];
            normalMatrix[0] = worldMatrix.M11;
            normalMatrix[1] = worldMatrix.M12;
            normalMatrix[2] = worldMatrix.M13;
            normalMatrix[3] = worldMatrix.M21;
            normalMatrix[4] = worldMatrix.M22;
            normalMatrix[5] = worldMatrix.M23;
            normalMatrix[6] = worldMatrix.M31;
            normalMatrix[7] = worldMatrix.M32;
            normalMatrix[8] = worldMatrix.M33;
        }
    }
}
