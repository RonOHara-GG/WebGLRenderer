#pragma once
class ImageLoader
{
public:


    ImageLoader(void);
    ~ImageLoader(void);

    ImageLoader* LoadImage(const char* src, Handle<Function>& callback, Isolate* iso);
    void Process();

    void CreateGLTexture(int texHandle);

    
    ImageLoader*    mpNext;

    char*                   mpSrc;
    Persistent<Function>    mCallback;
};

