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
    void SaveScene(const char* path);
    const char* ImportFileData(const char* fileName);
    const char* FetchData(const char* dataFetchFunction, const char* objectName);
    void RipColladaFile(const char* fileName);
    bool SetObjectAssignment(const char* objectName, const char* objectType, const char* propertyName, const char* propertyObject);
    bool AddObjectToPass(const char* passType, const char* passName, const char* objectType, const char* objectName);
    bool SelectObject(const char* objectName, const char* objectType);

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
    void ErrorLog(TryCatch* tryCatch, Handle<Context>& context);
    void FetchData();
    void CallGlobal();
    void DoObjectAssignment();
    void CallSceneFunc();


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

    const char*                     m_ObjectAssignment_Object;
    const char*                     m_ObjectAssignment_ObjectType;
    const char*                     m_ObjectAssignment_Property;
    const char*                     m_ObjectAssignment_PropertyValue;
    bool                            m_ObjectAssignment_Result;

    const char*                     m_SceneFunc;
    int                             m_SceneFuncArgCount;
    const char*                     m_SceneFuncArgs[4];
    bool                            m_SceneFunc_Result;
};



