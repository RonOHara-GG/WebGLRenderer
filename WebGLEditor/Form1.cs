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
        Scene theScene = null;
        HelloGL3 hg3 = null;

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            
        }

        void Application_Idle(object sender, EventArgs e)
        {
            Render();
        }

        private void Render()
        {
            if (theScene != null)
            {
                theScene.Update(0);
                theScene.Draw();
                glControl1.SwapBuffers();
            }

        }

        private void glControl1_Paint(object sender, PaintEventArgs e)
        {
            Render();
        }

        public RenderObject.UpdateCallback FindUpdateFunction(string functionName)
        {    
            return null;
        }

        private void glControl1_Load(object sender, EventArgs e)
        {        
            Console.WriteLine("glControl1_Load");

            
            //theScene = new Scene("scene.xml", glControl1.Width, glControl1.Height);        
            

            GL.Enable(EnableCap.DepthTest);

            Application.Idle += new EventHandler(Application_Idle);

            Render();
        }
    }
}
