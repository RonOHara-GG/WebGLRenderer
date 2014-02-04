using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;

namespace WebGLEditor
{
    public class VectorConverter : ExpandableObjectConverter
    {
        public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
        {
            return sourceType == typeof(string);
        }

        public override object ConvertFrom(ITypeDescriptorContext context, System.Globalization.CultureInfo culture, object value)
        {
            try
            {
                return new Vector((string)value);
            }
            catch
            {
                return context.PropertyDescriptor.GetValue(context.Instance);
            }
        }

        public override object ConvertTo(ITypeDescriptorContext context, System.Globalization.CultureInfo culture, object value, Type destinationType)
        {
            Vector p = (Vector)value;
            return p.ToString();
        }
    }

    [TypeConverter(typeof(ExpandableObjectConverter))]
    [Serializable]
    public class Vector
    {
        public delegate void PropertyChangedFunc();

        private float x;
        private float y;
        private float z;

        public PropertyChangedFunc ChangedCallback = null;
        
        
        public Vector(float val = 0)
        {
            x = y = z = val;
        }

        public Vector(float fx, float fy, float fz)
        {
            x = fx;
            y = fy;
            z = fz;
        }

        public Vector(string csv)
        {
            string[] vals = csv.Split(',');
            if (vals.Length >= 3)
            {
                x = Convert.ToSingle(vals[0]);
                y = Convert.ToSingle(vals[1]);
                z = Convert.ToSingle(vals[2]);
            }
        }

        public override string ToString()
        {
            return (x.ToString() + "," + y.ToString() + "," + z.ToString());
        }

        private void NotifyPropertyChanged()
        {
            if (ChangedCallback != null)
            {
                ChangedCallback();
            }
        }

        [NotifyParentProperty(true), RefreshProperties(RefreshProperties.All)]
        public float X
        {
            get { return x; }
            set { x = value; NotifyPropertyChanged(); }
        }

        [NotifyParentProperty(true), RefreshProperties(RefreshProperties.All)]
        public float Y
        {
            get { return y; }
            set { y = value; NotifyPropertyChanged(); }
        }

        [NotifyParentProperty(true), RefreshProperties(RefreshProperties.All)]
        public float Z
        {
            get { return z; }
            set { z = value; NotifyPropertyChanged(); }
        }
    }
}
