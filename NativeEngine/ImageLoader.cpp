#include "StdAfx.h"
#include "ImageLoader.h"
#include "Renderer.h"

#include "SOIL/src/SOIL.h"

extern Renderer* gRenderer;

ImageLoader::ImageLoader(void)
{
    mpNext = 0;
    mpSrc = 0;
}


ImageLoader::~ImageLoader(void)
{
    if( mpSrc )
        free(mpSrc);
}

ImageLoader* ImageLoader::LoadImage(const char* src, Handle<Function>& callback, Isolate* iso)
{
    ImageLoader* loader = new ImageLoader();
    loader->mpSrc = _strdup(src);
    loader->mCallback.Reset(iso, callback);

    loader->mpNext = mpNext;
    mpNext = loader;

    return loader;
}

void ImageLoader::Process()
{
    if( mpNext )
    {        
        ImageLoader* il = mpNext;

        // Load has been requested, call the callback
        gRenderer->CallJSFunction(il->mCallback, 0);

        // Strip this from the list
        mpNext = il->mpNext;

        // Delete it
        delete il;
    }
}

void ImageLoader::CreateGLTexture(int texHandle)
{
    SOIL_load_OGL_texture(mpSrc, 4, texHandle, SOIL_FLAG_INVERT_Y);
}