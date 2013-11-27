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
        public static extern void SaveScene(string path);

        [DllImport("NativeEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr ImportFileData(string fileName);
        public static string ImportFile(string fileName)
        {
            IntPtr ptr = ImportFileData(fileName);
            return PtrToStringUtf8(ptr);
        }

        [DllImport("NativeEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern void RipColladaFile(string fileName);

        [DllImport("NativeEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern bool SetObjectAssignment(string objectName, string objectType, string propertyName, string propertyObject);

        [DllImport("NativeEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern bool AddObjectToPass(string passType, string passName, string objectType, string objectName);

        [DllImport("NativeEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern bool SelectObject(string objectName, string objectType);


        
        [DllImport("NativeEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr FetchData(string fetchFunction, string objectName);
        public static string GetUpdatePass(string passName)
        {
            IntPtr ptr = FetchData("getUpdatePass", passName);
            return PtrToStringUtf8(ptr);
        }
        public static string GetRenderPass(string passName)
        {
            IntPtr ptr = FetchData("getRenderPass", passName);
            return PtrToStringUtf8(ptr);
        }
        public static string GetRenderObject(string name)
        {
            IntPtr ptr = FetchData("getRenderObject", name);
            return PtrToStringUtf8(ptr);
        }
    }
}
