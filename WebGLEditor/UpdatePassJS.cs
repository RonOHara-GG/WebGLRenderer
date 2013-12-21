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
        TreeNode mRONode;
        TreeNode mCamNode;

        string mName;
        string mSource;

        public UpdatePassJS(string passName, TreeNode myNode)
        {
            mTreeNode = myNode;

            string passData = NativeWrapper.GetUpdatePass(passName);
            string[] props = passData.Split(';');

            // 0: name
            mName = passName;

            // 1: src
            mSource = props[1];

            // 2: renderObjects
            mRONode = myNode.Nodes.Add("Render Objects");
            mRONode.ContextMenu = new ContextMenu();
            mRONode.ContextMenu.MenuItems.Add("Add Render Object", onAddRenderObject);
            string[] renderObjects = props[2].Split(',');
            for (int i = 0; i < renderObjects.Length; i++)
            {
                if( renderObjects[i].Length > 0 )
                {
                    TreeNode child = mRONode.Nodes.Add(renderObjects[i]);
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
            mCamNode = myNode.Nodes.Add("Cameras");
            mCamNode.ContextMenu = new ContextMenu();
            mCamNode.ContextMenu.MenuItems.Add("Add Camera", onAddCamera);
            string[] cameras = props[4].Split(',');
            for (int i = 0; i < cameras.Length; i++)
            {
                if (cameras[i].Length > 0)
                {
                    TreeNode child = mCamNode.Nodes.Add(cameras[i]);
                }
            }
        }

        public void onAddRenderObject(object sender, EventArgs e)
        {
            ObjectPickerDlg dlg = new ObjectPickerDlg();
            dlg.Text = "Add Render Object";

            TreeNode sceneNode = mTreeNode.Parent.Parent;
            SceneJS scene = (SceneJS)sceneNode.Tag;

            foreach (RenderObjectJS ro in scene.mRenderObjects)
            {
                bool found = false;
                foreach (TreeNode n in mRONode.Nodes)
                {
                    if (ro.Name == n.Text)
                    {
                        found = true;
                        break;
                    }
                }
                if (!found)
                {
                    dlg.ObjectList.Items.Add(ro.Name);
                }
            }

            if (dlg.ShowDialog() != DialogResult.Cancel)
            {
                string roname = (string)dlg.ObjectList.SelectedItem;
                if (NativeWrapper.AddObjectToPass("updatePass", mName, "renderObject", roname))
                {
                    mRONode.Nodes.Add(roname);
                }
            }
        }

        public void onAddCamera(object sender, EventArgs e)
        {
            ObjectPickerDlg dlg = new ObjectPickerDlg();
            dlg.Text = "Add Camera";

            TreeNode sceneNode = mTreeNode.Parent.Parent;
            SceneJS scene = (SceneJS)sceneNode.Tag;

            foreach (CameraJS cam in scene.mCameras)
            {
                bool found = false;
                foreach (TreeNode n in mCamNode.Nodes)
                {
                    if (cam.Name == n.Text)
                    {
                        found = true;
                        break;
                    }
                }
                if (!found)
                {
                    dlg.ObjectList.Items.Add(cam.Name);
                }
            }

            if (dlg.ShowDialog() != DialogResult.Cancel)
            {
                string roname = (string)dlg.ObjectList.SelectedItem;
                if (NativeWrapper.AddObjectToPass("updatePass", mName, "camera", roname))
                {
                    mCamNode.Nodes.Add(roname);
                }
            }
        }

        public string Name
        {
            get { return mName; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "updatePass", "name", value))
                {
                    mName = value;
                    mTreeNode.Text = mName;
                }
            }
        }

        public string Source
        {
            get { return mSource; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "updatePass", "src", value))
                    mSource = value;
            }
        }
    }
}
