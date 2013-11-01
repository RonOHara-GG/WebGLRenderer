using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using OpenTK.Graphics.OpenGL;

namespace WebGLEditor
{
    public class Scene
    {
        public List<RenderPass> renderPasses;
        public List<UpdatePass> updatePasses;
        public List<RenderObject> renderObjects;
        public List<Viewport> viewports;
        public List<Camera> cameras;
        public List<FrameBuffer> frameBuffers;
        public List<Mesh> meshes;
        public List<Shader> shaders;
        public List<Light> lights;
        public List<Texture> textures;
        public GL gl;
        
        public Scene(string sceneXMLFile, GL glptr)
        {
            renderPasses = new List<RenderPass>();
            updatePasses = new List<UpdatePass>();
            renderObjects = new List<RenderObject>();
            viewports = new List<Viewport>();
            cameras = new List<Camera>();
            frameBuffers = new List<FrameBuffer>();
            meshes = new List<Mesh>();
            shaders = new List<Shader>();
            lights = new List<Light>();
            textures = new List<Texture>();

            gl = glptr;

            if (sceneXMLFile != null && sceneXMLFile.Length > 0)
            {
                try
                {
                    XmlDocument xml = new XmlDocument();
                    xml.Load(sceneXMLFile);
                    foreach (XmlNode child in xml.ChildNodes)
                    {
                        if (child.NodeType == XmlNodeType.Element)
                        {
                            if (child.Name == "renderPass" || child.Name == "updatePass")
                            {
                                string passName = child.Attributes.GetNamedItem("name").Value;
                                string srcFile = child.Attributes.GetNamedItem("src").Value;
				
				                Pass thePass = null;
                                if (child.Name == "renderPass")
                                    thePass = getRenderPass(passName, srcFile);
                                else
                                    thePass = getUpdatePass(passName, srcFile);

                                foreach( XmlNode node in child.ChildNodes )
                                {
                                    if (node.NodeType == XmlNodeType.Element)
					                {
                                        if (node.Name == "renderObject")
						                {
                                            string objName = node.Attributes.GetNamedItem("name").Value;
                                            string objSrc = node.Attributes.GetNamedItem("src").Value;

							                // Try to find this render object if its already loaded
							                RenderObject renderObj = getRenderObject(objName, objSrc);

							                // Reference this object in the render pass
							                thePass.renderObjects.Add(renderObj);
						                }
                                        else if (node.Name == "light")
                                        {
                                            string objName = node.Attributes.GetNamedItem("name").Value;
                                            string objSrc = node.Attributes.GetNamedItem("src").Value;

							                // Try to find this render object if its already loaded
							                Light light = getLight(objName, objSrc);

							                thePass.lights.Add(light);
							                thePass.lightsDirty = true;
						                }
                                        else if (node.Name == "camera")
                                        {
                                            string objName = node.Attributes.GetNamedItem("name").Value;
                                            string objSrc = node.Attributes.GetNamedItem("src").Value;
							                Camera cam = getCamera(objName, objSrc);

							                thePass.cameras.Add(cam);
						                }
					                }
				                }
                            }
                        }
                    }
                } 
                catch(Exception)
                {
                    System.Windows.Forms.MessageBox.Show("Failed to read scene file: " + sceneXMLFile);
                }

            }
        }

        public RenderPass GetRenderPass(string passName, string src)
        {
	        for (var i = 0; i < renderPasses.Count; i++)
	        {
		        if (renderPasses[i].name == passName)
			        return renderPasses[i];
	        }

	        // Doesnt exist, load it now
	        RenderPass renderPass = new RenderPass(this, passName, src);
	        renderPasses.Add(renderPass);
	        return renderPass;
        }

        public UpdatePass GetUpdatePass(string passName, string src)
        {
	        for (var i = 0; i < updatePasses.Count; i++)
	        {
		        if (updatePasses[i].name == passName)
			        return updatePasses[i];
	        }

	        // Doesnt exist, load it now
	        UpdatePass updatePass = new UpdatePass(this, passName, src);
	        updatePasses.Add(updatePass);
	        return updatePass;
        }

        public RenderObject GetRenderObject(string objName, string src)
        {
	        for (var i = 0; i < renderObjects.Count; i++)
	        {
		        if (renderObjects[i].name == objName)
			        return renderObjects[i];
	        }	

	        // Doesnt exist, load it now
	        RenderObject renderObj = new RenderObject(this, objName, src);
	        renderObjects.Add(renderObj);
	        return renderObj;
        }

        public Viewport GetViewport(string name, string src)
        {
	        for (var i = 0; i < viewports.Count; i++)
	        {
		        if( viewports[i].name == name )
			        return viewports[i];
	        }

	        // Doesnt exist, load it now
	        Viewport viewport = new Viewport(this, name, src);
	        viewports.Add(viewport);
	        return viewport;
        }

        public Camera GetCamera(string name, string src)
        {
	        for (var i = 0; i < cameras.Count; i++)
	        {
		        if( cameras[i].name == name )
			        return cameras[i];
	        }

	        // Doesnt exist, load it now
	        Camera camera = new Camera(this, name, src);
	        cameras.Add(camera);
	        return camera;
        }

        public FrameBuffer GetFrameBuffer(string name, string src)
        {
	        for (var i = 0; i < frameBuffers.Count; i++)
	        {
		        if( frameBuffers[i].name == name )
			        return frameBuffers[i];
	        }

	        if( src != null && src.Length > 0 )
	        {
		        // Doesnt exist, load it now
		        FrameBuffer frameBuffer = new FrameBuffer(this, name, src);
		        frameBuffers.Add(frameBuffer);
		        return frameBuffer;
	        }
        }

        public Mesh GetMesh(string name, string src)
        {
	        for( var i = 0; i < meshes.Count; i++ )
	        {
		        if( meshes[i].name == name )
			        return meshes[i];
	        }

	        Mesh mesh = new Mesh(this, name, src);
	        meshes.Add(mesh);
	        return mesh;
        }

        public Shader GetShader(string name, string src)
        {
	        for (var i = 0; i < shaders.Count; i++)
	        {
		        if (shaders[i].name == name)
			        return shaders[i];
	        }

	        Shader shader = new Shader(this, name, src);
	        shaders.Add(shader);
	        return shader;
        }

        public Light GetLight(string name, string src)
        {
	        for (var i = 0; i < lights.Count; i++)
	        {
		        if (lights[i].name == name)
			        return lights[i];
	        }

	        Light light = new Light(this, name, src);
	        lights.Add(light);
	        return light;
        }

        public Texture GetTexture(string name, string src)
        {
	        for (var i = 0; i < textures.Count; i++)
	        {
		        if (textures[i].name == name)
			        return textures[i];
	        }

	        Texture tex = new Texture(this, name, src);
	        textures.Add(tex);
	        return tex;
        }

        public void UpdateScene(float deltaTimeMS)
        {
	        for (var i = 0; i < updatePasses.Count; i++)
	        {
		        updatePasses[i].Update(deltaTimeMS);
	        }
        }

        public void DrawScene(GL gl)
        {
	        for (var i = 0; i < renderPasses.Count; i++)
	        {
		        renderPasses[i].Draw(gl);
	        }
	
	        //gl.lightsDirty = false;
        }

        public void ResizeScene(float width, float height)
        {
	        float ar = width / height;
	        for (var i = 0; i < cameras.Count; i++)
	        {
		        cameras[i].Resize(ar);
	        }
        }
    }
}
