#include "StdAfx.h"
#include "Renderer.h"
#include <stdlib.h>

#include "js_window.h"
#include "js_console.h"
#include "jsgl.h"
#include "jsxml.h"

using namespace v8;


class MallocArrayBufferAllocator : public v8::ArrayBuffer::Allocator {
public:
  virtual void* Allocate(size_t length) { return calloc(1, length); }
  virtual void* AllocateUninitialized(size_t length) { return malloc(length); }
  virtual void Free(void* data, size_t length) { free(data); }
};


Renderer::Renderer(void)
{
    m_SceneLoadRequest = 0;
    m_DataFetchFunction = 0;
    m_FunctionParamString = 0;
    m_GlobalFunction = 0;
    m_JSONData = 0;
}

Renderer::~Renderer(void)
{
    if( m_JSONData )
        free(m_JSONData);
}

static void AlertCallback(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;
    
    HandleScope scope(args.GetIsolate());
    Handle<Value> arg = args[0];
    String::Utf8Value value(arg);

    MessageBoxA(NULL, *value, "Alert", MB_OK);
}

static void LoadXMLCallback(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;
    
    HandleScope scope(args.GetIsolate());
    Handle<Value> arg = args[0];
    String::Utf8Value value(arg);

    jsxml* xml = new jsxml();
    if( !xml->Load(*value, args.GetIsolate()) )
    {
        delete xml;
        args.GetReturnValue().Set(v8::Null());
    }
    
    Handle<Object> obj = xml->Create(args.GetIsolate());
    args.GetReturnValue().Set(obj);
}

static void LoadFileCallback(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;
    
    HandleScope scope(args.GetIsolate());
    Handle<Value> arg = args[0];
    String::Utf8Value value(arg);

    Handle<Value> fileVal = v8::Null();
    FILE* file;
    fopen_s(&file, *value, "rb");
    if( file )
    {
        fseek(file, 0, SEEK_END);
        long len = ftell(file);
        fseek(file, 0, SEEK_SET);

        char* str = (char*)malloc(len + 1);
        fread(str, 1, len, file);
        str[len] = 0;

        fileVal = Handle<String>::New(args.GetIsolate(), String::New(str, len));
        
        free(str);
        fclose(file);
    }
    
    args.GetReturnValue().Set(fileVal);
}

static void SaveFileCallback(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 2) 
        return;
    
    HandleScope scope(args.GetIsolate());
    String::Utf8Value fileName(args[0]);
    String::Utf8Value fileData(args[1]);

    HANDLE hFile = CreateFileA(*fileName, GENERIC_READ | GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if( hFile != INVALID_HANDLE_VALUE )
    {
        DWORD bytesWritten = 0;
        WriteFile(hFile, *fileData, strlen(*fileData), &bytesWritten, NULL);
        CloseHandle(hFile);
    }
}

