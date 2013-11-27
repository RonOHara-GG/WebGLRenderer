using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    public class RenderObjectJS
    {
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
        
        public RenderObjectJS(string renderObjName)
        {
            mName = renderObjName;
            mSrc = "./" + renderObjName + ".xml";
            mTextures = new List<string>();
            string data = NativeWrapper.GetRenderObject(renderObjName);
            if (data != "null")
            {
                string[] rodata = data.Split(';');

                // type
                // name

                // src
                mSrc = rodata[2];

                // pos
                mPos = rodata[3];

                // rot
                mRot = rodata[4];

                // scale
                mScale = rodata[5];

                // updateFunction
                mUpdateFunction = rodata[6];

                // shader
                mShader = rodata[7];

                // mesh
                mMesh = rodata[8];

                // textures
                string[] textures = rodata[9].Split(',');
                foreach (string tex in textures)
                    mTextures.Add(tex);

                // shadowCamera
                mShadowCamera = rodata[10];
            }
            else
            {
            }
        }

        public void Select()
        {
            NativeWrapper.SelectObject(mName, "renderObject");
        }

        public string Name
        {
            get { return mName; }
            set 
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderObject", "name", value))
                    mName = value;
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
