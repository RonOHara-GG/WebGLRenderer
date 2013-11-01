using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebGLEditor
{
    public class Pass : Asset
    {
        public List<RenderObject> renderObjects;
        public List<Lights> lights;
        public List<Camera> cameras;

        public Pass(Scene scene, string name, string src) : base(scene, name, src)
        {
	        renderObjects = new List<RenderObject>();
            lights = new List<Light>();
            cameras = new List<Camera>();
        }   
    }
}
