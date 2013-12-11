#include "StdAfx.h"
#include "JavaScriptFunction.h"

void ErrorLog(TryCatch* tryCatch, Handle<Context>& context);


JavaScriptFunction::JavaScriptFunction(const char* functionName, bool sceneFunc, JavaScriptType returnType)
{
    m_IsSceneFunc = sceneFunc;
    m_FunctionName = functionName;
    m_ReturnValue.type = returnType;

    m_Params = 0;
    m_ParamCount = 0;

    m_Call = false;
}


JavaScriptFunction::~JavaScriptFunction(void)
{
    if( m_Params )
        free(m_Params);

    if( m_ReturnValue.type == JST_STRING )
    {
        if( m_ReturnValue.val.s )
            free((void*)m_ReturnValue.val.s);
    }
}

int JavaScriptFunction::AllocParam()
{
    void* old = m_Params;
    int oldCount = m_ParamCount;

    m_ParamCount++;
    m_Params = (Param*)malloc(sizeof(Param) * m_ParamCount);

    if( old )
        memcpy(m_Params, old, sizeof(Param) * oldCount);

    return oldCount;
}

void JavaScriptFunction::AddParam(float param)
{
    int oldCount = AllocParam();

    m_Params[oldCount].type = JST_FLOAT;
    m_Params[oldCount].val.f = param;
}

void JavaScriptFunction::AddParam(bool param)
{
    int oldCount = AllocParam();

    m_Params[oldCount].type = JST_BOOL;
    m_Params[oldCount].val.i = param ? 1 : 0;
}

void JavaScriptFunction::Call()
{
     m_Call = true;
     while( m_Call == true )
     {
         Sleep(200);
     }
}

void JavaScriptFunction::Execute(Isolate* isoalte, Persistent<Context>* pctx )
{
    if( m_Call )
    {
        HandleScope scope(isoalte);
        v8::Local<v8::Context> context = v8::Local<v8::Context>::New(isoalte, *pctx);
        context->Enter();

        TryCatch tryCatch;

        Handle<Object> functionContext;
        if( m_IsSceneFunc )
            functionContext = Handle<Object>::Cast(context->Global()->Get(String::New("TheScene")));
        else
            functionContext = context->Global();

        // Find the function
        Handle<Function> func = Handle<Function>::Cast(functionContext->Get(String::New(m_FunctionName)));

        // Call the function
        Handle<Value> args[4];
        for( int i = 0; i < m_ParamCount; i++ )
        {
            switch( m_Params[i].type )
            {
                case JST_STRING:
                    args[i] = String::New(m_Params[i].val.s);
                    break;
                case JST_FLOAT:
                    args[i] = Number::New(m_Params[i].val.f);
                    break;
                case JST_INT:
                    args[i] = Int32::New(m_Params[i].val.i);
                    break;
                case JST_BOOL:
                    args[i] = Boolean::New(m_Params[i].val.i != 0);
                    break;
                default:
                    int y = *((int*)0);
                    break;
            }
            
        }
        Local<Value> retVal = Local<Value>::Cast(func->Call(functionContext, m_ParamCount, args));

        ErrorLog(&tryCatch, context);

        switch( m_ReturnValue.type )
        {
            case JST_VOID:
                break;
            case JST_STRING:
                {
                    String::Utf8Value val(retVal);
                    m_ReturnValue.val.s = _strdup(*val);
                }
                break;
            case JST_FLOAT:
                m_ReturnValue.val.f = (float)retVal->ToNumber()->Value();
                break;
            case JST_INT:
                m_ReturnValue.val.i = retVal->ToInt32()->Value();
                break;
            case JST_BOOL:
                m_ReturnValue.val.i = retVal->ToBoolean()->Value() ? 1 : 0;
                break;
            default:
                break;
        }
        
        context->Exit();

        m_Call = false;
    }
}