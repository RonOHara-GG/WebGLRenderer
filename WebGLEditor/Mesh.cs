using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using OpenTK;
using OpenTK.Graphics.OpenGL;

namespace WebGLEditor
{
    public class Mesh : Asset
    {
        public int vb = 0;
        public int ib = 0;
        public int triangleCount = 0;
        public int vertCount = 0;
        public string vertFormat;

        public Mesh(Scene scene, string name, string src)
            : base(scene, name, src)
        {
            try
	        {
                XmlDocument meshXML = new XmlDocument();
                meshXML.Load(src);
		        this.triangleCount = Convert.ToInt32(meshXML.DocumentElement.Attributes.GetNamedItem("triangleCount").Value);
                
                foreach( XmlNode child in meshXML.DocumentElement.ChildNodes )
		        {
			        if (child.NodeType == XmlNodeType.Element)
			        {
				        if (child.Name == "verts")
				        {
					        this.vertCount = Convert.ToInt32(child.Attributes.GetNamedItem("count").Value);
					        this.vertFormat = child.Attributes.GetNamedItem("format").Value;


					        List<Vector3> posArray = new List<Vector3>();
					        List<Vector3> nrmArray = new List<Vector3>();
					        List<Vector2> uvArray = new List<Vector2>();

                            foreach( XmlNode vertPiece in child.ChildNodes )
                            {
						        if (vertPiece.NodeType == XmlNodeType.Element)
						        {
							        if (vertPiece.Name == "positions")
							        {
                                        foreach( XmlNode position in vertPiece.ChildNodes )
								        {
									        if (position.NodeType == XmlNodeType.Element)
									        {
										        if (position.Name == "v3")
										        {
											        string[] posVals = position.InnerText.Split(',');
											        Vector3 pos = new Vector3(Convert.ToSingle(posVals[0]), Convert.ToSingle(posVals[1]), Convert.ToSingle(posVals[2]));
											        posArray.Add(pos);
										        }
									        }
								        }
							        }
							        else if (vertPiece.Name == "normals")
							        {
                                        foreach( XmlNode normal in vertPiece.ChildNodes )
								        {
									        if (normal.NodeType == XmlNodeType.Element)
									        {
										        if (normal.Name == "v3")
										        {
											        string[] vals = normal.InnerText.Split(',');
											        Vector3 nrm = new Vector3(Convert.ToSingle(vals[0]), Convert.ToSingle(vals[1]), Convert.ToSingle(vals[2]));
											        nrmArray.Add(nrm);
										        }
									        }
								        }
							        }
							        else if (vertPiece.Name == "texcoords")
							        {
                                        foreach( XmlNode uvs in vertPiece.ChildNodes )
								        {
									        if (uvs.NodeType == XmlNodeType.Element)
									        {
										        if (uvs.Name == "v2")
										        {
											        string[] vals = uvs.InnerText.Split(',');
											        Vector2 uv = new Vector2(Convert.ToSingle(vals[0]), Convert.ToSingle(vals[1]));
											        uvArray.Add(uv);
										        }
									        }
								        }
							        }
						        }
					        }

					        List<float> interleaved = new List<float>();
                            int vertexSize = 0;
					        switch (this.vertFormat)
					        {
						        case "P3":
							        for (var j = 0; j < this.vertCount; j++)
							        {
								        interleaved.Add(posArray[j].X);
								        interleaved.Add(posArray[j].Y);
								        interleaved.Add(posArray[j].Z);
							        }
                                    vertexSize = 12;
							        break;
						        case "P3N3":
							        for (var j = 0; j < this.vertCount; j++)
							        {
								        interleaved.Add(posArray[j].X);
								        interleaved.Add(posArray[j].Y);
								        interleaved.Add(posArray[j].Z);
								        interleaved.Add(nrmArray[j].X);
								        interleaved.Add(nrmArray[j].Y);
								        interleaved.Add(nrmArray[j].Z);
							        }
                                    vertexSize = 24;
							        break;
						        case "P3T2":
							        for (var j = 0; j < this.vertCount; j++)
							        {
								        interleaved.Add(posArray[j].X);
								        interleaved.Add(posArray[j].Y);
								        interleaved.Add(posArray[j].Z);
								        interleaved.Add(uvArray[j].X);
								        interleaved.Add(uvArray[j].Y);
							        }
                                    vertexSize = 20;
							        break;
						        default:
							        System.Windows.Forms.MessageBox.Show("unsupported vertex format: " + this.vertFormat);
							        break;
					        }

                            GL.GenBuffers(1, out vb);
                            GL.BindBuffer(BufferTarget.ArrayBuffer, vb);
                            GL.BufferData(BufferTarget.ArrayBuffer, (IntPtr)(interleaved.Count * vertexSize), interleaved.ToArray(), BufferUsageHint.StaticDraw);
				        }
				        else if (child.Name == "indices")
				        {
					        string[] vals = child.InnerText.Split(',');
                            List<UInt16> indices = new List<UInt16>();
                            foreach( string val in vals )
                            {
                                indices.Add(Convert.ToUInt16(val));
                            }
                            
                            GL.GenBuffers(1, out ib);
                            GL.BindBuffer(BufferTarget.ElementArrayBuffer, ib);
                            GL.BufferData(BufferTarget.ElementArrayBuffer, (IntPtr)(indices.Count * 2), indices.ToArray(), BufferUsageHint.StaticDraw);
				        }
			        }
		        }
	        }
            catch(Exception)
            {
                System.Windows.Forms.MessageBox.Show("Failed to load mesh: " + src);
            }
        }

