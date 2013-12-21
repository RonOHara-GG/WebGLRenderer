using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;
using System.Windows.Forms;

namespace WebGLEditor
{
    public class LightJS
    {
        public enum eLightType
        {
            Dir,
        };

        TreeNode mNode;

        string mName;
        string mSrc;
        eLightType mType;
        Color mColor;
        string mDir;

        public LightJS(string name, TreeNode node)
        {
            mNode = node;
            string data = NativeWrapper.GetLight(name);
            string[] props = data.Split(';');

            // 0:name
            mName = name;

            // 1:src
            mSrc = props[1];

            // 2:type
            ParseType(props[2]);

            // 3:color
            mColor = Program.ParseColor(props[3]);

            // 4:dir
            mDir = props[4];
        }

        void ParseType(string type)
        {
            switch (type)
            {
                case "dir":
                default:
                    mType = eLightType.Dir;
                    break;
            }
        }

        string TypeToString(eLightType type)
        {
            string str = null;
            switch (type)
            {
                case eLightType.Dir:
                    str = "dir";
                    break;
            }

            return str;
        }

        public string Name
        {
            get { return mName; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "light", "name", value))
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
                if (NativeWrapper.SetObjectAssignment(mName, "light", "src", value))
                    mSrc = value;
            }
        }

        public eLightType Type
        {
            get { return mType; }
            set
            {
                string typeStr = TypeToString(value);
                if (NativeWrapper.SetObjectAssignment(mName, "light", "type", typeStr))
                    mType = value;
            }
        }

        public Color Color
        {
            get { return mColor; }
            set
            {
                string colStr = value.R + "," + value.G + "," + value.B;
                if (NativeWrapper.SetObjectAssignment(mName, "light", "color", colStr))
                    mColor = value;
            }
        }
        
        public string Dir
        {
            get { return mDir; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "light", "dir", value))
                    mDir = value;
            }
        }
    }
}
