using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    class FrameBufferJS
    {
        TreeNode mNode;

        string mName;
        string mSrc;
        int mWidth;
        int mHeight;


        public FrameBufferJS(string name, TreeNode node)
        {
            mNode = node;
            string data = NativeWrapper.GetFrameBuffer(name);
            string[] props = data.Split(';');

            // 0:name
            mName = name;

            // 1:src
            mSrc = props[1];

            // 2:width
            mWidth = Convert.ToInt32(props[2]);

            // 3:height
            mHeight = Convert.ToInt32(props[3]);
        }

        public string Name
        {
            get { return mName; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "frameBuffer", "name", value))
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
                if (NativeWrapper.SetObjectAssignment(mName, "frameBuffer", "src", value))
                    mSrc = value;
            }
        }

        public int Width
        {
            get { return mWidth; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "frameBuffer", "width", value.ToString()))
                    mWidth = value;
            }
        }

        public int Height
        {
            get { return mHeight; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "frameBuffer", "height", value.ToString()))
                    mHeight = value;
            }
        }
    }
}
