// NativeEngine.cpp : Defines the exported functions for the DLL application.
//

#include "stdafx.h"
#include "NativeEngine.h"
#include "Renderer.h"

Renderer* gRenderer = 0;

// This is an example of an exported function.
NATIVEENGINE_API void InitRenderWindow(HANDLE hWnd)
{
    if( !gRenderer )
    {
        gRenderer = new Renderer();
    }

    gRenderer->InitWindow(hWnd);
}

NATIVEENGINE_API void ResizeRenderWindow(HANDLE hWnd)
{
    if( gRenderer )
        gRenderer->ResizeWindow(hWnd);
}

NATIVEENGINE_API const char* LoadScene(const char* sceneFile)
{
    const char* scene = 0;
    if( gRenderer )
        scene = gRenderer->LoadScene(sceneFile);
    return scene;
}

NATIVEENGINE_API void SaveScene(const char* path)
{
    if( gRenderer )
        gRenderer->SaveScene(path);
}

NATIVEENGINE_API const char* ImportFileData(const char* fileName)
{
    const char* data = 0;
    if( gRenderer )
        data = gRenderer->ImportFileData(fileName);
    return data;
}

NATIVEENGINE_API const char* FetchData(const char* fetchFunctionName, const char* objectName)
{
    const char* data = 0;
    if( gRenderer )
        data = gRenderer->FetchData(fetchFunctionName, objectName);
    return data;
}

NATIVEENGINE_API const char* PickObjects(float x, float y)
{
    const char* data = 0;
    if( gRenderer )
        data = gRenderer->PickObjects(x, y);
    return data;
}

NATIVEENGINE_API const char* GetDragAxes(float x, float y, bool freeMode)
{
    const char* data = 0;
    if( gRenderer )
        data = gRenderer->GetDragAxes(x, y, freeMode);
    return data;
}

NATIVEENGINE_API void RipColladaFile(const char* fileName)
{
    if( gRenderer )
        gRenderer->RipColladaFile(fileName);
}

NATIVEENGINE_API bool SetObjectAssignment(const char* objectName, const char* objectType, const char* propertyName, const char* propertyObject)
{
    bool success = false;
    if( gRenderer )
        success = gRenderer->SetObjectAssignment(objectName, objectType, propertyName, propertyObject);
    return success;
}

NATIVEENGINE_API bool AddObjectToPass(const char* passType, const char* passName, const char* objectType, const char* objectName)
{
    bool success = false;
    if( gRenderer )
        success = gRenderer->AddObjectToPass(passType, passName, objectType, objectName);
    return success;
}

NATIVEENGINE_API bool SelectSceneObject(const char* objectName, const char* objectType)
{
    bool success = false;
    if( gRenderer )
        success = gRenderer->SelectObject(objectName, objectType);
    return success;
}
