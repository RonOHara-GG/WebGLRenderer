#pragma once
class JavaScriptFunction
{
public:
    enum JavaScriptType
    {
        JST_VOID,
        JST_STRING,
        JST_FLOAT,
        JST_INT,
        JST_BOOL
    };

    struct Param
    {
        union
        {  
            int i;
            float f;
            const char* s;
        } val;

        JavaScriptType type;
    };

    JavaScriptFunction(const char* functionName, bool sceneFunc = false, JavaScriptType returnType = JST_VOID);
    ~JavaScriptFunction(void);

    void AddParam(float param);
    void AddParam(bool param);
    void AddParam(const char* param);
    void Call();

    void Execute(Isolate* isoalte, Persistent<Context>* pctx);
    

    Param           m_ReturnValue;
protected:
    bool            m_IsSceneFunc;
    const char*     m_FunctionName;

    Param*          m_Params;
    int             m_ParamCount;

    bool            m_Call;
    

    int AllocParam();
};

