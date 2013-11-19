#include "StdAfx.h"
#include "jsxml.h"

using namespace v8;


jsxml::jsxml(void)
{
    mpXMLDom = 0;
}


jsxml::~jsxml(void)
{
}

bool jsxml::Load(const char* xmlFilename, Isolate* isolate)
{
    bool result = false;
    CoInitializeEx(NULL, COINIT_MULTITHREADED);

    HRESULT hr = CoCreateInstance(__uuidof(DOMDocument60), NULL, CLSCTX_INPROC_SERVER, IID_PPV_ARGS(&mpXMLDom));
    if( SUCCEEDED(hr) )
    {
        mpXMLDom->put_async(VARIANT_FALSE);
        mpXMLDom->put_validateOnParse(VARIANT_FALSE);
        mpXMLDom->put_resolveExternals(VARIANT_FALSE);
        
        wchar_t temp[2048];
        MultiByteToWideChar(CP_ACP, MB_COMPOSITE, xmlFilename, -1, temp, 2048);
        BSTR bstr = SysAllocString(temp);
        if( bstr )
        {
            VARIANT varFileName;
            V_VT(&varFileName) = VT_BSTR;
            V_BSTR(&varFileName) = bstr;

            VARIANT_BOOL varStatus;
            hr = mpXMLDom->load(varFileName, &varStatus);
            if( SUCCEEDED(hr) )
            {
                if( varStatus == VARIANT_TRUE )
                {
                    result = true;
                }
                else
                {
                    IXMLDOMParseError *pXMLErr = NULL;
                    BSTR bstrErr;

                    mpXMLDom->get_parseError(&pXMLErr);
                    pXMLErr->get_reason(&bstrErr);

                    OutputDebugString(L"\nFailed to load DOM: ");
                    OutputDebugString(bstrErr);
                    OutputDebugString(L"\n\n");

                    pXMLErr->Release();
                    SysFreeString(bstrErr);
                }
            }

            VariantClear(&varFileName);
        }
    }
   

    return result;
}

Handle<ObjectTemplate> WrapBegin()
{
    //This is just the preset for an emtpy object
	Handle<ObjectTemplate> rawTemplate = ObjectTemplate::New();

	//This is so we can store a c++ object on it
	rawTemplate->SetInternalFieldCount(1);

    return rawTemplate;
}

Handle<Object> WrapEnd(Handle<ObjectTemplate> templ, void* objectPtr)
{  
	//Create an instance of the js object 
	Handle<Object> result = templ->NewInstance();

	//Create a wrapper for the c++ instance
	Handle<External> class_ptr = External::New(objectPtr); 

	//Store the 'external c++ pointer' inside the JS object
	result->SetInternalField(0, class_ptr);

    return result;
}

Handle<Object> WrapNodeList(IXMLDOMNodeList* nodeList, Isolate* isolate);
Handle<Object> WrapNode(IXMLDOMNode* node, Isolate* isolate);
Handle<Object> WrapNamedNodeMap(IXMLDOMNamedNodeMap* nodeList, Isolate* isolate);

void NamedNodeMap_GetLength(Local<String> name, const PropertyCallbackInfo<Value>& info)
{
    Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
    IXMLDOMNamedNodeMap* ptr = (IXMLDOMNamedNodeMap*)field->Value();

    long listLength;
    ptr->get_length(&listLength);

    info.GetReturnValue().Set(listLength);
}

void NamedNodeMap_GetIndexedProperty(uint32_t index, const PropertyCallbackInfo<Value>& info)
{
    Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
    IXMLDOMNamedNodeMap* ptr = (IXMLDOMNamedNodeMap*)field->Value();

    IXMLDOMNode* node;
    ptr->get_item(index, &node);

    Handle<Object> obj = WrapNode(node, info.GetIsolate());

    info.GetReturnValue().Set(obj);
}

void NamedNodeMap_GetNamedItem(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;
    
    HandleScope scope(args.GetIsolate());
    Handle<Value> arg = args[0];
    String::Value value(arg);

    Handle<External> field = Handle<External>::Cast(args.Holder()->GetInternalField(0));
    IXMLDOMNamedNodeMap* ptr = (IXMLDOMNamedNodeMap*)field->Value();

    BSTR itemName = SysAllocString((const OLECHAR*)(*value));
    IXMLDOMNode* node;
    ptr->getNamedItem(itemName, &node);
    
    if( node )
    {
        Handle<Object> obj = WrapNode(node, args.GetIsolate());
        args.GetReturnValue().Set(obj);
    }
    else
        args.GetReturnValue().Set(v8::Null());

    
    SysFreeString(itemName);
}

void NodeList_GetLength(Local<String> name, const PropertyCallbackInfo<Value>& info)
{
    Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
    IXMLDOMNodeList* ptr = (IXMLDOMNodeList*)field->Value();

    long listLength;
    ptr->get_length(&listLength);

    info.GetReturnValue().Set(listLength);
}

void NodeList_GetIndexedProperty(uint32_t index, const PropertyCallbackInfo<Value>& info)
{
    Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
    IXMLDOMNodeList* ptr = (IXMLDOMNodeList*)field->Value();

    IXMLDOMNode* node;
    ptr->get_item(index, &node);

    Handle<Object> obj = WrapNode(node, info.GetIsolate());

    info.GetReturnValue().Set(obj);
}

void Node_GetChildNodes(Local<String> name, const PropertyCallbackInfo<Value>& info)
{
    Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
    IXMLDOMNode* ptr = (IXMLDOMNode*)field->Value();

    IXMLDOMNodeList* childNodes;
    ptr->get_childNodes(&childNodes);

    Handle<Object> obj = WrapNodeList(childNodes, info.GetIsolate());

    info.GetReturnValue().Set(obj);
}

