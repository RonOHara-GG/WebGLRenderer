// The following ifdef block is the standard way of creating macros which make exporting 
// from a DLL simpler. All files within this DLL are compiled with the NATIVEENGINE_EXPORTS
// symbol defined on the command line. This symbol should not be defined on any project
// that uses this DLL. This way any other project whose source files include this file see 
// NATIVEENGINE_API functions as being imported from a DLL, whereas this DLL sees symbols
// defined with this macro as being exported.
#ifdef NATIVEENGINE_EXPORTS
#define NATIVEENGINE_API __declspec(dllexport)
#else
#define NATIVEENGINE_API __declspec(dllimport)
#endif

extern "C" {

NATIVEENGINE_API void InitRenderWindow(HANDLE hWnd);
NATIVEENGINE_API void ResizeRenderWindow(HANDLE hWnd);

NATIVEENGINE_API const char* LoadScene(const char* sceneFile);
NATIVEENGINE_API void SaveScene(const char* path);
NATIVEENGINE_API const char* ImportFileData(const char* fileName);
NATIVEENGINE_API const char* FetchData(const char* fetchFunctionName, const char* objectName);
NATIVEENGINE_API const char* PickObjects(float x, float y);
NATIVEENGINE_API const char* GetDragAxes(float x, float y, bool freeMode);

NATIVEENGINE_API void RipColladaFile(const char* fileName);
NATIVEENGINE_API bool SetObjectAssignment(const char* objectName, const char* objectType, const char* propertyName, const char* propertyObject);
NATIVEENGINE_API bool AddObjectToPass(const char* passType, const char* passName, const char* objectType, const char* objectName);
NATIVEENGINE_API bool SelectSceneObject(const char* objectName, const char* objectType);

}
