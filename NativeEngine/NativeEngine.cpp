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
