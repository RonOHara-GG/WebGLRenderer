using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenTK.Graphics.OpenGL;
using System.Xml;

namespace WebGLEditor
{
    public class Viewport : Asset
    {
        public float left = 0;
        public float top = 0;
        public float width = 1;
        public float height = 1;
        public bool percentageMode = true;

        public Viewport(Scene scene, string name, string src)
            : base(scene, name, src)
        {
	        // load the xml
            try
            {
                XmlDocument viewportXML = new XmlDocument();
                viewportXML.Load(src);

                this.left = Convert.ToSingle(viewportXML.DocumentElement.Attributes.GetNamedItem("left").Value);
                this.top = Convert.ToSingle(viewportXML.DocumentElement.Attributes.GetNamedItem("top").Value);
                this.width = Convert.ToSingle(viewportXML.DocumentElement.Attributes.GetNamedItem("width").Value);
                this.height = Convert.ToSingle(viewportXML.DocumentElement.Attributes.GetNamedItem("height").Value);
                this.percentageMode = viewportXML.DocumentElement.Attributes.GetNamedItem("percentageMode").Value == "true";
            }
            catch (Exception)
            {
                System.Windows.Forms.MessageBox.Show("Failed to load viewport: " + src);
            }
        }

        public void Bind(GLContext gl)
        {
	        if( this.percentageMode )
	        {
		        int tempLeft = (int)(this.left * gl.canvasWidth);
                int tempTop = (int)(this.top * gl.canvasHeight);
                int tempWidth = (int)(this.width * gl.canvasWidth);
                int tempHeight = (int)(this.height * gl.canvasHeight);
                GL.Viewport(tempLeft, tempTop, tempWidth, tempHeight);
	        }
	        else
	        {
                GL.Viewport((int)this.left, (int)this.top, (int)this.width, (int)this.height);
	        }
        }
    }
}
