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
            if (dlg.ShowDialog() != System.Windows.Forms.DialogResult.Cancel)
            {
                string sceneJson = NativeWrapper.LoadSceneFromFile(dlg.FileName);
                treeView1.Nodes.Clear();
                TreeNode node = treeView1.Nodes.Add(dlg.FileName);
                node.Tag = new SceneJS(sceneJson, node);
            }
        }

        private void ripColladaFileToolStripMenuItem_Click(object sender, EventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Filter = "Collada Files (*.dae)|*.dae|All Files (*.*)|*.*";
            dlg.FilterIndex = 0;
            dlg.InitialDirectory = Directory.GetCurrentDirectory();
            if (dlg.ShowDialog() != System.Windows.Forms.DialogResult.Cancel)
            {
                NativeWrapper.RipColladaFile(dlg.FileName);
            }
        }
    }
}
