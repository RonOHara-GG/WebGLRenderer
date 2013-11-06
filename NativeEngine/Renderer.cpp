#include "StdAfx.h"
#include "Renderer.h"
#include <stdlib.h>

using namespace v8;


Renderer::Renderer(void)
{
    InitJSEngine();
}

Renderer::~Renderer(void)
{
}

void Renderer::InitJSEngine()
{
    v8::V8::InitializeICU();
    m_Isolate = v8::Isolate::GetCurrent();

    // Create a handle scope to hold the temporary references.
	HandleScope handle_scope(m_Isolate);

	// Create a template for the global object where we set the built-in global functions.
	Handle<ObjectTemplate> global = ObjectTemplate::New();

    // Create the context
    m_V8Context = Context::New(m_Isolate, 0, global);

    // Enter the new context so all the following operations take place within it.
    m_V8Context->Enter();

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

    SetGlobalPersistentFunction("webGLStart", m_jsFunc_webGLStart);
}

void Renderer::LoadJSFile(const char* jsFile)
{
    FILE* file = fopen(jsFile, "rb");
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

            Handle<Script> script = Script::Compile(String::New(string, len));

            free(string);
        }
    }
}

void Renderer::SetGlobalPersistentFunction(const char* name, Handle<Function>& pf)
{
	Handle<String> process_name = String::New(name, strlen(name));
	Handle<Value> process_val = m_V8Context->Global()->Get(process_name);
	if(process_val->IsFunction())
	{
		Handle<Function> pf = Handle<Function>::Cast(process_val);
	}
}

void Renderer::InitWindow(HANDLE hWnd)
{
    // Setup OpenGL

    // Load the scene
    Handle<Value> args;
    m_jsFunc_webGLStart->Call(m_V8Context->Global(), 0, &args);

    // Start the render thread
}

void Renderer::ResizeWindow(HANDLE hWnd)
{
}