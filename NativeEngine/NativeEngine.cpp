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

NATIVEENGINE_API void UpdatePath(const char* path)
{
    if( gRenderer )
        gRenderer->UpdatePath(path);
}

NATIVEENGINE_API void SaveScene()
{
    if( gRenderer )
        gRenderer->SaveScene();
}

NATIVEENGINE_API const char* ImportFileData(const char* fileName)
{
    const char* data = 0;
    if( gRenderer )
        data = gRenderer->ImportFileData(fileName);
    return data;
}

NATIVEENGINE_API const char* FetchData(const char* fetchFunctionName, const char* objectName, bool create)
{
    const char* data = 0;
    if( gRenderer )
        data = gRenderer->FetchData(fetchFunctionName, objectName, create);
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

char gRelativePath[1024 * 8];

static int BreakDirs(char* dirs)
{
    int count = 0;
    bool endSlash = false;

    size_t totalSize = strlen(dirs);
    for( size_t i = 0; i < totalSize; i++ )
    {
        if( dirs[i] == '\\' || dirs[i] == '/' )
        {
            if( i == totalSize - 1 )
                endSlash = true;

            dirs[i] = 0;
            count++;
        }
    }
    if( !endSlash )
        count++;

    return count;
}

NATIVEENGINE_API const char* GetRelativePath(const char* path)
{
    char currentDir[2 * 1024];
    char cdrive[32];
    char cdir[2 * 1024];
    GetCurrentDirectoryA(sizeof(currentDir), currentDir);
    char* endC = &currentDir[strlen(currentDir) - 1];
    if( *endC != '\\' && *endC != '/' )
    {
        endC[1] = '/';
        endC[2] = 0;
    }
    _splitpath_s(currentDir, cdrive, sizeof(cdrive), cdir, sizeof(cdir), NULL, NULL, NULL, NULL);    

    char idrive[32];
    char idir[2 * 1024];
    char ifile[256];
    char iext[32];
    _splitpath_s(path, idrive, sizeof(idrive), idir, sizeof(idir), ifile, sizeof(ifile), iext, sizeof(iext));
    
    if( strcmp(cdrive, idrive) == 0 )
    {
        char* cptr = &cdir[1];
        char* iptr = &idir[1];
        int ccount = BreakDirs(cptr);
        int icount = BreakDirs(iptr);

        // Find matches
        while( ccount > 0 && icount > 0 )
        {
            size_t clen = strlen(cptr);
            size_t ilen = strlen(iptr);
            if( clen != ilen )
                break;  // Len doesnt match, this is obviously not a match

            if( _stricmp(cptr, iptr) != 0 )
                break;  // No match

            // Still here, they match
            // Move to the next dirs
            cptr += clen + 1;
            iptr += ilen + 1;
            ccount--;
            icount--;
        }

        // Now we are at a common root path
        char relative[4 * 1024];
        char* prel = relative;
        if( ccount )
        {
            // put one double dot for each dir remaining in current path to get to the common path
            for( int i = 0; i < ccount; i++ )
            {
                prel[0] = '.';
                prel[1] = '.';
                prel[2] = '/';
                prel += 3;
                prel[0] = 0;
            }
        }
        else
        {
            // Put a ./ for the current directory
            prel[0] = '.';
            prel[1] = '/';
            prel[2] = 0;
            prel += 2;
        }
        // put each remaining dir of the input path
        for( int i = 0; i < icount; i++ )
        {
            size_t len = strlen(iptr);
            memcpy(prel, iptr, len);
            prel += len;
            iptr += len + 1;
                        
            prel[0] = '/';
            prel[1] = 0;
            prel++;
        }
        // now add file/ext
        {
            size_t len = strlen(ifile);
            memcpy(prel, ifile, len);
            prel += len;

            len = strlen(iext);
            memcpy(prel, iext, len);
            prel += len;
            prel[0] = 0;
        }

        strcpy_s(gRelativePath, sizeof(gRelativePath), relative);
        return gRelativePath;
    }

    return 0;
}