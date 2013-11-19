#pragma once
#include "jsobject.h"

class Renderer;

class js_window : public JSObject
{
public:
    js_window(Renderer* renderer);
    virtual ~js_window(void);

    virtual void SetupTemplate(v8::Handle<v8::ObjectTemplate> templ);

    Renderer* m_renderer;
};

