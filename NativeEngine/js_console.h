#pragma once
#include "jsobject.h"
class js_console : public JSObject
{
public:
    js_console(void);
    virtual ~js_console(void);

    virtual void SetupTemplate(v8::Handle<v8::ObjectTemplate> templ);
};

