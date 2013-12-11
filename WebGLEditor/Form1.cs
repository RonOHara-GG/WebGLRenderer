using System;
using System.Reflection;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using OpenTK;
using OpenTK.Graphics.OpenGL;
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
        
        public RenderObject.UpdateCallback FindUpdateFunction(string functionName)
        {    
            return null;
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
                UseWaitCursor = true;
                string sceneJson = NativeWrapper.LoadSceneFromFile(dlg.FileName);
                treeView1.Nodes.Clear();
                TreeNode node = treeView1.Nodes.Add(dlg.FileName);
                node.Tag = new SceneJS(sceneJson, node);
                UseWaitCursor = false;
            }
        }

        private void saveSceneToolStripMenuItem_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog dlg = new FolderBrowserDialog();
            dlg.ShowNewFolderButton = true;
            dlg.SelectedPath = Directory.GetCurrentDirectory();
            if (dlg.ShowDialog() != DialogResult.Cancel)
            {
                UseWaitCursor = true;
                NativeWrapper.SaveScene(dlg.SelectedPath);
                UseWaitCursor = false;
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
                UseWaitCursor = true;
                NativeWrapper.RipColladaFile(dlg.FileName);
                UseWaitCursor = false;
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
                UseWaitCursor = true;
                string data = NativeWrapper.ImportFile(dlg.FileName);
                SceneJS scene = (SceneJS)treeView1.Nodes[0].Tag;
                scene.Import(data);
                UseWaitCursor = false;
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
                    propertyGrid1.SelectedObject = obj;
                    RenderObjectJS ro = (RenderObjectJS)obj;
                    if (ro != null)
                    {
                        ro.Select();
                    }
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
                // Nothing to drag
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
                                string[] spos = ro.Position.Split(',');
                                string newPos = "";
                                for (int i = 0; i < 3; i++)
                                {
                                    float pos = Convert.ToSingle(spos[i]) + axesDelta[i] + axesDelta[i + 3];
                                    newPos += pos.ToString();
                                    if (i < 2)
                                        newPos += ",";
                                }
                                ro.Position = newPos;
                            }
                        }
                    }
                }                
            }
        }
    }
}
