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
        public Form1()
        {
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
    }
}
