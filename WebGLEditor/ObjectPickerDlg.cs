using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    public partial class ObjectPickerDlg : Form
    {
        public ObjectPickerDlg()
        {
            InitializeComponent();
        }

        private void ObjectList_SelectedIndexChanged(object sender, EventArgs e)
        {
            button1.Enabled = true;
        }
    }
}
