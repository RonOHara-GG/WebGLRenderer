using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    public class MeshJS
    {
        TreeNode mNode;
        string mName;
        string mSrc;

        public MeshJS(string name, TreeNode node)
        {
            mNode = node;

            string data = NativeWrapper.GetMesh(name);
            string[] props = data.Split(';');

            // name
            mName = name;

            // src
            mSrc = props[1];
        }

        public string Name
        {
            get { return mName; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "mesh", "name", value))
                {
                    mName = value;
                    mNode.Text = mName;
                }
            }
        }

        public string Source
        {
            get { return mSrc; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "mesh", "src", value))
                    mSrc = value;
            }
        }
    }
}
