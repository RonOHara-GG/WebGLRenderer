using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using OpenTK.Graphics.OpenGL;

namespace WebGLEditor
{
    public class Texture : Asset
    {
        public int width = 0;
        public int height = 0;
        public PixelInternalFormat format = PixelInternalFormat.Rgba;
        public int minFilter = (int)TextureMinFilter.Nearest;
        public int magFilter = (int)TextureMagFilter.Nearest;
        public int wrapS = (int)TextureWrapMode.ClampToEdge;
        public int wrapT = (int)TextureWrapMode.ClampToEdge;
        public int glTexture = 0;

        public Texture(Scene scene, string name, string src)
            : base(scene, name, src)
        {
	        if( src != null && src.Length > 0 )
	        {
                // TODO: figure out how to load a texture!
	        }
        }

        public void Create(PixelFormat srcFormat, PixelType srcType, IntPtr srcData)
        {
            GL.GenTextures(1, out glTexture);
            GL.BindTexture(TextureTarget.Texture2D, glTexture);
            GL.TexParameterI(TextureTarget.Texture2D, TextureParameterName.TextureMinFilter, ref minFilter);
            GL.TexParameterI(TextureTarget.Texture2D,TextureParameterName.TextureMagFilter, ref magFilter);
	        GL.TexParameterI(TextureTarget.Texture2D, TextureParameterName.TextureWrapS, ref this.wrapS);
	        GL.TexParameterI(TextureTarget.Texture2D, TextureParameterName.TextureWrapT, ref this.wrapT);
            GL.TexImage2D(TextureTarget.Texture2D, 0, format, width, height, 0, srcFormat, srcType, srcData);
        }

        /*
        function TextureLoaded(tex)
        {
	        var gl = tex.scene.gl;
	        tex.glTexture = gl.createTexture();
	        gl.bindTexture(gl.TEXTURE_2D, tex.glTexture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, tex.magFilter);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, tex.minFilter);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, tex.wrapS);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, tex.wrapT);
            gl.texImage2D(gl.TEXTURE_2D, 0, tex.format, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
        }
        */

        public void Bind(int texIndex)
        {
            GL.ActiveTexture(TextureUnit.Texture0 + texIndex);
            GL.BindTexture(TextureTarget.Texture2D, glTexture);
        }

    }
}