void Renderer::InitJSEngine(HANDLE hWnd)
{
    V8::SetArrayBufferAllocator(new MallocArrayBufferAllocator());

    v8::V8::InitializeICU();
    m_Isolate = v8::Isolate::New();
    m_Isolate->Enter();
    
    // Create a handle scope to hold the temporary references.
	HandleScope handle_scope(m_Isolate);

	// Create a template for the global object where we set the built-in global functions.
	Handle<ObjectTemplate> global = ObjectTemplate::New();
    global->Set(String::New("alert"), FunctionTemplate::New(AlertCallback));
    global->Set(String::New("LoadXML"), FunctionTemplate::New(LoadXMLCallback));
    global->Set(String::New("LoadFile"), FunctionTemplate::New(LoadFileCallback));
    global->Set(String::New("SaveFile"), FunctionTemplate::New(SaveFileCallback));

    // Create the context
    Handle<Context> ctx = Context::New(m_Isolate, 0, global);
    m_V8Context.Reset(m_Isolate, ctx);

    // Enter the new context so all the following operations take place within it.
    Context::Scope context_scope(ctx);


    // Load all the JS files
    LoadJSFile("./gl-matrix.js");
    LoadJSFile("./csvToArray.v2.1.min.js");
    LoadJSFile("./renderer.js");
    LoadJSFile("./logic.js");
    LoadJSFile("./scene.js");
    LoadJSFile("./renderPass.js");
    LoadJSFile("./updatePass.js");
    LoadJSFile("./camera.js");
    LoadJSFile("./viewport.js");
    LoadJSFile("./renderObject.js");
    LoadJSFile("./frameBuffer.js");
    LoadJSFile("./mesh.js");
    LoadJSFile("./shader.js");
    LoadJSFile("./light.js");
    LoadJSFile("./texture.js");
    LoadJSFile("./collada.js");
    LoadJSFile("./colladaRipper.js");
    
    SetGlobalPersistentFunction("webGLStart", m_jsFunc_webGLStart);
    SetGlobalPersistentFunction("setupScene", m_jsFunc_setupScene);

    m_js_window = new js_window(this);
    Handle<Object> windowObj = m_js_window->Create(m_Isolate);
    ctx->Global()->Set(String::New("window"), windowObj, ReadOnly);

    m_jsgl = new jsgl((HWND)hWnd);
    Handle<Object> jsglObj = m_jsgl->Create(m_Isolate);
    ctx->Global()->Set(String::New("gl"), jsglObj);

    m_js_console = new js_console();
    Handle<Object> consoleObj = m_js_console->Create(m_Isolate);
    ctx->Global()->Set(String::New("console"), consoleObj, ReadOnly);

}

void Renderer::LoadJSFile(const char* jsFile)
{
    FILE* file;
    fopen_s(&file, jsFile, "rb");
    if( file )
    {
        fseek(file, 0, SEEK_END);
        long len = ftell(file);
        fseek(file, 0, SEEK_SET);

        if( len > 0 )
        {
            char* string = (char*)malloc(len + 1);
            fread(string, len, 1, file);
            fclose(file);
            string[len] = 0;

            Handle<Script> script = Script::Compile(String::New(string, len), String::New(jsFile, strlen(jsFile)));

            TryCatch tryCatch;
            script->Run();
            if( tryCatch.HasCaught() )
            {
                v8::Local<v8::Context> context = v8::Local<v8::Context>::New(m_Isolate, m_V8Context);
                context->Enter();
                char output[8 * 1024];

                String::Utf8Value error(tryCatch.Exception());
		        String::Utf8Value scriptName(tryCatch.Message()->GetScriptResourceName());
                sprintf_s(output, "\ns(%d,%d): %s\n", *scriptName, tryCatch.Message()->GetLineNumber(), tryCatch.Message()->GetStartColumn(), *error);
        
                OutputDebugStringA(output);
                context->Exit();
            }

            free(string);
        }
    }
}

void Renderer::RegisterFrameFunction(const char* functionString)
{
    if( m_jsFunc_frameFunc.IsEmpty() )
    {
        const char* func = strstr(functionString, "function");
        func += 8;
        while( func[0] == ' ' )
            func++;
        const char* paren = strchr(func, '(');

        int len = (int)paren - (int)func;

        char* functionName = (char*)malloc(len + 1);
        memcpy(functionName, func, len);
        functionName[len] = 0;

        SetGlobalPersistentFunction(functionName, m_jsFunc_frameFunc);

        free(functionName);
    }
}

void Renderer::SetGlobalPersistentFunction(const char* name, Persistent<Function>& pf)
{
    // Handle scope to clean up all handles created in this function
    HandleScope handle_scope(m_Isolate);

    // Create a local context from our persistant context
    v8::Local<v8::Context> context = v8::Local<v8::Context>::New(m_Isolate, m_V8Context);

    // Create a string containing the function name
	Handle<String> functionName = String::New(name, strlen(name));

    // Look up the value with the name of the function
	Handle<Value> functionValue = context->Global()->Get(functionName);
	if(functionValue->IsFunction())
	{
        // Cast to a function
		Handle<Function> func = Handle<Function>::Cast(functionValue);

        // Store in the persistent function object for later
        pf.Reset(m_Isolate, func);
	}
}

