using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenTK;
using System.Xml;

namespace WebGLEditor
{
    public class Camera : Asset
    {
        public Vector3 pos;
        public Vector3 target;
        public Vector3 up;
        public bool ortho = false;
        public bool isStatic = false;
        public float fov = 45.0f;
        public float near = 1.0f;
        public float far = 100.0f;
        public Matrix4 proj;
        public Matrix4 view;
        public float left = 0;
        public float right = 0;
        public float top = 0;
        public float bottom = 0;
        public Light shadowLight = null;
        public float shadowDistance = 100.0f;
        public bool identityView = false;
        public bool shadowCamera = false;
        public Matrix4 shadowMatrix;


        public Camera(Scene scene, string name, string src)
            : base(scene, name, src)
        {
	        pos = new Vector3();
	        target = new Vector3();
	        up = new Vector3(0.0f, 1.0f, 0.0f);
	        proj = new Matrix4();
            view = Matrix4.Identity;

            try
            {
	            XmlDocument cameraXML = new XmlDocument();
                cameraXML.Load(src);
	        
                foreach( XmlAttribute attrib in cameraXML.DocumentElement.Attributes )
                {
			        if( attrib.Name == "ortho")
					    ortho = (attrib.Value == "true");
				    else if( attrib.Name == "fov")
					    fov = Convert.ToSingle(attrib.Value);
				    else if( attrib.Name == "near")
					    near = Convert.ToSingle(attrib.Value);
				    else if( attrib.Name == "far")
					    far = Convert.ToSingle(attrib.Value);
				    else if( attrib.Name == "left")
					    left = Convert.ToSingle(attrib.Value);
				    else if( attrib.Name == "right")
					    right = Convert.ToSingle(attrib.Value);
				    else if( attrib.Name == "top")
					    top = Convert.ToSingle(attrib.Value);
				    else if( attrib.Name == "bottom")
					    bottom = Convert.ToSingle(attrib.Value);
				    else if( attrib.Name == "static")
					    isStatic = (attrib.Value == "true");
				    else if( attrib.Name == "shadowDistance")
					    shadowDistance = Convert.ToSingle(attrib.Value);
				    else if( attrib.Name == "identityView")
					    identityView = (attrib.Value == "true");
		        }

                foreach( XmlNode child in cameraXML.DocumentElement.ChildNodes )
                {
			        if (child.NodeType == XmlNodeType.Element)
			        {
				        if (child.Name == "position")
				        {
					        var posX = Convert.ToSingle(child.Attributes.GetNamedItem("x").Value);
					        var posY = Convert.ToSingle(child.Attributes.GetNamedItem("y").Value);
					        var posZ = Convert.ToSingle(child.Attributes.GetNamedItem("z").Value);
					        pos = new Vector3(posX, posY, posZ);
				        }
				        else if (child.Name == "lookAt")
				        {
					        var lookAtX = Convert.ToSingle(child.Attributes.GetNamedItem("x").Value);
					        var lookAtY = Convert.ToSingle(child.Attributes.GetNamedItem("y").Value);
					        var lookAtZ = Convert.ToSingle(child.Attributes.GetNamedItem("z").Value);
					        target = new Vector3(lookAtX, lookAtY, lookAtZ);
				        }
				        else if (child.Name == "up")
				        {
					        var upX = Convert.ToSingle(child.Attributes.GetNamedItem("x").Value);
					        var upY = Convert.ToSingle(child.Attributes.GetNamedItem("y").Value);
					        var upZ = Convert.ToSingle(child.Attributes.GetNamedItem("z").Value);
					        up = new Vector3(upX, upY, upZ);
				        }
				        else if (child.Name == "shadowLight")
				        {
					        shadowLight = scene.GetLight(child.Attributes.GetNamedItem("name").Value, child.Attributes.GetNamedItem("src").Value);
				        }
			        }
		        }
	        }
            catch(Exception )
            {
                System.Windows.Forms.MessageBox.Show("Failed to load camera: " + src); 
            }


	        if( shadowLight != null )
	        {
		        shadowCamera = true;
		        switch( shadowLight.type )
		        {
			        case "dir":
                        Vector3 tempVec = Vector3.Multiply(shadowLight.dir, -shadowDistance);
                        pos = target;
                        pos = Vector3.Add(target, tempVec);
				        break;
			        default:
				        break;
		        }
	        }

	        if( isStatic )
		        BuildProj(1);
        }

        public void Bind(GLContext gl)
        {
	        gl.view = view;
	        gl.proj = proj;
            gl.viewProj = Matrix4.Mult(gl.view, gl.proj);
        }

        public void Update(float deltaTimeMS)
        {
	        // Update view matrix
	        if( !identityView )
                view = Matrix4.LookAt(pos, target, up);
	        else
		        view = Matrix4.Identity;
            
	        if( shadowCamera )
	        {
                Matrix4 depthScaleMtx = Matrix4.Identity;
		        depthScaleMtx.M11 = depthScaleMtx.M22 = depthScaleMtx.M33 = depthScaleMtx.M41 = depthScaleMtx.M42 = depthScaleMtx.M43 = 0.5f;
                shadowMatrix = Matrix4.Mult(Matrix4.Mult(view, proj), depthScaleMtx);
            }
        }

        public void BuildProj(float aspectRatio)
        {
	        if (ortho)
	        {
                proj = Matrix4.CreateOrthographicOffCenter(left, right, bottom, top, near, far);
	        }
	        else
	        {
                proj = Matrix4.CreatePerspectiveFieldOfView(fov * 0.0174532925f, aspectRatio, near, far);
            }

        }

        public void Resize(float aspectRatio)
        {
	        if( !isStatic )
	        {
                BuildProj(aspectRatio);
	        }
        }
    }
}
