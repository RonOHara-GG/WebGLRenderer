using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using OpenTK;
using OpenTK.Graphics.OpenGL;

namespace WebGLEditor
{
    public partial class Form1 : Form
    {
        bool loaded = false;

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            loaded = true;
        }

        private void glControl1_Paint(object sender, PaintEventArgs e)
        {
            if (loaded)
            {
                GL.ClearColor(1.0f, 0, 0, 1.0f);
                GL.Clear(ClearBufferMask.ColorBufferBit | ClearBufferMask.DepthBufferBit);
                glControl1.SwapBuffers();
            }
        }

        public RenderObject.UpdateCallback FindUpdateFunction(string functionName)
        {
            return null;
        }
    }
}
