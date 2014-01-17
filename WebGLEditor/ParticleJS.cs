using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Drawing;

namespace WebGLEditor
{
    public class ParticleJS
    {
        TreeNode mNode;
        string mName;
        string mSrc;
        bool mCameraFacing;
        float mMinSize;
        float mMaxSize;
        float mMinLife;
        float mMaxLife;
        float mMinSpeed;
        float mMaxSpeed;
        Color[] mColors;
        string[] mTextures;

        public ParticleJS(string name, TreeNode node)
        {
            mNode = node;

            string data = NativeWrapper.GetParticle(name);
            string[] props = data.Split(';');

            // name
            mName = name;

            // src
            mSrc = props[1];

            // cameraFacing
            mCameraFacing = (props[2] == "true");

            // minSize
            mMinSize = Convert.ToSingle(props[3]);

            // maxSize
            mMaxSize = Convert.ToSingle(props[4]);

            // minLife
            mMinLife = Convert.ToSingle(props[5]);

            // maxLife
            mMaxLife = Convert.ToSingle(props[6]);

            // minSpeed
            mMinSpeed = Convert.ToSingle(props[7]);

            // maxSpeed
            mMaxSpeed = Convert.ToSingle(props[8]);

            // colors
            string[] colors = props[9].Split(':');
            mColors = new Color[colors.Length];
            for (int i = 0; i < colors.Length; i++)
            {
                string[] vals = colors[i].Split(',');
                mColors[i] = Color.FromArgb(Convert.ToInt32(vals[3]), Convert.ToInt32(vals[0]), Convert.ToInt32(vals[1]), Convert.ToInt32(vals[2]));
            }

            // textures
            mTextures = props[10].Split(',');
        }

        public string Name
        {
            get { return mName; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particle", "name", value))
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
                if (NativeWrapper.SetObjectAssignment(mName, "particle", "src", value))
                    mSrc = value;
            }
        }

        public bool CameraFacing
        {
            get { return mCameraFacing; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particle", "cameraFacing", value ? "true" : "false"))
                    mCameraFacing = value;
            }
        }

        public float MinSize
        {
            get { return mMinSize; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particle", "minSize", value.ToString()))
                    mMinSize = value;
            }
        }

        public float MaxSize
        {
            get { return mMaxSize; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particle", "maxSize", value.ToString()))
                    mMaxSize = value;
            }
        }

        public float MinLife
        {
            get { return mMinLife; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particle", "minLife", value.ToString()))
                    mMinLife = value;
            }
        }

        public float MaxLife
        {
            get { return mMaxLife; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particle", "maxLife", value.ToString()))
                    mMaxLife = value;
            }
        }

        public float MinSpeed
        {
            get { return mMinSpeed; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particle", "minSpeed", value.ToString()))
                    mMinSpeed = value;
            }
        }

        public float MaxSpeed
        {
            get { return mMaxSpeed; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particle", "maxSpeed", value.ToString()))
                    mMaxSpeed = value;
            }
        }
    }
}
