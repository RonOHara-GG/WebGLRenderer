#pragma once
#include "jsobject.h"

class jsgl : public JSObject
{
public:
    jsgl(HWND hWnd);
    virtual ~jsgl(void);

    virtual void SetupTemplate(v8::Handle<v8::ObjectTemplate> templ);

    void EndFrame();

protected:
    bool CreateContext();

public:
    HWND mWnd;
    HDC mDC;
    HGLRC mRC;
};

