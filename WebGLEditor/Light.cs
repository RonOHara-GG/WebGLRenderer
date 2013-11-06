using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using OpenTK;
using OpenTK.Graphics.OpenGL;

namespace WebGLEditor
{
    public class Light : Asset
    {
        public string type = "dir";
        public Vector3 color;
        public Vector3 dir;
        public Matrix4 shadowMatrix;


        public Light(Scene scene, string name, string src)
            : base(scene, name, src)
        {
            color = new Vector3(1.0f, 1.0f, 1.0f);
            dir = new Vector3();
            shadowMatrix = Matrix4.Identity;


            try
            {
                XmlDocument xml = new XmlDocument();
                xml.Load(src);
                foreach( XmlAttribute attrib in xml.DocumentElement.Attributes )
                {
                    string[] values;
                    switch (attrib.Name)
                    {
                        case "type":
                            type = attrib.Value;
                            break;
                        case "color":
                            values = attrib.Value.Split(',');
                            color = new Vector3(Convert.ToSingle(values[0]) / 255.0f, Convert.ToSingle(values[1]) / 255.0f, Convert.ToSingle(values[2]) / 255.0f);
                            break;
                        case "dir":
                            values = attrib.Value.Split(',');
                            dir = new Vector3(Convert.ToSingle(values[0]), Convert.ToSingle(values[1]), Convert.ToSingle(values[2]));
                            dir.Normalize();
                            break;
                        default:
                            break;
                    }
                }
            }
            catch (Exception)
            {
                System.Windows.Forms.MessageBox.Show("Failed to load light: " + src);
            }
        }

        public void Update(float deltaTimeMS)
        {
        }
    }
}
