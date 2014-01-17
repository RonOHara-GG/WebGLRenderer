using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    public class ParticleSystemJS
    {
        TreeNode mNode;
        string mName;
        string mSrc;
        string mEmitters;


        public ParticleSystemJS(string name, TreeNode node)
        {
            mNode = node;

            string data = NativeWrapper.GetParticleSystem(name);
            string[] props = data.Split(';');

            // name
            mName = name;

            // src
            mSrc = props[1];

            mEmitters = props[2];

        }

        public string Name
        {
            get { return mName; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particleSystem", "name", value))
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
                if (NativeWrapper.SetObjectAssignment(mName, "particleSystem", "src", value))
                    mSrc = value;
            }
        }

        public string Emitters
        {
            get { return mEmitters; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "particleSystem", "emitters", value))
                    mEmitters = value;
            }
        }
    }
}
