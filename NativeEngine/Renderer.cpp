#include "StdAfx.h"
#include "Renderer.h"
#include <stdlib.h>

#include "js_window.h"
#include "js_console.h"
#include "jsgl.h"
#include "jsxml.h"
#include "JavaScriptFunction.h"

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
    m_ObjectAssignment_Object = 0;
    m_SceneFunc = 0;
    m_JSONData = 0;

    m_JSFunc = 0;
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
    if( !arg->IsNull() )
    {
        String::Utf8Value value(arg);

        jsxml* xml = new jsxml();
        if( !xml->Load(*value, args.GetIsolate()) )
        {
            DumpJSStack();
            delete xml;
            args.GetReturnValue().Set(v8::Null());
        }
        else
        {    
            Handle<Object> obj = xml->Create(args.GetIsolate());
            args.GetReturnValue().Set(obj);
        }
    }
    else
    {
        args.GetReturnValue().Set(v8::Null());
    }
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
        
    char* str = (char*)malloc(fileData.length() + fileName.length() + 64);
    sprintf(str, "SaveFile: %s\n%s\n", *fileName, *fileData);
    OutputDebugStringA(str);
    free(str);

    HANDLE hFile = CreateFileA(*fileName, GENERIC_READ | GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if( hFile != INVALID_HANDLE_VALUE )
    {
        DWORD bytesWritten = 0;
        WriteFile(hFile, *fileData, strlen(*fileData), &bytesWritten, NULL);
        CloseHandle(hFile);
    }
}

static void SetCurrentDirectoryCallback(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;
    
    HandleScope scope(args.GetIsolate());
    String::Utf8Value path(args[0]);

    BOOL success = SetCurrentDirectoryA(*path);
}

static void GetFullPathCallback(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;
    
    HandleScope scope(args.GetIsolate());
    String::Utf8Value path(args[0]);

    char fullPath[8 * 1024];
    GetFullPathNameA(*path, sizeof(fullPath), fullPath, NULL);

    Handle<String> str = Handle<String>::New(args.GetIsolate(), String::New(fullPath));
    args.GetReturnValue().Set(str);
}

