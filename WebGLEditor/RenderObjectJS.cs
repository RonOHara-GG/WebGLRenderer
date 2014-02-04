using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.ComponentModel;
using System.Globalization;
using System.Collections.ObjectModel;
using System.Collections.Specialized;

namespace WebGLEditor
{
    [Serializable]
    public class RenderObjectJS
    {
        TreeNode mNode;

        string mName;
        string mSrc;
        Vector mPos;
        Vector mRot;
        Vector mScale;
        string mUpdateFunction;
        string mShader;
        string mMesh;
        //ObservableCollection<string> mTextures;
        string mTexture;
        string mShadowCamera;
        
        public RenderObjectJS(string renderObjName, TreeNode node)
        {
            mNode = node;

            mName = renderObjName;
            mSrc = "./" + renderObjName + ".xml";
            //mTextures = new ObservableCollection<string>();
            string data = NativeWrapper.GetRenderObject(renderObjName);
            if (data != "null")
            {
                string[] rodata = data.Split(';');

                // type:name

                // src
                mSrc = rodata[1];

                // pos
                mPos = new Vector(rodata[2]);

                // rot
                mRot = new Vector(rodata[3]);

                // scale
                mScale = new Vector(rodata[4]);

                // updateFunction
                mUpdateFunction = rodata[5];

                // shader
                mShader = rodata[6];

                // mesh
                mMesh = rodata[7];

                // textures
                mTexture = rodata[8];
                //string[] textures = rodata[8].Split(',');
                //foreach (string tex in textures)
                //{
                //    if( tex.Length > 0 )
                //        mTextures.Add(tex);
                //}

                // shadowCamera
                mShadowCamera = rodata[9];
            }
            else
            {
            }


            //mTextures.CollectionChanged += TexturesChanged;
            mPos.ChangedCallback = onPositionChanged;
            mRot.ChangedCallback = onRotationChanged;
            mScale.ChangedCallback = onScaleChanged;
        }

        public void CopyFrom(RenderObjectJS other)
        {
            mPos.X = other.Position.X;
            mPos.Y = other.Position.Y;
            mPos.Z = other.Position.Z;

            Rotation.X = other.Rotation.X;
            Rotation.Y = other.Rotation.Y;
            Rotation.Z = other.Rotation.Z;
            Scale.X = other.Scale.X;
            Scale.Y = other.Scale.Y;
            Scale.Z = other.Scale.Z;

            UpdateFunction = other.mUpdateFunction;
            Shader = other.mShader;
            Mesh = other.mMesh;

            Texture = other.mTexture;
            //mTextures.Clear();
            //foreach (string str in other.mTextures)
            //{
            //    mTextures.Add(str);
            //}
            ShadowCamera = other.mShadowCamera;
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

        private void onPositionChanged()
        {
            NativeWrapper.SetObjectAssignment(mName, "renderObject", "pos", mPos.ToString());
        }

        private void onRotationChanged()
        {
            NativeWrapper.SetObjectAssignment(mName, "renderObject", "rot", mRot.ToString());
        }

        private void onScaleChanged()
        {
            NativeWrapper.SetObjectAssignment(mName, "renderObject", "scale", mScale.ToString());
        }

        public Vector Position
        {
            get { return mPos; }
            set { }
        }

        public Vector Rotation
        {
            get { return mRot; }
            set { }
        }

        public Vector Scale
        {
            get { return mScale; }
            set { }
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

        public string Texture
        {
            get { return mTexture; }
            set
            {
                if (NativeWrapper.SetObjectAssignment(mName, "renderObject", "textures", value))
                    mTexture = value;
            }
        }

        /*
        [Editor(@"System.Windows.Forms.Design.StringCollectionEditor, System.Design, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a", typeof(System.Drawing.Design.UITypeEditor))]
        [TypeConverter(typeof(CsvConverter))]
        public ObservableCollection<string> Textures
        {
            get { return mTextures; }
            set { }
        }

        private void TexturesChanged(object sender, NotifyCollectionChangedEventArgs e)
        {
            string textures = String.Join(",", mTextures.ToArray());
            NativeWrapper.SetObjectAssignment(mName, "renderObject", "textures", textures);
        }
        */

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

    public class CsvConverter : TypeConverter
    {
        // Overrides the ConvertTo method of TypeConverter.
        public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType)
        {
            ObservableCollection<String> v = value as ObservableCollection<String>;
            if (destinationType == typeof(string))
            {
                return String.Join(",", v.ToArray());
            }
            return base.ConvertTo(context, culture, value, destinationType);
        }
    }
}