Handle<Value> Renderer::FindJSFunction(const char* name)
{
    // Handle scope to clean up all handles created in this function
    HandleScope handle_scope(m_Isolate);

    // Create a local context from our persistant context
    v8::Local<v8::Context> context = v8::Local<v8::Context>::New(m_Isolate, m_V8Context);

    // Create a string containing the function name
	Handle<String> functionName = String::New(name, strlen(name));

    // Look up the value with the name of the function
	Handle<Value> functionValue = context->Global()->Get(functionName);
	if(functionValue->IsFunction())
	{
        // Cast to a function
		Handle<Function> func = Handle<Function>::Cast(functionValue);

        return handle_scope.Close(func);
	}

    return v8::Null();
}

Handle<Value> Renderer::CallJSFunction(const v8::Persistent<v8::Function>& pfunc, int argCount, ...)
{ 
    HandleScope handle_scope(m_Isolate);
    v8::Local<v8::Context> context = v8::Local<v8::Context>::New(m_Isolate, m_V8Context);


    TryCatch tryCatch;


    Local<Object> global = context->Global();

    v8::Local<v8::Function> func = v8::Local<v8::Function>::New(m_Isolate, pfunc);

    
    va_list ap;
    va_start(ap, argCount);
    Handle<Value>* argv = (Handle<Value>*)malloc(sizeof(Handle<Value>) * argCount);

    for( int i = 0; i < argCount; i++ )
    {
        const char* argVal = va_arg(ap, const char*);
        argv[i] = Handle<Value>::New(m_Isolate, String::New(argVal));
    }
    va_end(ap);

    Handle<Value> retVal = func->Call(global, argCount, argv);

    free(argv);

    if( tryCatch.HasCaught() )
    {
        context->Enter();
        char output[8 * 1024];

        String::Utf8Value error(tryCatch.Exception());
		String::Utf8Value scriptName(tryCatch.Message()->GetScriptResourceName());
        sprintf_s(output, "\n%s(%d,%d): %s\n", *scriptName, tryCatch.Message()->GetLineNumber(), tryCatch.Message()->GetStartColumn(), *error);
        
        OutputDebugStringA(output);
        context->Exit();
        retVal = v8::Null();
    }
    
    return handle_scope.Close(retVal);
}

Handle<Value> Renderer::GetJSON(Handle<Value> object)
{
    HandleScope scope(m_Isolate);
    
    Local<Context> context = Local<Context>::New(m_Isolate, m_V8Context);
    context->Enter();
    Handle<Object> global = context->Global();

    Handle<Object> JSON = global->Get(String::New("JSON"))->ToObject();
    Handle<Function> JSON_stringify = Handle<Function>::Cast(JSON->Get(String::New("stringify")));

    Handle<Value> jsonString = JSON_stringify->Call(JSON, 1, &object);
    context->Exit();
    return scope.Close(jsonString);
}

void Renderer::FetchData()
{
    HandleScope scope(m_Isolate);
    v8::Local<v8::Context> context = v8::Local<v8::Context>::New(m_Isolate, m_V8Context);
    context->Enter();

    // Get the scene object
    Handle<Object> sceneObj = Handle<Object>::Cast(context->Global()->Get(String::New("TheScene")));

    // Find the fetch function
    Handle<Function> fetchFunc = Handle<Function>::Cast(sceneObj->Get(String::New(m_DataFetchFunction)));

    // Fetch the object
    Handle<Value> args[2];
    args[0] = String::New(m_FunctionParamString);
    args[1] = v8::Null();
    Handle<Object> retVal = Handle<Object>::Cast(fetchFunc->Call(sceneObj, 2, args));

    // Get the data from the object
    Handle<Function> stringFunc = Handle<Function>::Cast(retVal->Get(String::New("toString")));
    Handle<String> objData = Handle<String>::Cast(stringFunc->Call(retVal, 0, 0));

    // Store the data
    String::Utf8Value val(objData);
    m_JSONData = _strdup(*val);    
    
    context->Exit();
}

