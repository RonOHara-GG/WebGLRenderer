using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using OpenTK.Graphics.OpenGL;

namespace WebGLEditor
{
    public class RenderPass : Pass
    {
        public string sortMode = "none";
        public bool clearColor = false;
        public bool clearDepth = false;
        public bool clearStencil = false;
        public float clearColorRed = 0;
        public float clearColorGreen = 0;
        public float clearColorBlue = 0;
        public float clearDepthValue = 1.0f;
        public float clearStencilValue = 0;

        public Viewport viewport = null;
        public Camera camera = null;
        public FrameBuffer frameBuffer = null;
        public Shader overrideShader = null;

        private int lightUpdateToken = 0;

        public RenderPass(Scene scene, string name, string src) : base(scene, name, src)
        {
	        // Load the source
            try
            {
                XmlDocument rpXML = new XmlDocument();
                rpXML.Load(src);

		        // Get the attribute properties
                foreach( XmlAttribute attrib in rpXML.DocumentElement.Attributes )
                {
			        switch( attrib.Name )
			        {
				        case "sortMode":
					        sortMode = attrib.Value;
					        break;
				        case "clearMode":
					        string clearMode = attrib.Value;
					        clearColor = (clearMode.IndexOf("color") >= 0);
					        clearDepth = (clearMode.IndexOf("depth") >= 0);
					        clearStencil = (clearMode.IndexOf("stencil") >= 0);
					        break;
				        case "clearDepth":
					        clearDepthValue = Convert.ToSingle(attrib.Value);
					        break;
				        case "clearStencil":
					        clearStencilValue = Convert.ToSingle(attrib.Value);
					        break;
				        case "clearColor":
                            string[] clearColors = attrib.Value.Split(',');
					        clearColorRed = Convert.ToSingle(clearColors[0]) / 255.0f;
					        clearColorGreen = Convert.ToSingle(clearColors[1]) / 255.0f;
					        clearColorBlue = Convert.ToSingle(clearColors[2]) / 255.0f;
					        break;
				        default:
					        break;
			        }
		        }

                foreach( XmlNode child in rpXML.DocumentElement.ChildNodes )
		        {
			        if (child.NodeType == XmlNodeType.Element)
			        {
				        string objName = child.Attributes.GetNamedItem("name").Value;
				        string objSrc = child.Attributes.GetNamedItem("src").Value;
				        if (child.Name == "viewport")
				        {
					        viewport = scene.GetViewport(objName, objSrc);
				        }
				        else if (child.Name == "camera")
				        {
					        camera = scene.GetCamera(objName, objSrc);
				        }
				        else if (child.Name == "frameBuffer")
				        {
					        frameBuffer = scene.GetFrameBuffer(objName, objSrc);
				        }
				        else if (child.Name == "overrideShader")
				        {
					        overrideShader = scene.GetShader(objName, objSrc);
				        }
			        }
		        }
	        }
            catch(Exception e)
            {
                System.Windows.Forms.MessageBox.Show("Failed to load render pass: " + src + "\r\n" + e.Message);
            }
        }

        public void DoClear()
        {
	        ClearBufferMask clearBits = 0;
	        if (clearColor)
	        {
		        // Set the clear color
		        GL.ClearColor(clearColorRed, clearColorGreen, clearColorBlue, 1.0f);
		        clearBits |= ClearBufferMask.ColorBufferBit;
	        }
	        if (clearDepth)
		        clearBits |= ClearBufferMask.DepthBufferBit;
	        if (clearStencil)
		        clearBits |= ClearBufferMask.StencilBufferBit;

	        // do the clear
	        if( clearBits != 0 )
		        GL.Clear(clearBits);
        }

        public void UpdateLights(GLContext gl)
        {
	        lightUpdateToken++;
            foreach( RenderObject ro in renderObjects )
            {
		        if (ro.shader.lightUpdateToken != lightUpdateToken)
		        {
			        ro.shader.lightUpdateToken = lightUpdateToken;
			        ro.shader.lightCount = 0;
			        ro.shader.Bind(gl);
			        for (var j = 0; j < lights.Count; j++)
			        {
				        ro.shader.AddLight(lights[j]);
			        }
		        }
	        }
            lightsDirty = false;
        }

        public void Draw(GLContext gl)
        {
            GL.Enable(EnableCap.DepthTest);

	        if (lightsDirty)
		        UpdateLights(gl);

	        // Bind render target
            FrameBuffer.Bind(frameBuffer);

	        // Set viewport
	        viewport.Bind(gl);

	        // Set camera
	        camera.Bind(gl);

	        // Clear
	        DoClear();
	
	        // Bind override shader
	        if( overrideShader != null )
		        overrideShader.BindOverride(gl);

	        // Draw objects
	        for (var i = 0; i < renderObjects.Count; i++)
	        {
		        renderObjects[i].Draw(gl);
	        }

	        if( overrideShader != null )
		        overrideShader.UnbindOverride(gl);
        }
    }
}
