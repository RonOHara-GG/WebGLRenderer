#include "StdAfx.h"
#include "js_window.h"
#include "Renderer.h"


js_window::js_window(Renderer* renderer)
{
    m_renderer = renderer;
}


js_window::~js_window(void)
{
}

void RequestAnimFrame(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    Handle<External> field = Handle<External>::Cast(args.Holder()->GetInternalField(0));
    js_window* ptr = (js_window*)field->Value();

    if (args.Length() < 1) 
        return;

    HandleScope scope(args.GetIsolate());
    String::Utf8Value functionName(args[0]);

    ptr->m_renderer->RegisterFrameFunction(*functionName);    
}

void GetWindowProperty(Local<String> prop, const PropertyCallbackInfo<Value>& info)
{
    String::Utf8Value Property(prop);

    Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
    js_window* ptr = (js_window*)field->Value();

    Handle<Value> func = ptr->m_renderer->FindJSFunction(*Property);
    if( !func->IsNull() )
        info.GetReturnValue().Set(func);
}

void js_window::SetupTemplate(Handle<ObjectTemplate> templ)
{
    templ->Set(String::New("requestAnimFrame"), FunctionTemplate::New(RequestAnimFrame));
    templ->SetNamedPropertyHandler(GetWindowProperty);
}
