using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

namespace WebGLEditor
{
    static class Program
    {
        public static Form1 TheForm;

        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            TheForm = new Form1();
            Application.Run(TheForm);
        }
    }
}
