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
            textures = new List<Texture>();

            pos = new Vector3(0, 0, 0);
            rot = new Quaternion(0, 0, 0, 1.0f);
            scale = new Vector3(1.0f, 1.0f, 1.0f);
            worldMatrix = new Matrix4();

            try
	        {
                XmlDocument roXML = new XmlDocument();
                roXML.Load(src);

                foreach( XmlAttribute attrib in roXML.DocumentElement.Attributes )
                {
			        if( attrib.Name == "pos")
                    {
					    string[] values = attrib.Value.Split(',');
					    pos = new Vector3(Convert.ToSingle(values[0]), Convert.ToSingle(values[1]), Convert.ToSingle(values[2]));
					}
                    else if( attrib.Name == "rot")
                    {
					    string[] values = attrib.Value.Split(',');
                        rot = new Quaternion(Convert.ToSingle(values[0]), Convert.ToSingle(values[1]), Convert.ToSingle(values[2]), Convert.ToSingle(values[3]));
					}
				    else if( attrib.Name == "scale" )
                    {
					    string[] values = attrib.Value.Split(',');
                        scale = new Vector3(Convert.ToSingle(values[0]), Convert.ToSingle(values[1]), Convert.ToSingle(values[2]));
                    }
				    else if( attrib.Name == "update" )
                    {
					    updateCallback = Program.TheForm.FindUpdateFunction(attrib.Value);
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
					        mesh = scene.GetMesh(nodeName, nodeSrc);
				        }
				        else if (child.Name == "shader")
				        {
					        shader = scene.GetShader(nodeName, nodeSrc);
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

						        FrameBuffer fb = scene.GetFrameBuffer(nodeName, null);
						        if( fb != null )
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
											
					        if( tex != null )
					        {						
						        var texIndex = 0;
						        XmlAttribute index = (XmlAttribute)child.Attributes.GetNamedItem("texIndex");
						        if( index != null)
							        texIndex = Convert.ToInt32(index.Value);

                                while (textures.Count <= texIndex)
                                    textures.Add(null);
						        textures[texIndex] = tex;
					        }
				        }
				        else if (child.Name == "shadowCamera")
				        {
					        shadowCamera = scene.GetCamera(nodeName, nodeSrc);
				        }
			        }
		        }
	        }
            catch(Exception e)
            {
                System.Windows.Forms.MessageBox.Show("Failed to load render object: " + src + "\r\n" + e.Message);
            }

	        UpdateWorldMatrix();
        }

        public void Update(float deltaTimeMS)
        {
	        if (updateCallback != null)
	        {
		        updateCallback(this, deltaTimeMS);
	        }
        }

        public void Draw(GLContext gl)
        {
	        // Bind shader
	        shader.Bind(gl);

	        // Update shader params
	        if( gl.uMVP >= 0 )
	        {
                Matrix4 mvp = Matrix4.Mult(worldMatrix, gl.viewProj);
		        GL.UniformMatrix4(gl.uMVP, false, ref mvp);
	        }

	        if( gl.uWorldMtx >= 0 )
	        {
                GL.UniformMatrix4(gl.uWorldMtx, false, ref worldMatrix);
	        }

            if (gl.uViewMtx >= 0)
            {
                GL.UniformMatrix4(gl.uViewMtx, false, ref gl.view);
            }

            if (gl.uProjMtx >= 0)
            {
                GL.UniformMatrix4(gl.uProjMtx, false, ref gl.proj);
            }
	
	        if( gl.uNrmMtx >= 0 )
	        {
                GL.UniformMatrix3(gl.uNrmMtx, 1, false, normalMatrix);
	        }

	        if( shadowCamera != null && gl.uShadowMtx > 0 )
	        {
                GL.UniformMatrix4(gl.uShadowMtx, false, ref shadowCamera.shadowMatrix);
	        }

	        // Bind Textures
	        for( var i = 0; i < textures.Count; i++ )
	        {
		        if( textures[i] != null )
		        {
			        textures[i].Bind(i);
		        }
	        }

	        // Draw mesh
	        if (mesh != null)
	        {
		        mesh.Draw(gl);
	        }
        }

        public void UpdateWorldMatrix()
        {
            Matrix4 trans = Matrix4.CreateTranslation(pos);
            worldMatrix = Matrix4.Mult(Matrix4.Mult(Matrix4.Rotate(rot), trans), Matrix4.Scale(scale));

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
