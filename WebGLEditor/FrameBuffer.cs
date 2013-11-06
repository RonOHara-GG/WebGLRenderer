using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using OpenTK.Graphics.OpenGL;

namespace WebGLEditor
{
    public class FrameBuffer : Asset
    {
        public int width = 0;
        public int height = 0;
        public string colorFormat = "RGBA32";
        public Texture colorTexture = null;
        public Texture depthTexture = null;
        public int frameBuffer;

        public FrameBuffer(Scene scene, string name, string src)
            : base(scene, name, src)
        {
            try
            {                
                XmlDocument fbXML = new XmlDocument();
	            fbXML.Load(src);
	        
	        
		        width = Convert.ToInt32(fbXML.DocumentElement.Attributes.GetNamedItem("width").Value);
		        height = Convert.ToInt32(fbXML.DocumentElement.Attributes.GetNamedItem("height").Value);
		        colorFormat = fbXML.DocumentElement.Attributes.GetNamedItem("colorFormat").Value;

                		
		        colorTexture = scene.GetTexture(name + "_color", null);
		        colorTexture.width = width;
		        colorTexture.height = height;
		        colorTexture.Create(PixelFormat.Rgba, PixelType.UnsignedByte, IntPtr.Zero);

		        depthTexture = scene.GetTexture(name + "_depth", null);
		        depthTexture.width = width;
		        depthTexture.height = height;
                depthTexture.format = PixelInternalFormat.DepthComponent;
		        depthTexture.Create(PixelFormat.DepthComponent, PixelType.UnsignedShort, IntPtr.Zero);
	
		        GL.GenFramebuffers(1, out frameBuffer);
                GL.BindFramebuffer(FramebufferTarget.Framebuffer, frameBuffer);
                GL.FramebufferTexture2D(FramebufferTarget.Framebuffer, FramebufferAttachment.ColorAttachment0, TextureTarget.Texture2D, colorTexture.glTexture, 0);
                GL.FramebufferTexture2D(FramebufferTarget.Framebuffer, FramebufferAttachment.DepthAttachment, TextureTarget.Texture2D, depthTexture.glTexture, 0);

                GL.BindFramebuffer(FramebufferTarget.Framebuffer, 0);
	        }
            catch(Exception )
            {
                System.Windows.Forms.MessageBox.Show("Failed to load framebuffer: " + src);
            }
        }

        public void Bind()
        {
            GL.BindFramebuffer(FramebufferTarget.Framebuffer, frameBuffer);
        }

        public static void Bind(FrameBuffer frameBuffer)
        {
            if (frameBuffer != null)
                frameBuffer.Bind();
            else
                GL.BindFramebuffer(FramebufferTarget.Framebuffer, 0);
        }
    }
}
