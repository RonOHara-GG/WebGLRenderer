using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    public class CameraJS
    {
        TreeNode mNode;

        string mName;
        string mSrc;
        bool mOrtho;
        float mFov;
        float mNear;
        float mFar;
        bool mStatic;
        float mLeft;
        float mRight;
        float mTop;
        float mBottom;
        bool mIdentityView;
        float mShadowDistance;
        string mPos;
        string mTarget;
        string mUp;
        string mShadowLight;

        public CameraJS(string name, TreeNode node)
        {
            mNode = node;

            string data = NativeWrapper.GetCamera(name);
            string[] props = data.Split(';');

            // 0:name
            mName = name;

            // 1:src
            mSrc = props[1];

            // 2:ortho
            mOrtho = (props[2] == "true");

            // 3:fov
            mFov = Convert.ToSingle(props[3]);

            // 4:near
            mNear = Convert.ToSingle(props[4]);

            // 5:far
            mFar = Convert.ToSingle(props[5]);

            // 6:static
            mStatic = (props[6] == "true");

            // 7:left
            mLeft = Convert.ToSingle(props[7]);

            // 8:right
            mRight = Convert.ToSingle(props[8]);

            // 9:top
            mTop = Convert.ToSingle(props[9]);

            // 10:bottom
            mBottom = Convert.ToSingle(props[10]);

            // 11:identityView
            mIdentityView = (props[11] == "true");

            // 12:shadowDistance
            mShadowDistance = Convert.ToSingle(props[12]);

            // 13:pos
            mPos = props[13];

            // 14:target
            mTarget = props[14];

            // 15:up
            mUp = props[15];

            // 16:shadowLight
            mShadowLight = props[16];
        }

        public string Name
        {
            get { return mName; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "camera", "name", value))
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
                if (NativeWrapper.SetObjectAssignment(mName, "camera", "src", value))
                    mSrc = value;
            }
        }

        public string Pos
        {
            get { return mPos; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "camera", "pos", value))
                    mPos = value;
            }
        }

        public string Target
        {
            get { return mTarget; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "camera", "target", value))
                    mTarget = value;
            }
        }

        public string Up
        {
            get { return mUp; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "camera", "up", value))
                    mUp = value;
            }
        }

        public string ShadowLight
        {
            get { return mShadowLight; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "camera", "shadowLight", value))
                    mShadowLight = value;
            }
        }

        public bool Ortho
        {
            get { return mOrtho; }
            set
            {
                if( NativeWrapper.SetObjectAssignment(mName, "camera", "ortho", value.ToString()))
                    mOrtho = value;
            }
        }

        public bool Static
        {
            get { return mStatic; }
            set
            {
                if( NativeWrapper.SetObjectAssignment(mName, "camera", "static", value.ToString()))
                    mStatic = value;
            }
        }

        public bool IdentityView
        {
            get { return mIdentityView; }
            set
            {
                if( NativeWrapper.SetObjectAssignment(mName, "camera", "identityView", value.ToString()))
                    mIdentityView = value;
            }
        }

        public float FOV
        {
            get { return mFov; }
            set
            {
                if( NativeWrapper.SetObjectAssignment(mName, "camera", "fov", value.ToString()))
                    mFov = value;
            }
        }

        public float Near
        {
            get { return mNear; }
            set
            {
                if( NativeWrapper.SetObjectAssignment(mName, "camera", "near", value.ToString()))
                    mNear = value;
            }
        }

        public float Far
        {
            get { return mFar; }
            set
            {
                if( NativeWrapper.SetObjectAssignment(mName, "camera", "far", value.ToString()))
                    mFar = value;
            }
        }

        public float Left
        {
            get { return mLeft; }
            set
            {
                if( NativeWrapper.SetObjectAssignment(mName, "camera", "left", value.ToString()))
                    mLeft = value;
            }
        }

        public float Right
        {
            get { return mRight; }
            set
            {
                if( NativeWrapper.SetObjectAssignment(mName, "camera", "right", value.ToString()))
                    mRight = value;
            }
        }

        public float Top
        {
            get { return mTop; }
            set
            {
                if( NativeWrapper.SetObjectAssignment(mName, "camera", "top", value.ToString()))
                    mTop = value;
            }
        }

        public float Botttom
        {
            get { return mBottom; }
            set
            {
                if( NativeWrapper.SetObjectAssignment(mName, "camera", "bottom", value.ToString()))
                    mBottom = value;
            }
        }

        public float ShadowDistance
        {
            get { return mShadowDistance; }
            set
            {
                if( NativeWrapper.SetObjectAssignment(mName, "camera", "shadowDistance", value.ToString()))
                    mShadowDistance = value;
            }
        }
    }
}
