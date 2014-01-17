using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    public class ParticleEmitterJS
    {
        TreeNode mNode;
        string mName;
        string mSrc;
        string mType;
        string mPos;
        string mDir;
        float mAngle;
        float mParticlesPerSecond;
        float mMaxParticles;
        string mSortMode;
        string mParticleDefs;

        public ParticleEmitterJS(string name, TreeNode node)
        {
            mNode = node;

            string data = NativeWrapper.GetParticleEmitter(name);
            string[] props = data.Split(';');

            // name
            mName = name;

            // src
            mSrc = props[1];

            // type
            mType = props[2];

            // pos
            mPos = props[3];

            // dir
            mDir = props[4];

            // angle
            mAngle = Convert.ToSingle(props[5]);

            // particlesPerSecond
            mParticlesPerSecond = Convert.ToSingle(props[6]);

            // maxParticles
            mMaxParticles = Convert.ToSingle(props[7]);

            // sortMode
            mSortMode = props[8];

            // particleDefs
            mParticleDefs = props[9];
        }

        public string Name
        {
            get { return mName; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particleEmitter", "name", value))
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
                if (NativeWrapper.SetObjectAssignment(mName, "particleEmitter", "src", value))
                    mSrc = value;
            }
        }

        public string Type
        {
            get { return mType; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particleEmitter", "type", value))
                    mType = value;
            }
        }

        public string Position
        {
            get { return mPos; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particleEmitter", "pos", value))
                    mPos = value;
            }
        }

        public string Direction
        {
            get { return mDir; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particleEmitter", "dir", value))
                    mDir = value;
            }
        }

        public string SortMode
        {
            get { return mSortMode; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particleEmitter", "sortMode", value))
                    mSortMode = value;
            }
        }

        public string Particles
        {
            get { return mParticleDefs; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particleEmitter", "particles", value))
                    mParticleDefs = value;
            }
        }

        public float Angle
        {
            get { return mAngle; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particleEmitter", "angle", value.ToString()))
                    mAngle = value;
            }
        }

        public float ParticlesPerSecond
        {
            get { return mParticlesPerSecond; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particleEmitter", "particlesPerSecond", value.ToString()))
                    mParticlesPerSecond = value;
            }
        }

        public float MaxParticles
        {
            get { return mMaxParticles; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particleEmitter", "maxParticles", value.ToString()))
                    mMaxParticles = value;
            }
        }
    }
}
