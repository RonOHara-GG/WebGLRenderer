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

NATIVEENGINE_API const char* GetUpdatePassData(const char* passName)
{
    const char* data = 0;
    if( gRenderer )
        data = gRenderer->GetUpdatePassData(passName);
    return data;
}

NATIVEENGINE_API void RipColladaFile(const char* fileName)
{
    if( gRenderer )
        gRenderer->RipColladaFile(fileName);
}