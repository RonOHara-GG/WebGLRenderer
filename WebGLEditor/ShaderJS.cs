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
        int mMaxDLights;
        int mMaxPLights;
        int mTextureCount;
        string mVSSrc;
        string mFSSrc;

        public ShaderJS(string name, TreeNode node)
        {
            mNode = node;

            string data = NativeWrapper.GetShader(name);
            string[] props = data.Split(';');

            // name
            mName = name;

            // src
            mSrc = props[1];

            // maxDLights
            mMaxDLights = Convert.ToInt32(props[2]);

            // maxPLights
            mMaxPLights = Convert.ToInt32(props[3]);

            // textureCount
            mTextureCount = Convert.ToInt32(props[4]);

            // vsSrc
            mVSSrc = props[5];

            // fsSrc
            mFSSrc = props[6];
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

        public int MaxDirLights
        {
            get { return mMaxDLights; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "shader", "maxDLights", value.ToString()))
                    mMaxDLights = value;
            }
        }

        public int MaxPointLights
        {
            get { return mMaxPLights; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "shader", "maxPLights", value.ToString()))
                    mMaxPLights = value;
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