void Node_GetNodeType(Local<String> name, const PropertyCallbackInfo<Value>& info)
{
    Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
    IXMLDOMNode* ptr = (IXMLDOMNode*)field->Value();

    DOMNodeType type;
    ptr->get_nodeType(&type);

    Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(type));

    info.GetReturnValue().Set(val);
}

void Node_GetNodeName(Local<String> name, const PropertyCallbackInfo<Value>& info)
{
    Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
    IXMLDOMNode* ptr = (IXMLDOMNode*)field->Value();

    BSTR nameStr;
    ptr->get_nodeName(&nameStr);

    Handle<String> str = Handle<String>::New(info.GetIsolate(), String::New((const uint16_t*)nameStr));

    info.GetReturnValue().Set(str);
}

void Node_GetAttributes(Local<String> name, const PropertyCallbackInfo<Value>& info)
{
    Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
    IXMLDOMNode* ptr = (IXMLDOMNode*)field->Value();

    IXMLDOMNamedNodeMap* attributes;
    ptr->get_attributes(&attributes);

    Handle<Object> obj = WrapNamedNodeMap(attributes, info.GetIsolate());

    info.GetReturnValue().Set(obj);
}

void Node_GetValue(Local<String> name, const PropertyCallbackInfo<Value>& info)
{
    Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
    IXMLDOMNode* ptr = (IXMLDOMNode*)field->Value();

    DOMNodeType type;
    ptr->get_nodeType(&type);

    Handle<Value> returnValue = v8::Null();
    if( type == NODE_ATTRIBUTE )
    {
        IXMLDOMAttribute* attr = (IXMLDOMAttribute*)ptr;

        VARIANT attribValue;
        attr->get_nodeValue(&attribValue);

        switch (attribValue.vt)
	    {
            case VT_BSTR:
                returnValue = Handle<String>::New(info.GetIsolate(), String::New((const uint16_t*)attribValue.bstrVal));
                break;
            default:
                OutputDebugString(L"Un-handled attribute value type\n");
                break;
	    }
    }

    info.GetReturnValue().Set(returnValue);
}

void Node_GetTextContext(Local<String> name, const PropertyCallbackInfo<Value>& info)
{
    Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
    IXMLDOMNode* ptr = (IXMLDOMNode*)field->Value();

    BSTR text;
    ptr->get_text(&text);

    Handle<String> str = Handle<String>::New(info.GetIsolate(), String::New((const uint16_t*)text));

    info.GetReturnValue().Set(str);
}

void Dom_GetDocumentElement(Local<String> name, const PropertyCallbackInfo<Value>& info)
{
    Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
    jsxml* ptr = (jsxml*)field->Value();

    IXMLDOMElement* pElement;
    ptr->mpXMLDom->get_documentElement(&pElement);

    Handle<Object> obj = WrapNode(pElement, info.GetIsolate());

    info.GetReturnValue().Set(obj);
}


Handle<Object> WrapNodeList(IXMLDOMNodeList* nodeList, Isolate* isolate)
{
    HandleScope scope(isolate);    	
	Handle<ObjectTemplate> rawTemplate = WrapBegin();

    rawTemplate->SetAccessor(String::NewSymbol("length"), NodeList_GetLength);
    rawTemplate->SetIndexedPropertyHandler(NodeList_GetIndexedProperty);

    Handle<Object> result = WrapEnd(rawTemplate, nodeList);

	//Return the JS object representing this class
	return scope.Close(result);
}

Handle<Object> WrapNamedNodeMap(IXMLDOMNamedNodeMap* nodeMap, Isolate* isolate)
{
    HandleScope scope(isolate);    	
	Handle<ObjectTemplate> rawTemplate = WrapBegin();

    rawTemplate->SetAccessor(String::NewSymbol("length"), NamedNodeMap_GetLength);
    rawTemplate->SetIndexedPropertyHandler(NamedNodeMap_GetIndexedProperty);    
    rawTemplate->Set(String::New("getNamedItem"), FunctionTemplate::New(NamedNodeMap_GetNamedItem));

    Handle<Object> result = WrapEnd(rawTemplate, nodeMap);

	//Return the JS object representing this class
	return scope.Close(result);
}

Handle<Object> WrapNode(IXMLDOMNode* node, Isolate* isolate)
{
    HandleScope scope(isolate);    	
	Handle<ObjectTemplate> rawTemplate = WrapBegin();

    rawTemplate->SetAccessor(String::NewSymbol("childNodes"), Node_GetChildNodes);
    rawTemplate->SetAccessor(String::NewSymbol("nodeType"), Node_GetNodeType);
    rawTemplate->SetAccessor(String::NewSymbol("nodeName"), Node_GetNodeName);
    rawTemplate->SetAccessor(String::NewSymbol("name"), Node_GetNodeName);
    rawTemplate->SetAccessor(String::NewSymbol("attributes"), Node_GetAttributes);
    rawTemplate->SetAccessor(String::NewSymbol("value"), Node_GetValue);
    rawTemplate->SetAccessor(String::NewSymbol("textContent"), Node_GetTextContext);

    Handle<Object> result = WrapEnd(rawTemplate, node);

	//Return the JS object representing this class
	return scope.Close(result);
}

void jsxml::SetupTemplate(Handle<ObjectTemplate> templ)
{
    templ->SetAccessor(String::NewSymbol("documentElement"), Dom_GetDocumentElement);
}