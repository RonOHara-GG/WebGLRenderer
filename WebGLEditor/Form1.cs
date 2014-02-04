using System;
using System.Reflection;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.IO;

namespace WebGLEditor
{
    public partial class Form1 : Form
    {
        string mDragObjects;
        float[] mDragAxes;
        float mDragX;
        float mDragY;

        public Form1()
        {
            mDragAxes = new float[6];
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
        }

        private void WaitCursor(bool enable)
        {
            UseWaitCursor = enable;
            Application.DoEvents();
        }

        private void openSceneToolStripMenuItem_Click(object sender, EventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Filter = "XML Files (*.xml)|*.xml|All Files (*.*)|*.*";
            dlg.FilterIndex = 0;
            dlg.InitialDirectory = Directory.GetCurrentDirectory();
            dlg.FileName = "scene.xml";
            if (dlg.ShowDialog() != DialogResult.Cancel)
            {
                string relative = NativeWrapper.GetRelative(dlg.FileName);
                NewScene(relative);
            }
        }

        private void saveSceneToolStripMenuItem_Click(object sender, EventArgs e)
        {
            SceneJS scene = (SceneJS)treeView1.Nodes[0].Tag;
            if (scene.mFilename == null)
            {
                saveSceneAsToolStripMenuItem_Click(sender, e);
            }
            else
            {
                WaitCursor(true);
                NativeWrapper.SaveScene();
                WaitCursor(false);
            }
        }

        private void saveSceneAsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            SceneJS scene = (SceneJS)treeView1.Nodes[0].Tag;
            if (scene != null)
            {
                FolderBrowserDialog dlg = new FolderBrowserDialog();
                dlg.ShowNewFolderButton = true;
                dlg.SelectedPath = Directory.GetCurrentDirectory();
                if (dlg.ShowDialog() != DialogResult.Cancel)
                {
                    WaitCursor(true);
                    string relative = NativeWrapper.GetRelative(dlg.SelectedPath) + "/";
                    scene.mFilename = relative;
                    treeView1.Nodes[0].Text = relative;
                    NativeWrapper.UpdatePath(relative);
                    NativeWrapper.SaveScene();
                    WaitCursor(false);
                }
            }
        }

        private void ripColladaFileToolStripMenuItem_Click(object sender, EventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Filter = "Collada Files (*.dae)|*.dae|All Files (*.*)|*.*";
            dlg.FilterIndex = 0;
            dlg.InitialDirectory = Directory.GetCurrentDirectory();
            if (dlg.ShowDialog() != DialogResult.Cancel)
            {
                WaitCursor(true);
                NativeWrapper.RipColladaFile(dlg.FileName);
                WaitCursor(false);
            }
        }

        private void importFileToolStripMenuItem_Click(object sender, EventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Filter = "XML Files (*.xml)|*.xml|All Files (*.*)|*.*";
            dlg.FilterIndex = 0;
            dlg.InitialDirectory = Directory.GetCurrentDirectory();
            if (dlg.ShowDialog() != DialogResult.Cancel)
            {
                WaitCursor(true);
                string data = NativeWrapper.ImportFile(dlg.FileName);
                SceneJS scene = (SceneJS)treeView1.Nodes[0].Tag;
                scene.Import(data);
                WaitCursor(false);
            }
        }

        private void treeView1_AfterSelect(object sender, TreeViewEventArgs e)
        {
            propertyGrid1.SelectedObject = null;
            if (treeView1.SelectedNode != null)
            {
                object obj = treeView1.SelectedNode.Tag;
                if (obj != null)
                {
                    List<object> selected = new List<object>();
                    foreach (TreeNode n in treeView1.SelectedNodes)
                    {
                        selected.Add(n.Tag);
                    }

                    propertyGrid1.SelectedObjects = selected.ToArray();
                    //propertyGrid1.SelectedObject = obj;
                    //RenderObjectJS ro = (RenderObjectJS)obj;
                    //if (ro != null)
                    //{
                    //    ro.Select();
                    //}
                }
            }
        }

        private void nativeControl1_MouseClick(object sender, MouseEventArgs e)
        {
            if (treeView1.Nodes.Count > 0)
            {
                SceneJS scene = (SceneJS)treeView1.Nodes[0].Tag;
                if (scene != null)
                {
                    string hitObjects = NativeWrapper.Pick(e.X, e.Y);
                    if (hitObjects != "none")
                    {
                        string[] objs = hitObjects.Split(',');
                        RenderObjectJS ro = scene.FindRenderObject(objs[0]);
                        if (ro != null)
                        {
                            ro.Select();
                        }
                    }
                }
            }
        }

