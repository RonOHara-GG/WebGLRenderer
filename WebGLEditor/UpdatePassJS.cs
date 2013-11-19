using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    public class UpdatePassJS
    {
        TreeNode mTreeNode;

        public UpdatePassJS(string passName, TreeNode myNode)
        {
            mTreeNode = myNode;

            string passData = NativeWrapper.GetUpdatePass(passName);
            string[] props = passData.Split(';');

            // 0: name
            // 1: src
            // 2: renderObjects
            TreeNode roNode = myNode.Nodes.Add("Render Objects");
            string[] renderObjects = props[2].Split(',');
            for (int i = 0; i < renderObjects.Length; i++)
            {
                if( renderObjects[i].Length > 0 )
                {
                    TreeNode child = roNode.Nodes.Add(renderObjects[i]);
                }
            }

            // 3: lights
            TreeNode lightsNode = myNode.Nodes.Add("Lights");
            string[] lights = props[3].Split(',');
            for (int i = 0; i < lights.Length; i++)
            {
                if( lights[i].Length > 0 )
                {
                    TreeNode child = lightsNode.Nodes.Add(lights[i]);
                }
            }

            // 4: cameras
            TreeNode camNode = myNode.Nodes.Add("Cameras");
            string[] cameras = props[4].Split(',');
            for (int i = 0; i < cameras.Length; i++)
            {
                if (cameras[i].Length > 0)
                {
                    TreeNode child = camNode.Nodes.Add(cameras[i]);
                }
            }
        }
    }
}
