using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;

namespace WebGLEditor
{
    class NativeWrapper
    {
        private static string PtrToStringUtf8(IntPtr ptr) // aPtr is nul-terminated
        {
            if (ptr == IntPtr.Zero)
                return "";
            int len = 0;
            while (System.Runtime.InteropServices.Marshal.ReadByte(ptr, len) != 0)
                len++;
            if (len == 0)
                return "";
            byte[] array = new byte[len];
            System.Runtime.InteropServices.Marshal.Copy(ptr, array, 0, len);
            return System.Text.Encoding.UTF8.GetString(array);
        }

        [DllImport("NativeEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern void InitRenderWindow(IntPtr hWnd);
        
        [DllImport("NativeEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr LoadScene(string sceneFile);
        public static string LoadSceneFromFile(string sceneFile)
        {
            IntPtr ptr = LoadScene(sceneFile);
            return PtrToStringUtf8(ptr);
        }

        [DllImport("NativeEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr GetUpdatePassData(string passName);
        public static string GetUpdatePass(string passName)
        {
            IntPtr ptr = GetUpdatePassData(passName);
            return PtrToStringUtf8(ptr);
        }

        [DllImport("NativeEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern void RipColladaFile(string fileName);
    }
}