int BreakDirs(char* dirs)
{
    int count = 0;
    bool endSlash = false;

    size_t totalSize = strlen(dirs);
    for( int i = 0; i < totalSize; i++ )
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

static void GetRelativePathCallback(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;
    
    HandleScope scope(args.GetIsolate());
    String::Utf8Value path(args[0]);

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
    _splitpath_s(*path, idrive, sizeof(idrive), idir, sizeof(idir), ifile, sizeof(ifile), iext, sizeof(iext));
    
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

            if( stricmp(cptr, iptr) != 0 )
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

        Handle<String> str = Handle<String>::New(args.GetIsolate(), String::New(relative));
        args.GetReturnValue().Set(str);
    }
    else
    {
        // Drives dont match, no way to create a relative
        args.GetReturnValue().Set(v8::Null());
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
    global->Set(String::New("SetCurrentDirectory"), FunctionTemplate::New(SetCurrentDirectoryCallback));
    global->Set(String::New("GetFullPath"), FunctionTemplate::New(GetFullPathCallback));
    global->Set(String::New("GetRelativePath"), FunctionTemplate::New(GetRelativePathCallback));

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
    LoadJSFile("./immediate.js");
    
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
                DumpJSStack();
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
        DumpJSStack();
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

void ErrorLog(TryCatch* tryCatch, Handle<Context>& context)
{  
    if( tryCatch->HasCaught() )
    {
        context->Enter();
        char output[8 * 1024];

        String::Utf8Value error(tryCatch->Exception());
		String::Utf8Value scriptName(tryCatch->Message()->GetScriptResourceName());
        sprintf_s(output, "\n%s(%d,%d): %s\n", *scriptName, tryCatch->Message()->GetLineNumber(), tryCatch->Message()->GetStartColumn(), *error);
        
        OutputDebugStringA(output);
        DumpJSStack();
        context->Exit();
    }
}

void Renderer::FetchData()
{
    HandleScope scope(m_Isolate);
    v8::Local<v8::Context> context = v8::Local<v8::Context>::New(m_Isolate, m_V8Context);
    context->Enter();

    TryCatch tryCatch;

    // Get the scene object
    Handle<Object> sceneObj = Handle<Object>::Cast(context->Global()->Get(String::New("TheScene")));

    // Find the fetch function
    Handle<Function> fetchFunc = Handle<Function>::Cast(sceneObj->Get(String::New(m_DataFetchFunction)));

    // Fetch the object
    Handle<Value> args[2];
    args[0] = String::New(m_FunctionParamString);
    args[1] = v8::Null();
    Handle<Object> retVal = Handle<Object>::Cast(fetchFunc->Call(sceneObj, 2, args));

    Handle<String> objData;
    if( *retVal )
    {
        // Get the data from the object
        Handle<Function> stringFunc = Handle<Function>::Cast(retVal->Get(String::New("toString")));
        objData = Handle<String>::Cast(stringFunc->Call(retVal, 0, 0));

        // Store the data
        String::Utf8Value val(objData);
        m_JSONData = _strdup(*val);    
    }
    else
    {
        m_JSONData = _strdup("null");
    }

    ErrorLog(&tryCatch, context);
    
    
    m_DataFetchFunction = 0;
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

    ErrorLog(&tryCatch, context);

    m_GlobalFunction = 0;
}

void Renderer::DoObjectAssignment()
{
    HandleScope scope(m_Isolate);
    v8::Local<v8::Context> context = v8::Local<v8::Context>::New(m_Isolate, m_V8Context);
    context->Enter();

    TryCatch tryCatch;

    // Get the scene object
    Handle<Object> sceneObj = Handle<Object>::Cast(context->Global()->Get(String::New("TheScene")));

    // Find the function
    Handle<Function> func = Handle<Function>::Cast(sceneObj->Get(String::New("doObjectAssignment")));

    // Do the assignment
    Handle<Value> args[4];
    args[0] = String::New(m_ObjectAssignment_Object);
    args[1] = String::New(m_ObjectAssignment_ObjectType);
    args[2] = String::New(m_ObjectAssignment_Property);
    args[3] = String::New(m_ObjectAssignment_PropertyValue);
    Local<Value> retVal = Local<Value>::Cast(func->Call(sceneObj, 4, args));

    ErrorLog(&tryCatch, context);

    m_ObjectAssignment_Result = retVal->ToBoolean()->Value();   
    m_ObjectAssignment_Object = 0;
    context->Exit();
}

void Renderer::CallSceneFunc()
{
    HandleScope scope(m_Isolate);
    v8::Local<v8::Context> context = v8::Local<v8::Context>::New(m_Isolate, m_V8Context);
    context->Enter();

    TryCatch tryCatch;

    // Get the scene object
    Handle<Object> sceneObj = Handle<Object>::Cast(context->Global()->Get(String::New("TheScene")));

    // Find the function
    Handle<Function> func = Handle<Function>::Cast(sceneObj->Get(String::New(m_SceneFunc)));

    // Call the function
    Handle<Value> args[4];
    for( int i = 0; i < m_SceneFuncArgCount; i++ )
        args[i] = String::New(m_SceneFuncArgs[i]);
    Local<Value> retVal = Local<Value>::Cast(func->Call(sceneObj, m_SceneFuncArgCount, args));

    ErrorLog(&tryCatch, context);

    m_SceneFunc_Result = retVal->ToBoolean()->Value();   
    m_SceneFunc = 0;
    context->Exit();
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
        Handle<Value> sceneJson = CallJSFunction(m_jsFunc_setupScene, 2, m_SceneLoadRequest, "NativeEngine");
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

    if( m_ObjectAssignment_Object )
    {
        DoObjectAssignment();
    }

    if( m_SceneFunc )
    {
        CallSceneFunc();
    }

    if( m_JSFunc )
    {
        m_JSFunc->Execute(m_Isolate, &m_V8Context);
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
    if( m_JSFunc )
        delete m_JSFunc;

    m_JSFunc = new JavaScriptFunction("setupScene", false, JavaScriptFunction::JST_STRING);
    m_JSFunc->AddParam(sceneFile);
    m_JSFunc->AddParam("NativeEngine");

    m_JSFunc->Call();

    return m_JSFunc->m_ReturnValue.val.s;
}

void Renderer::SaveScene(const char* path)
{
    m_GlobalFunction = "saveScene";
    m_FunctionParamString = path;

    while( m_GlobalFunction )
    {
        Sleep(200);
    }
}

const char* Renderer::ImportFileData(const char* fileName)
{
    if( m_JSONData )
    {
        free(m_JSONData);
        m_JSONData = 0;
    }

    m_DataFetchFunction = "importFile";
    m_FunctionParamString = fileName;

    while( !m_JSONData )
    {
        Sleep(200);
    }

    return m_JSONData;
}

const char* Renderer::FetchData(const char* dataFunc, const char* objName, bool create)
{
    if( m_JSFunc )
        delete m_JSFunc;

    m_JSFunc = new JavaScriptFunction(dataFunc, true, JavaScriptFunction::JST_STRING);
    m_JSFunc->AddParam(objName);
    m_JSFunc->AddParam(create? "create" : (const char*)0);

    m_JSFunc->Call();

    return m_JSFunc->m_ReturnValue.val.s;
}

const char* Renderer::PickObjects(float x, float y)
{
    if( m_JSFunc )
        delete m_JSFunc;

    m_JSFunc = new JavaScriptFunction("pickObjects", true, JavaScriptFunction::JST_STRING);
    m_JSFunc->AddParam(x);
    m_JSFunc->AddParam(y);

    m_JSFunc->Call();

    return m_JSFunc->m_ReturnValue.val.s;
}

const char* Renderer::GetDragAxes(float x, float y, bool freeMode)
{
    if( m_JSFunc )
        delete m_JSFunc;

    m_JSFunc = new JavaScriptFunction("getDragAxes", true, JavaScriptFunction::JST_STRING);
    m_JSFunc->AddParam(x);
    m_JSFunc->AddParam(y);
    m_JSFunc->AddParam(freeMode);

    m_JSFunc->Call();

    return m_JSFunc->m_ReturnValue.val.s;
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

bool Renderer::SetObjectAssignment(const char* objectName, const char* objectType, const char* propertyName, const char* propertyObject)
{
    m_SceneFunc = "doObjectAssignment";
    m_SceneFuncArgs[0] = objectName;
    m_SceneFuncArgs[1] = objectType;
    m_SceneFuncArgs[2] = propertyName;
    m_SceneFuncArgs[3] = propertyObject;
    m_SceneFuncArgCount = 4;

    while( m_SceneFunc )
    {
        Sleep(200);
    }
    return m_SceneFunc_Result;
}

bool Renderer::AddObjectToPass(const char* passType, const char* passName, const char* objectType, const char* objectName)
{
    m_SceneFunc = "addToPass";
    m_SceneFuncArgs[0] = passType;
    m_SceneFuncArgs[1] = passName;
    m_SceneFuncArgs[2] = objectType;
    m_SceneFuncArgs[3] = objectName;
    m_SceneFuncArgCount = 4;

    while( m_SceneFunc )
    {
        Sleep(200);
    }
    return m_SceneFunc_Result;
}

bool Renderer::SelectObject(const char* objectName, const char* objectType)
{
    m_SceneFunc = "selectObject";
    m_SceneFuncArgs[0] = objectName;
    m_SceneFuncArgs[1] = objectType;
    m_SceneFuncArgCount = 2;

    while( m_SceneFunc )
    {
        Sleep(200);
    }
    return m_SceneFunc_Result;
}