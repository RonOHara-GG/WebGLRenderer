using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    class TextureJS
    {
        TreeNode mNode;

        string mName;
        string mSrc;

        public TextureJS(string name, TreeNode node)
        {
            mNode = node;
            string data = NativeWrapper.GetTexture(name);
            string[] props = data.Split(';');

            // 0:name
            mName = name;

            // 1:src
            mSrc = props[1];
        }

        public string Name
        {
            get { return mName; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "texture", "name", value))
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
                if (NativeWrapper.SetObjectAssignment(mName, "texture", "src", value))
                    mSrc = value;
            }
        }
    }
}
