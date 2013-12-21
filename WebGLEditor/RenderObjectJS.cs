using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    public class RenderObjectJS
    {
        TreeNode mNode;

        string mName;
        string mSrc;
        string mPos;
        string mRot;
        string mScale;
        string mUpdateFunction;
        string mShader;
        string mMesh;
        List<string> mTextures;
        string mShadowCamera;
        
        public RenderObjectJS(string renderObjName, TreeNode node)
        {
            mNode = node;

            mName = renderObjName;
            mSrc = "./" + renderObjName + ".xml";
            mTextures = new List<string>();
            string data = NativeWrapper.GetRenderObject(renderObjName);
            if (data != "null")
            {
                string[] rodata = data.Split(';');

                // type:name

                // src
                mSrc = rodata[1];

                // pos
                mPos = rodata[2];

                // rot
                mRot = rodata[3];

                // scale
                mScale = rodata[4];

                // updateFunction
                mUpdateFunction = rodata[5];

                // shader
                mShader = rodata[6];

                // mesh
                mMesh = rodata[7];

                // textures
                string[] textures = rodata[8].Split(',');
                foreach (string tex in textures)
                    mTextures.Add(tex);

                // shadowCamera
                mShadowCamera = rodata[9];
            }
            else
            {
            }
        }

        public void Select()
        {
            NativeWrapper.SelectSceneObject(mName, "renderObject");
        }

        public string Name
        {
            get { return mName; }
            set 
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderObject", "name", value))
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
                if( NativeWrapper.SetObjectAssignment(mName, "renderObject", "src", value))
                    mSrc = value; 
            }
        }

        public string Position
        {
            get { return mPos; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderObject", "pos", value))
                    mPos = value;
            }
        }

        public string Rotation
        {
            get { return mRot; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderObject", "rot", value))
                    mRot = value;
            }
        }

        public string Scale
        {
            get { return mScale; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderObject", "scale", value))
                    mScale = value;
            }
        }

        public string UpdateFunction
        {
            get { return mUpdateFunction; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderObject", "updateFunction", value))
                    mUpdateFunction = value;
            }
        }

        public string Shader
        {
            get { return mShader; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderObject", "shader", value))
                    mShader = value;
            }
        }

        public string Mesh
        {
            get { return mMesh; }
            set 
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderObject", "mesh", value))
                    mMesh = value;
            }
        }

        public List<string> Textures
        {
            get { return mTextures; }
            set { }
        }

        public string ShadowCamera
        {
            get { return mShadowCamera; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderObject", "shadowCamera", value))
                    mShadowCamera = value;
            }
        }
    }
}