void Renderer::CallGlobal()
{
    HandleScope scope(m_Isolate);
    v8::Local<v8::Context> context = v8::Local<v8::Context>::New(m_Isolate, m_V8Context);
    context->Enter();

    // Get the scene object
    Handle<Object> global = context->Global();

    // Find the fetch function
    Handle<Function> fetchFunc = Handle<Function>::Cast(global->Get(String::New(m_GlobalFunction)));

    TryCatch tryCatch;

    // Fetch the object
    Handle<Value> args[2];
    args[0] = String::New(m_FunctionParamString);
    Handle<Object> retVal = Handle<Object>::Cast(fetchFunc->Call(global, 1, args));
    context->Exit();

    if( tryCatch.HasCaught() )
    {
        context->Enter();
        char output[8 * 1024];

        String::Utf8Value error(tryCatch.Exception());
		String::Utf8Value scriptName(tryCatch.Message()->GetScriptResourceName());
        sprintf_s(output, "\n%s(%d,%d): %s\n", *scriptName, tryCatch.Message()->GetLineNumber(), tryCatch.Message()->GetStartColumn(), *error);
        
        OutputDebugStringA(output);
        context->Exit();
    }

    m_GlobalFunction = 0;
}

DWORD WINAPI RenderThreadLoop(LPVOID lpThreadParameter)
{
    Renderer* renderer = (Renderer*)lpThreadParameter;

    renderer->ThreadSetup();

    while( 1 )
    {
        renderer->RunFrame();

        Sleep(0);
    }

    return 0;
}

void Renderer::ThreadSetup()
{    
    InitJSEngine(m_hWnd);

    // Load the scene
    HandleScope scope(m_Isolate);
    CallJSFunction(m_jsFunc_webGLStart, 0);
}

void Renderer::RunFrame()
{
    HandleScope scope(m_Isolate);
    if( m_SceneLoadRequest && !m_jsFunc_setupScene.IsEmpty() )
    {
        Handle<Value> sceneJson = CallJSFunction(m_jsFunc_setupScene, 1, m_SceneLoadRequest);
        m_SceneLoadRequest = 0;
     
        
        v8::Local<v8::Context> context = v8::Local<v8::Context>::New(m_Isolate, m_V8Context);
        context->Enter();
        String::Utf8Value val(sceneJson);
        m_JSONData = _strdup(*val);
        context->Exit();
    }

    if( m_DataFetchFunction && m_FunctionParamString )
    {
        FetchData();
    }

    if( m_GlobalFunction )
    {
        CallGlobal();
    }

    if( !m_jsFunc_frameFunc.IsEmpty() )
    {
        CallJSFunction(m_jsFunc_frameFunc, 0);

        m_jsgl->EndFrame();
    }
}

void Renderer::InitWindow(HANDLE hWnd)
{
    m_hWnd = hWnd;

    // Start the render thread
    CreateThread(NULL, 0, RenderThreadLoop, this, 0, &m_ThreadID);
}

void Renderer::ResizeWindow(HANDLE hWnd)
{

}

const char* Renderer::LoadScene(const char* sceneFile)
{
    if( m_JSONData )
    {
        free(m_JSONData);
        m_JSONData = 0;
    }

    m_SceneLoadRequest = sceneFile;

    while( !m_JSONData )
    {
        Sleep(200);
    }

    return m_JSONData;
}

const char* Renderer::GetUpdatePassData(const char* passName)
{
    if( m_JSONData )
    {
        free(m_JSONData);
        m_JSONData = 0;
    }

    m_DataFetchFunction = "getUpdatePass";
    m_FunctionParamString = passName;

    while( !m_JSONData )
    {
        Sleep(200);
    }

    return m_JSONData;
}

void Renderer::RipColladaFile(const char* colladaFile)
{
    m_GlobalFunction = "ripColladaFile";
    m_FunctionParamString = colladaFile;

    while( m_GlobalFunction )
    {
        Sleep(200);
    }
}