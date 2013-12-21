using System;
using System.Reflection;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using System.IO;
using System.Drawing;

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

        public static string LoadTextFile(string filePath)
        {
            string fileData = null;
            try
            {
                StreamReader sr = new StreamReader(File.OpenRead(filePath));
                fileData = sr.ReadToEnd();
                sr.Close();
            }
            catch (Exception)
            {
                fileData = null;
            }

            return fileData;
        }
        

        public static Color ParseColor(string color)
        {
            string[] colorVals = color.Split(',');
            Color theColor = Color.FromArgb(Convert.ToInt32(colorVals[0]), Convert.ToInt32(colorVals[1]), Convert.ToInt32(colorVals[2]));
            return theColor;
        }
    }
}
