#pragma once

class jsgl;
class js_window;
class js_console;

class Renderer
{
public:
    Renderer(void);
    ~Renderer(void);

    void InitWindow(HANDLE hWnd);
    void ResizeWindow(HANDLE hWnd);


    const char* LoadScene(const char* sceneFile);
    const char* GetUpdatePassData(const char* passName);
    void RipColladaFile(const char* fileName);

    void ThreadSetup();
    void RunFrame();
    void RegisterFrameFunction(const char* functionName);
    Handle<Value> FindJSFunction(const char* funcName);

private:
    void InitJSEngine(HANDLE hWnd);
    void LoadJSFile(const char* fileName);
    void SetGlobalPersistentFunction(const char* name, v8::Persistent<v8::Function>& pf);
    Handle<Value> CallJSFunction(const v8::Persistent<v8::Function>& pfunc, int argCount, ...);
    Handle<Value> GetJSON(Handle<Value> object);
    void FetchData();
    void CallGlobal();


public:
    v8::Isolate*                    m_Isolate;
    v8::Persistent<v8::Context>     m_V8Context;

    v8::Persistent<v8::Function>    m_jsFunc_webGLStart;
    v8::Persistent<v8::Function>    m_jsFunc_setupScene;
    v8::Persistent<v8::Function>    m_jsFunc_frameFunc;

    js_window*                      m_js_window;
    js_console*                     m_js_console;
    jsgl*                           m_jsgl;

    DWORD                           m_ThreadID;
    HANDLE                          m_hWnd;

    const char*                     m_SceneLoadRequest;
    const char*                     m_DataFetchFunction;
    const char*                     m_FunctionParamString;
    const char*                     m_GlobalFunction;
    char*                           m_JSONData;
};



