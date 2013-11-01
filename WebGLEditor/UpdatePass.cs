using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebGLEditor
{
    public class UpdatePass : Pass
    {
        public UpdatePass(Scene scene, string name, string src)
            : base(scene, name, src)
        {

        }

        public void Update(float deltaTimeMS)
        {
	        // Update cameras
	        for( var i = 0; i < cameras.Count; i++ )
	        {
		        cameras[i].Update(deltaTimeMS);
	        }

	        // Update render objects
            for (var i = 0; i < renderObjects.Count; i++)
	        {
		        renderObjects[i].Update(deltaTimeMS);
	        }
	
	        // Update all lights
            for (var i = 0; i < lights.Count; i++)
	        {
		        lights[i].Update(deltaTimeMS);
	        }
        }
    }
}
