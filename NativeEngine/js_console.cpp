#include "StdAfx.h"
#include "js_console.h"


js_console::js_console(void)
{
}


js_console::~js_console(void)
{
}

void LogCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;

    HandleScope scope(args.GetIsolate());
    String::Utf8Value arg(args[0]);

    OutputDebugStringA("js-log: ");
    OutputDebugStringA(*arg);
    OutputDebugStringA("\n");
}

void js_console::SetupTemplate(Handle<ObjectTemplate> templ)
{
    templ->Set(String::New("log"), FunctionTemplate::New(LogCB));
}