        public void Draw(GLContext gl)
        {
	        if (this.vb != 0)
	        {
                GL.BindBuffer(BufferTarget.ArrayBuffer, vb);
		        switch (this.vertFormat)
		        {
			        case "P3":
                        GL.EnableVertexAttribArray(gl.shaderPositionLocation);
                        GL.VertexAttribPointer(gl.shaderPositionLocation, 3, VertexAttribPointerType.Float, false, 0, 0);
				        break;
			        case "P3N3":
				        GL.EnableVertexAttribArray(gl.shaderPositionLocation);
				        GL.VertexAttribPointer(gl.shaderPositionLocation, 3, VertexAttribPointerType.Float, false, 24, 0);

				        if( gl.shaderNormalLocation >= 0 )
				        {
					        GL.EnableVertexAttribArray(gl.shaderNormalLocation);
					        GL.VertexAttribPointer(gl.shaderNormalLocation, 3, VertexAttribPointerType.Float, false, 24, 12);
				        }
				        break;
			        case "P3T2":
				        GL.EnableVertexAttribArray(gl.shaderPositionLocation);
				        GL.VertexAttribPointer(gl.shaderPositionLocation, 3, VertexAttribPointerType.Float, false, 20, 0);

				        if( gl.shaderUVLocattion >= 0 )
				        {
					        GL.EnableVertexAttribArray(gl.shaderUVLocattion);
					        GL.VertexAttribPointer(gl.shaderUVLocattion, 2, VertexAttribPointerType.Float, false, 20, 12);
				        }
				        break;
			        default:
				        System.Windows.Forms.MessageBox.Show("unsupported vertex format: " + this.vertFormat);
				        break; 
		        }

		        if (this.ib > 0)
		        {
			        // Indexed draw
			        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ib);
			        gl.drawElements(gl.TRIANGLES, this.triangleCount * 3, gl.UNSIGNED_SHORT, 0);

                    GL.BindBuffer(BufferTarget.ElementArrayBuffer, ib);
                    GL.DrawElements(BeginMode.Triangles, triangleCount * 3, DrawElementsType.UnsignedShort, 0);
		        }
		        else
		        {
			        // Non indexed draw
                    GL.DrawArrays(BeginMode.Triangles, 0, triangleCount * 3);
		        }
	        }
        }

    }
}
