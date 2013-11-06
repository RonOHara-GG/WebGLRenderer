#pragma once
#include "v8/include/v8.h"

class Renderer
{
public:
    Renderer(void);
    ~Renderer(void);

    void InitWindow(HANDLE hWnd);
    void ResizeWindow(HANDLE hWnd);

private:
    void InitJSEngine();
    void LoadJSFile(const char* fileName);
    void SetGlobalPersistentFunction(const char* name, v8::Handle<v8::Function>& pf);


private:
    v8::Isolate*            m_Isolate;
    v8::Handle<v8::Context> m_V8Context;

    v8::Handle<v8::Function>    m_jsFunc_webGLStart;
};

