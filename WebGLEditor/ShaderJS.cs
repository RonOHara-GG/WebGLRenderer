using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    class ShaderJS
    {
        TreeNode mNode;
        string mName;
        string mSrc;
        int mMaxLights;
        int mTextureCount;
        string mVSSrc;
        string mFSSrc;

        public ShaderJS(string name, TreeNode node)
        {
            mNode = node;

            string data = NativeWrapper.GetShader(name);
            string[] props = data.Split(';');

            // 0:name
            mName = name;

            // 1:src
            mSrc = props[1];

            // 2:maxLights
            mMaxLights = Convert.ToInt32(props[2]);

            // 3:textureCount
            mTextureCount = Convert.ToInt32(props[3]);

            // 4:vsSrc
            mVSSrc = props[4];

            // 5:fsSrc
            mFSSrc = props[5];
        }

        public string Name
        {
            get { return mName; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "shader", "name", value))
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
                if (NativeWrapper.SetObjectAssignment(mName, "shader", "src", value))
                    mSrc = value;
            }
        }


        public string VertexShader
        {
            get { return mVSSrc; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "shader", "vs", value))
                    mVSSrc = value;
            }
        }


        public string FragmentShader
        {
            get { return mFSSrc; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "shader", "fs", value))
                    mFSSrc = value;
            }
        }

        public int MaxLights
        {
            get { return mMaxLights; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "shader", "maxLights", value.ToString()))
                    mMaxLights = value;
            }
        }

        public int TextureCount
        {
            get { return mTextureCount; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "shader", "textureCount", value.ToString()))
                    mTextureCount = value;
            }
        }
    }
}
