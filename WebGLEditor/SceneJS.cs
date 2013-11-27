using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    public class SceneJS
    {
        TreeNode mTreeNode;
        int mROIndex = 0;

        public List<RenderObjectJS> mRenderObjects;
        
        public SceneJS(string json, TreeNode node)
        {
            mRenderObjects = new List<RenderObjectJS>();

            mTreeNode = node;

            // WorldUpdate;ShadowPass,DiffusePass,2DOverlay
            string[] props = json.Split(';');
            string[] updatePasses = props[0].Split(',');
            string[] renderPasses = props[1].Split(',');
            string[] renderObjects = props[2].Split(',');
            string[] viewports = props[3].Split(',');
            string[] cameras = props[4].Split(',');
            string[] frameBuffers = props[5].Split(',');
            string[] meshes = props[6].Split(',');
            string[] shaders = props[7].Split(',');
            string[] lights = props[8].Split(',');
            string[] textures = props[9].Split(',');

            TreeNode unode = node.Nodes.Add("Update Passes");
            for( int i = 0; i < updatePasses.Length; i++ )
            {
                TreeNode child = unode.Nodes.Add(updatePasses[i]);
                UpdatePassJS updatePass = new UpdatePassJS(updatePasses[i], child);
                child.Tag = updatePass;
            }

            TreeNode rnode = node.Nodes.Add("Render Passes");
            for (int i = 0; i < renderPasses.Length; i++)
            {
                TreeNode child = rnode.Nodes.Add(renderPasses[i]);
                RenderPassJS renderPass = new RenderPassJS(renderPasses[i], child);
                child.Tag = renderPass;
            }

            TreeNode ronode = node.Nodes.Add("Render Objects");
            ronode.ContextMenu = new ContextMenu();
            ronode.ContextMenu.MenuItems.Add("New Render Object", onNewRenderObject);
            for (int i = 0; i < renderObjects.Length; i++)
            {
                TreeNode child = ronode.Nodes.Add(renderObjects[i]);
                RenderObjectJS ro = new RenderObjectJS(renderObjects[i]);
                mRenderObjects.Add(ro);
                child.Tag = ro;
            }

            TreeNode vpnode = node.Nodes.Add("Viewports");
            for (int i = 0; i < viewports.Length; i++)
            {
                TreeNode child = vpnode.Nodes.Add(viewports[i]);
            }

            TreeNode camnode = node.Nodes.Add("Cameras");
            for (int i = 0; i < cameras.Length; i++)
            {
                TreeNode child = camnode.Nodes.Add(cameras[i]);
            }

            TreeNode fbnode = node.Nodes.Add("Frame Buffers");
            for (int i = 0; i < frameBuffers.Length; i++)
            {
                TreeNode child = fbnode.Nodes.Add(frameBuffers[i]);
            }

            TreeNode mnode = node.Nodes.Add("Meshes");
            for (int i = 0; i < meshes.Length; i++)
            {
                TreeNode child = mnode.Nodes.Add(meshes[i]);
            }

            TreeNode snode = node.Nodes.Add("Shaders");
            for (int i = 0; i < shaders.Length; i++)
            {
                TreeNode child = snode.Nodes.Add(shaders[i]);
            }

            TreeNode lightnode = node.Nodes.Add("Lights");
            for (int i = 0; i < lights.Length; i++)
            {
                TreeNode child = lightnode.Nodes.Add(lights[i]);
            }

            TreeNode texnode = node.Nodes.Add("Textures");
            for (int i = 0; i < textures.Length; i++)
            {
                TreeNode child = texnode.Nodes.Add(textures[i]);
            }
        }

        public void Import(string data)
        {
            int idx = data.IndexOf(':');
            string type = data.Substring(0, idx);

            int idx2 = data.IndexOf(';');
            string name = data.Substring(idx + 1, idx2 - (idx + 1));

            switch (type)
            {
                case "mesh":
                    {
                        TreeNode node = FindTreeNode("Meshes");
                        if (node != null)
                        {
                            if( IsUniqueName(node, name) )
                            {
                                // Child doesnt exist, add it now
                                node.Nodes.Add(name);
                            }                            
                        }
                    }
                    break;
                default:
                    Console.WriteLine("Unhandled import data type: " + type);
                    break;
            }
        }

        private TreeNode FindTreeNode(string nodeText)
        {
            TreeNode theNode = null;
            foreach (TreeNode node in mTreeNode.Nodes)
            {
                if (node.Text == nodeText)
                {
                    theNode = node;
                    break;
                }
            }

            return theNode;
        }

        private bool IsUniqueName(TreeNode node, string name)
        {
            TreeNode child = null;
            foreach (TreeNode n in node.Nodes)
            {
                if (n.Text == name)
                {
                    child = n;
                    break;
                }
            }

            return (child == null);
        }

        public void onNewRenderObject(object sender, EventArgs e)
        {
            TreeNode ronode = FindTreeNode("Render Objects");

            string name;
            do
            {
                name = "RenderObject_" + mROIndex++;
            } while (!IsUniqueName(ronode, name));

            TreeNode node = ronode.Nodes.Add(name);
            RenderObjectJS obj = new RenderObjectJS(name);
            mRenderObjects.Add(obj);
            node.Tag = obj;
        }
        
    }
}
