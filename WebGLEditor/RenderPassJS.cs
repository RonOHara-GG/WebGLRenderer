using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    public class RenderPassJS
    {
        TreeNode mNode;
        TreeNode mRONode;
        TreeNode mLNode;

        string mName;
        string mSrc;
        string mSortMode;
        string mClearMode;
        string mClearColor;
        string mClearDepth;
        string mClearStencil;
        string mViewport;
        string mCamera;
        string mFrameBuffer;
        string mOverrideShader;        

        public RenderPassJS(string renderPassName, TreeNode myNode)
        {
            mNode = myNode;

            string data = NativeWrapper.GetRenderPass(renderPassName);
            string[] passInfo = data.Split(';');

            // name
            mName = renderPassName;

            // src
            mSrc = passInfo[1];

            // sortMode
            mSortMode = passInfo[2];

            // clearMode
            mClearMode = passInfo[3];

            // clearColor
            mClearColor = passInfo[4];

            // clearDepth
            mClearDepth = passInfo[5];

            // clearStencil
            mClearStencil = passInfo[6];

            // viewport
            mViewport = passInfo[7];

            // camera
            mCamera = passInfo[8];

            // frameBuffer
            mFrameBuffer = passInfo[9];

            // overrideShader
            mOverrideShader = passInfo[10];

            // renderObjects
            mRONode = mNode.Nodes.Add("Render Objects");
            mRONode.ContextMenu = new ContextMenu();
            mRONode.ContextMenu.MenuItems.Add("Add Render Object", onAddRenderObject);
            if (passInfo[11].Length > 0)
            {
                string[] renderObjects = passInfo[11].Split(',');
                foreach (string ro in renderObjects)
                {
                    TreeNode node = mRONode.Nodes.Add(ro);
                }
            }

            // lights
            mLNode = mNode.Nodes.Add("Lights");
            if (passInfo[12].Length > 0)
            {
                string[] lights = passInfo[12].Split(',');
                foreach (string light in lights)
                {
                    TreeNode node = mLNode.Nodes.Add(light);
                }
            }
        }

        public void onAddRenderObject(object sender, EventArgs e)
        {
            ObjectPickerDlg dlg = new ObjectPickerDlg();
            dlg.Text = "Add Render Object";

            TreeNode sceneNode = mNode.Parent.Parent;
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
                if (NativeWrapper.AddObjectToPass("renderPass", mName, "renderObject", roname))
                {
                    mRONode.Nodes.Add(roname);
                }
            }
        }

    }
}
