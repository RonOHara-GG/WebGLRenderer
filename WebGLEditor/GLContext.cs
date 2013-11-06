using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenTK;

namespace WebGLEditor
{
    public class GLContext
    {
        public int canvasWidth;
        public int canvasHeight;

        public int uMVP = -1;
        public int uWorldMtx = -1;
        public int uViewMtx = -1;
        public int uProjMtx = -1;
        public int uNrmMtx = -1;
        public int uShadowMtx = -1;

        public int shaderPositionLocation = -1;
        public int shaderNormalLocation = -1;
        public int shaderUVLocattion = -1;

        public Shader overrideShader = null;

        public Matrix4 view;
        public Matrix4 proj;
        public Matrix4 viewProj;
    }
}
