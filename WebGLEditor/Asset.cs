using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebGLEditor
{
    public class Asset
    {
        public Scene scene;
        public string name;
        public string src;

        public Asset(Scene s, string n, string sr)
        {
            scene = s;
            name = n;
            src = sr;
        }
    }
}
