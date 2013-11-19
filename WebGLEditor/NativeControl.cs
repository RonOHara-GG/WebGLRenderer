using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    public partial class NativeControl : UserControl
    {
        public NativeControl()
        {
            InitializeComponent();
        }

        private void NativeControl_Load(object sender, EventArgs e)
        {
            if (!DesignMode)
            {
                try
                {
                    NativeWrapper.InitRenderWindow(Handle);
                }
                catch (Exception exc)
                {
                    MessageBox.Show(exc.Message);
                }
            }
        }
    }
}
