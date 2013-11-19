#include "StdAfx.h"
#include "JSObject.h"

using namespace v8;

JSObject::JSObject(void)
{
}


JSObject::~JSObject(void)
{
    classObject.Dispose();
}

Handle<Object> JSObject::Create(v8::Isolate* isolate)
{
    HandleScope scope(isolate);
    	
	//This is just the preset for an emtpy object
	Handle<ObjectTemplate> rawTemplate = ObjectTemplate::New();

	//This is so we can store a c++ object on it
	rawTemplate->SetInternalFieldCount(1);

    SetupTemplate(rawTemplate);
    
	//Create an instance of the js object 
	Handle<Object> result = rawTemplate->NewInstance();
    classObject.Reset(isolate, result);

	//Create a wrapper for the c++ instance
	Handle<External> class_ptr = External::New(this); 

	//Store the 'external c++ pointer' inside the JS object
	result->SetInternalField(0, class_ptr);

	//Return the JS object representing this class
	return scope.Close(result);
}

Handle<Object> JSObject::GetV8Object(Isolate* isolate)
{
    HandleScope scope(isolate);
    Handle<Object> obj = Handle<Object>::New(isolate, classObject);

    return scope.Close(obj);
}