        private void nativeControl1_MouseDown(object sender, MouseEventArgs e)
        {
            // Get the drag axis from the javascript
            string dragAxes = NativeWrapper.GetDragAxis(e.X, e.Y, true);
            if (dragAxes != "none")
            {
                string[] pieces = dragAxes.Split(';');
                string[] axes = pieces[1].Split(',');

                if (axes.Length >= 6)
                {
                    mDragObjects = pieces[0];
                    for (int i = 0; i < 6; i++)
                    {
                        mDragAxes[i] = Convert.ToSingle(axes[i]);
                    }

                    mDragX = e.X;
                    mDragY = e.Y;
                }
            }
            else
            {
                // Drag the camera
            }
        }

        private void nativeControl1_MouseUp(object sender, MouseEventArgs e)
        {
            mDragObjects = null;
        }

        private void nativeControl1_MouseMove(object sender, MouseEventArgs e)
        {
            if (mDragObjects != null)
            {
                if (treeView1.Nodes.Count > 0)
                {
                    SceneJS scene = (SceneJS)treeView1.Nodes[0].Tag;
                    if (scene != null)
                    {
                        float deltaX = e.X - mDragX;
                        float deltaY = e.Y - mDragY;
                        mDragX = e.X;
                        mDragY = e.Y;

                        float dragSpeed = 0.01f;
                        float[] axesDelta = new float[6];
                        for (int i = 0; i < 3; i++)
                            axesDelta[i] = mDragAxes[i] * deltaX * dragSpeed;
                        for (int i = 3; i < 6; i++)
                            axesDelta[i] = mDragAxes[i] * deltaY * dragSpeed;

                        string[] objs = mDragObjects.Split(',');
                        foreach (string obj in objs)
                        {
                            RenderObjectJS ro = scene.FindRenderObject(obj);
                            if (ro != null)
                            {
                                ro.Position.X += axesDelta[0] + axesDelta[3];
                                ro.Position.Y += axesDelta[1] + axesDelta[4];
                                ro.Position.Z += axesDelta[2] + axesDelta[5];
                            }
                        }
                    }
                }                
            }
        }

        private void newSceneToolStripMenuItem_Click(object sender, EventArgs e)
        {
            NewScene(null);
        }

        private void NewScene(string filename)
        {
            // Save if dirty

            // Close existing scene

            // Make a new one
            WaitCursor(true);
            string sceneJson = NativeWrapper.LoadSceneFromFile(filename);
            treeView1.Nodes.Clear();
            TreeNode node = treeView1.Nodes.Add((filename != null) ? filename : "untitled");
            SceneJS scene = new SceneJS(sceneJson, node);

            if (filename == null)
                scene.CreateDefault();
            else
                scene.mFilename = filename;
            node.Tag = scene;

            WaitCursor(false);
        }

        private void nativeControl1_Load(object sender, EventArgs e)
        {
            NewScene(null);
        }

        private void copyToolStripMenuItem_Click(object sender, EventArgs e)
        {
            /*
            SceneJS scene = (SceneJS)treeView1.Nodes[0].Tag;
            if (scene != null)
            {
                object obj = scene.GetSelectedObject();
                if( obj != null )
                {
                    Clipboard.SetData("WebGLSceneObject", obj);
                }
            } 
            */

            Clipboard.Clear();
            List<object> selected = new List<object>();
            foreach (TreeNode n in treeView1.SelectedNodes)
            {
                selected.Add(n.Tag);
            }

            DataFormats.Format df = DataFormats.GetFormat(typeof(List<object>).FullName);
            IDataObject dato = new DataObject();
            dato.SetData(df.Name, false, selected);

            Clipboard.SetDataObject(dato, false);            
        }

        private void cutToolStripMenuItem_Click(object sender, EventArgs e)
        {

        }

        private void pasteToolStripMenuItem_Click(object sender, EventArgs e)
        {
            IDataObject dato = Clipboard.GetDataObject();
            if (dato != null)
            {
                string df = typeof(List<object>).FullName;
                if (dato.GetDataPresent(df))
                {
                    List<object> selected = dato.GetData(df) as List<object>;
                    if (selected != null)
                    {
                        SceneJS scene = (SceneJS)treeView1.Nodes[0].Tag;
                        foreach (object obj in selected)
                        {
                            scene.CreateCopy(obj);
                        }
                    }
                }
            }

            /*
            if (Clipboard.ContainsData("WebGLSceneObject"))
            {
                object obj = Clipboard.GetData("WebGLSceneObject");
                
                if (scene != null)
                {
                    scene.CreateCopy(obj);
                }
            }
            */
        }

        private void buildWallToolStripMenuItem_Click(object sender, EventArgs e)
        {
            SceneJS scene = (SceneJS)treeView1.Nodes[0].Tag;
            scene.BuildWall();
        }
    }
}
