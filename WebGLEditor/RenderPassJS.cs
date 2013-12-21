using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.ComponentModel;
using System.Drawing;

namespace WebGLEditor
{
    public class RenderPassJS
    {
        public enum eClearMode
        {
            None,
            Color,
            Depth,
            Stencil,
            ColorDepth,
            ColorStencil,
            DepthStencil,
            ColorDepthStencil
        };

        TreeNode mNode;
        TreeNode mRONode;
        TreeNode mLNode;

        string mName;
        string mSrc;
        string mSortMode;
        eClearMode mClearMode;
        Color mClearColor;
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
            ParseClearMode(passInfo[3]);

            // clearColor
            mClearColor = Program.ParseColor(passInfo[4]);

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
            mLNode.ContextMenu = new ContextMenu();
            mLNode.ContextMenu.MenuItems.Add("Add Light", onAddLight);
            if (passInfo[12].Length > 0)
            {
                string[] lights = passInfo[12].Split(',');
                foreach (string light in lights)
                {
                    TreeNode node = mLNode.Nodes.Add(light);
                }
            }
        }

        private string GetClearModeString(eClearMode cm)
        {
            string val = null;
            switch (cm)
            {
                case eClearMode.None:
                    val = "none";
                    break;
                case eClearMode.Color:
                    val = "color";
                    break;
                case eClearMode.Depth:
                    val = "depth";
                    break;
                case eClearMode.Stencil:
                    val = "stencil";
                    break;
                case eClearMode.ColorDepth:
                    val = "color_depth";
                    break;
                case eClearMode.ColorStencil:
                    val = "color_stencil";
                    break;
                case eClearMode.DepthStencil:
                    val = "depth_stencil";
                    break;
                case eClearMode.ColorDepthStencil:
                    val = "color_depth_stencil";
                    break;
            }

            return val;
        }

        private void ParseClearMode(string clearmode)
        {
            if (clearmode != null && clearmode.Length > 0)
            {
                bool clearColor = (clearmode.IndexOf("color") >= 0);
                bool clearDepth = (clearmode.IndexOf("depth") >= 0);
                bool clearStencil = (clearmode.IndexOf("stencil") >= 0);

                if (clearColor)
                {
                    if (clearDepth)
                    {
                        if (clearStencil)
                            mClearMode = eClearMode.ColorDepthStencil;
                        else
                            mClearMode = eClearMode.ColorDepth;
                    }
                    else
                    {
                        if (clearStencil)
                            mClearMode = eClearMode.ColorStencil;
                        else
                            mClearMode = eClearMode.Color;
                    }
                }
                else
                {
                    if (clearDepth)
                    {
                        if (clearStencil)
                            mClearMode = eClearMode.DepthStencil;
                        else
                            mClearMode = eClearMode.Depth;
                    }
                    else
                    {
                        if (clearStencil)
                            mClearMode = eClearMode.Stencil;
                        else
                            mClearMode = eClearMode.None;
                    }
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

        public void onAddLight(object sender, EventArgs e)
        {
            ObjectPickerDlg dlg = new ObjectPickerDlg();
            dlg.Text = "Add Light";

            TreeNode sceneNode = mNode.Parent.Parent;
            SceneJS scene = (SceneJS)sceneNode.Tag;

            foreach (LightJS light in scene.mLights)
            {
                bool found = false;
                foreach (TreeNode n in mLNode.Nodes)
                {
                    if (light.Name == n.Text)
                    {
                        found = true;
                        break;
                    }
                }
                if (!found)
                {
                    dlg.ObjectList.Items.Add(light.Name);
                }
            }

            if (dlg.ShowDialog() != DialogResult.Cancel)
            {
                string lightname = (string)dlg.ObjectList.SelectedItem;
                if (NativeWrapper.AddObjectToPass("renderPass", mName, "light", lightname))
                {
                    mLNode.Nodes.Add(lightname);
                }
            }
        }

        public string Name
        {
            get { return mName; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderPass", "name", value))
                {
                    mName = value;
                    mNode.Text = mName;
                }
            }
        }

        public string Source
        {
            get { return mSrc; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderPass", "src", value))
                    mSrc = value;
            }
        }

        public string SortMode
        {
            get { return mSortMode; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderPass", "sortMode", value))
                    mSortMode = value;
            }
        }

        [TypeConverter(typeof(ClearModeConverter))]
        public eClearMode ClearMode
        {
            get { return mClearMode; }
            set
            {
                string cm = GetClearModeString(value);
                if (NativeWrapper.SetObjectAssignment(mName, "renderPass", "clearMode", cm))
                    mClearMode = value;
            }
        }

        public Color ClearColor
        {
            get { return mClearColor; }
            set
            {
                string strColor = value.R + "," + value.G + "," + value.B;
                if (NativeWrapper.SetObjectAssignment(mName, "renderPass", "clearColor", strColor))
                    mClearColor = value;
            }
        }

        public string ClearDepth
        {
            get { return mClearDepth; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderPass", "clearDepth", value))
                    mClearDepth = value;
            }
        }

        public string ClearStencil
        {
            get { return mClearStencil; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderPass", "clearStencil", value))
                    mClearStencil = value;
            }
        }

        public string Viewport
        {
            get { return mViewport; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderPass", "viewport", value))
                    mViewport = value;
            }
        }

        public string Camera
        {
            get { return mCamera; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderPass", "camera", value))
                    mCamera = value;
            }
        }

        public string FrameBuffer
        {
            get { return mFrameBuffer; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderPass", "frameBuffer", value))
                    mFrameBuffer = value;
            }
        }

        public string OverrideShader
        {
            get { return mOverrideShader; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderPass", "overrideShader", value))
                    mOverrideShader = value;
            }
        }
    }
    
    public class ClearModeConverter : EnumTypeConverter
    {
        public ClearModeConverter() : base(typeof(RenderPassJS.eClearMode))
        {
        }

        public override TypeConverter.StandardValuesCollection GetStandardValues(ITypeDescriptorContext context)
        {
            return new StandardValuesCollection(new RenderPassJS.eClearMode[] { RenderPassJS.eClearMode.None, RenderPassJS.eClearMode.Color, RenderPassJS.eClearMode.Depth, RenderPassJS.eClearMode.Stencil, RenderPassJS.eClearMode.ColorDepth, RenderPassJS.eClearMode.ColorStencil, RenderPassJS.eClearMode.DepthStencil, RenderPassJS.eClearMode.ColorDepthStencil });
        }

        public override object ConvertFrom(ITypeDescriptorContext context, System.Globalization.CultureInfo culture, object value)
        {
            if (value is string)
                return (RenderPassJS.eClearMode)Enum.Parse(typeof(RenderPassJS.eClearMode), value.ToString(), true);
            return base.ConvertFrom(context, culture, value);
        }

    }
}
