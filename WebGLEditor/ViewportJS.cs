using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    class ViewportJS
    {
        TreeNode mNode;

        string mName;
        string mSrc;
        float mLeft;
        float mTop;
        float mWidth;
        float mHeight;
        bool mPercentageMode;

        public ViewportJS(string name, TreeNode node)
        {
            mNode = node;
            string data = NativeWrapper.GetViewport(name);
            string[] props = data.Split(';');

            // 0:name
            mName = name;
            
            // 1:src
            mSrc = props[1];

            // 2:left
            mLeft = Convert.ToSingle(props[2]);

            // 3:top
            mTop = Convert.ToSingle(props[3]);

            // 4:width
            mWidth = Convert.ToSingle(props[4]);

            // 5:height
            mHeight = Convert.ToSingle(props[5]);

            // 6:percentageMode
            mPercentageMode = (props[6] == "true");
        }

        public string Name
        {
            get { return mName; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "viewport", "name", value))
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
                if (NativeWrapper.SetObjectAssignment(mName, "viewport", "src", value))
                    mSrc = value;
            }
        }

        public float Left
        {
            get { return mLeft; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "viewport", "left", value.ToString()))
                    mLeft = value;
            }
        }

        public float Top
        {
            get { return mTop; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "viewport", "top", value.ToString()))
                    mTop = value;
            }
        }

        public float Width
        {
            get { return mWidth; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "viewport", "width", value.ToString()))
                    mWidth = value;
            }
        }

        public float Height
        {
            get { return mHeight; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "viewport", "height", value.ToString()))
                    mHeight = value;
            }
        }

        public bool PercentageMode
        {
            get { return mPercentageMode; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "viewport", "percentageMode", value.ToString()))
                    mPercentageMode = value;
            }
        }
    }
}
