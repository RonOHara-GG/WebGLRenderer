#pragma once
#include "jsobject.h"


class jsxml : public JSObject
{
public:
    jsxml(void);
    virtual ~jsxml(void);

    bool Load(const char* xmlFilename, Isolate* isolate);

    virtual void SetupTemplate(v8::Handle<v8::ObjectTemplate> templ);
    
    
    IXMLDOMDocument* mpXMLDom;
};

