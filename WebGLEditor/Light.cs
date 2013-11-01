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
            this.color = new Vector3(1.0f, 1.0f, 1.0f);
            this.dir = new Vector3();

            this.shadowMatrix = mat4.create();
            this.shadowMap = null;

            var xml = LoadXML(src);
            if (xml)
            {
                for (var i = 0; i < xml.documentElement.attributes.length; i++)
                {
                    var attrib = xml.documentElement.attributes[i];
                    switch (attrib.name)
                    {
                        case "type":
                            this.type = attrib.value;
                            break;
                        case "color":
                            var values = attrib.value.csvToArray();
                            this.color = vec3.fromValues(values[0][0] / 255.0, values[0][1] / 255.0, values[0][2] / 255.0);
                            break;
                        case "dir":
                            var values = attrib.value.csvToArray();
                            var temp = vec3.fromValues(values[0][0], values[0][1], values[0][2]);
                            vec3.normalize(this.dir, temp);
                            break;
                        default:
                            break;
                    }
                }
            }	
        }
    }
}
