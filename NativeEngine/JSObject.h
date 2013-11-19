#pragma once


class JSObject
{
public:
    JSObject(void);
    ~JSObject(void);

    v8::Handle<v8::Object>  Create(v8::Isolate* isolate);
    v8::Handle<v8::Object>  GetV8Object(v8::Isolate* isolate);

    virtual void SetupTemplate(v8::Handle<v8::ObjectTemplate> templ) {};

private:
    v8::Persistent<v8::Object> classObject;
};

