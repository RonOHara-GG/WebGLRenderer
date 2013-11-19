#include "StdAfx.h"
#include "jsgl.h"

#define GLEW_STATIC
#include "GL/glew.h"
#include "GL/wglew.h"

using namespace v8;


jsgl::jsgl(HWND hWnd)
{    
    mWnd = hWnd;
    CreateContext();
}


jsgl::~jsgl(void)
{
}

bool jsgl::CreateContext()
{    
    HDC dc = GetDC(mWnd);
    mDC = dc;

    PIXELFORMATDESCRIPTOR pfd;
    memset(&pfd, 0, sizeof(PIXELFORMATDESCRIPTOR));
    pfd.nSize  = sizeof(PIXELFORMATDESCRIPTOR);
    pfd.nVersion   = 1;
    pfd.dwFlags    = PFD_DOUBLEBUFFER | PFD_SUPPORT_OPENGL | PFD_DRAW_TO_WINDOW;
    pfd.iPixelType = PFD_TYPE_RGBA;
    pfd.cColorBits = 32;
    pfd.cDepthBits = 32;
    pfd.iLayerType = PFD_MAIN_PLANE;

    int nPixelFormat = ChoosePixelFormat(dc, &pfd);

    if (nPixelFormat == 0) return false;

    BOOL bResult = SetPixelFormat (dc, nPixelFormat, &pfd);

    if (!bResult) return false; 

    HGLRC tempContext = wglCreateContext(dc);
    wglMakeCurrent(dc, tempContext);

    GLenum err = glewInit();

    int attribs[] =
    {
        WGL_CONTEXT_MAJOR_VERSION_ARB, 3,
        WGL_CONTEXT_MINOR_VERSION_ARB, 1,
        WGL_CONTEXT_FLAGS_ARB, 0,
        0
    };

    if(wglewIsSupported("WGL_ARB_create_context") == 1)
    {
        mRC = wglCreateContextAttribsARB(dc, 0, attribs);
        wglMakeCurrent(NULL,NULL);
        wglDeleteContext(tempContext);
        wglMakeCurrent(dc, mRC);
    }
    else
    {       //It's not possible to make a GL 3.x context. Use the old style context (GL 2.1 and before)
        mRC = tempContext;
    }

    //Checking GL version
    const GLubyte *GLVersionString = glGetString(GL_VERSION);

    //Or better yet, use the GL3 way to get the version number
    int OpenGLVersion[2];
    glGetIntegerv(GL_MAJOR_VERSION, &OpenGLVersion[0]);
    glGetIntegerv(GL_MINOR_VERSION, &OpenGLVersion[1]);

    if (!mRC) return false;

    return true;
}

void jsgl::EndFrame()
{
    SwapBuffers(mDC);
}

void GetGLProperty(Local<String> prop, const PropertyCallbackInfo<Value>& info)
{    
    String::Utf8Value Property(prop);
    if( strcmp(*Property, "canvasWidth") == 0 )
    {
        Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
        jsgl* ptr = (jsgl*)field->Value();

        RECT rect;
        GetWindowRect(ptr->mWnd, &rect);
        int width = rect.right - rect.left;

        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(width));
        info.GetReturnValue().Set(val);
    }    
    else if( strcmp(*Property, "canvasHeight") == 0 )
    {
        Handle<External> field = Handle<External>::Cast(info.Holder()->GetInternalField(0));
        jsgl* ptr = (jsgl*)field->Value();

        RECT rect;
        GetWindowRect(ptr->mWnd, &rect);
        int height = rect.bottom - rect.top;

        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(height));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "DEPTH_TEST") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_DEPTH_TEST));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "VERTEX_SHADER") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_VERTEX_SHADER));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "FRAGMENT_SHADER") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_FRAGMENT_SHADER));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "COMPILE_STATUS") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_COMPILE_STATUS));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "LINK_STATUS") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_LINK_STATUS));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "STATIC_DRAW") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_STATIC_DRAW));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "TEXTURE_2D") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_TEXTURE_2D));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "TRIANGLES") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_TRIANGLES));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "FLOAT") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_FLOAT));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "UNSIGNED_SHORT") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_UNSIGNED_SHORT));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "UNSIGNED_BYTE") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_UNSIGNED_BYTE));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "FRAMEBUFFER") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_FRAMEBUFFER));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "ARRAY_BUFFER") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_ARRAY_BUFFER));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "ELEMENT_ARRAY_BUFFER") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_ELEMENT_ARRAY_BUFFER));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "TEXTURE0") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_TEXTURE0));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "COLOR_BUFFER_BIT") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_COLOR_BUFFER_BIT));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "DEPTH_BUFFER_BIT") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_DEPTH_BUFFER_BIT));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "STENCIL_BUFFER_BIT") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_STENCIL_BUFFER_BIT));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "RGBA") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_RGBA));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "NEAREST") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_NEAREST));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "CLAMP_TO_EDGE") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_CLAMP_TO_EDGE));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "TEXTURE_MAG_FILTER") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_TEXTURE_MAG_FILTER));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "TEXTURE_MIN_FILTER") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_TEXTURE_MIN_FILTER));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "TEXTURE_WRAP_S") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_TEXTURE_WRAP_S));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "TEXTURE_WRAP_T") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_TEXTURE_WRAP_T));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "DEPTH_COMPONENT") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_DEPTH_COMPONENT));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "COLOR_ATTACHMENT0") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_COLOR_ATTACHMENT0));
        info.GetReturnValue().Set(val);
    }
    else if( strcmp(*Property, "DEPTH_ATTACHMENT") == 0 )
    {
        Handle<Integer> val = Handle<Integer>::New(info.GetIsolate(), Int32::New(GL_DEPTH_ATTACHMENT));
        info.GetReturnValue().Set(val);
    }
    else
    {
        char first = (*Property)[0];
        if( first >= 'A' && first <= 'Z' )
        {
            OutputDebugStringA("Unhandled gl property: ");
            OutputDebugStringA(*Property);

            Local<StackTrace> st = StackTrace::CurrentStackTrace(3);
            Local<StackFrame> sf = st->GetFrame(0);

            char szOut[8 * 1024];
            String::Utf8Value scriptName(sf->GetScriptName());
            String::Utf8Value funcName(sf->GetFunctionName());
            sprintf(szOut, " -- %s (%d,%d):%s\n", *scriptName, sf->GetLineNumber(), sf->GetColumn(), *funcName);
            OutputDebugStringA(szOut);
        }
    }
}

void glEnableCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;
    
    HandleScope scope(args.GetIsolate());
    Handle<Value> arg = args[0];
    Local<Int32> argval = arg->ToInt32();

    int val = argval->Value();
    glEnable(val);
}

void glCreateShaderCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;
    
    HandleScope scope(args.GetIsolate());
    Handle<Value> arg = args[0];
    Local<Int32> argval = arg->ToInt32();

    int val = argval->Value();
    int shader = glCreateShader(val);

    Handle<Integer> shaderVal = Handle<Integer>::New(args.GetIsolate(), Int32::New(shader, args.GetIsolate()));

    args.GetReturnValue().Set(shaderVal);
}

void glShaderSourceCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 2) 
        return;
    
    HandleScope scope(args.GetIsolate());
    Local<Int32> shaderVal = args[0]->ToInt32();
    String::Utf8Value shaderSrc(args[1]);

    const GLchar* string = *shaderSrc;
    GLint strLen = shaderSrc.length();
    int shader = shaderVal->Value();
    glShaderSource(shader, 1, &string, &strLen);
}

void glCompileShaderCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;
    
    HandleScope scope(args.GetIsolate());
    Local<Int32> shaderVal = args[0]->ToInt32();
    
    int shader = shaderVal->Value();
    glCompileShader(shader);
}

void glGetShaderParameterCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 2) 
        return;

    HandleScope scope(args.GetIsolate());
    int shader = args[0]->ToInt32()->Value();
    int flag = args[1]->ToInt32()->Value();

    GLint status;
    glGetShaderiv(shader, flag, &status);
    
    bool success = status != GL_FALSE;
    Handle<Boolean> ret = Handle<Boolean>::New(args.GetIsolate(), Boolean::New(success));
    args.GetReturnValue().Set(ret);
}

void glGetShaderInfoLogCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;

    HandleScope scope(args.GetIsolate());
    int shader = args[0]->ToInt32()->Value();

    char infoData[32 * 1024];
    int length = 0;
    glGetShaderInfoLog(shader, sizeof(infoData), &length, infoData);

    Handle<String> ret = Handle<String>::New(args.GetIsolate(), String::New(infoData));
    args.GetReturnValue().Set(ret);
}

void glCreateProgramCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    int prg = glCreateProgram();

    Handle<Integer> shaderVal = Handle<Integer>::New(args.GetIsolate(), Int32::New(prg, args.GetIsolate()));

    args.GetReturnValue().Set(shaderVal);
}

void glAttachShaderCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 2) 
        return;

    HandleScope scope(args.GetIsolate());
    int program = args[0]->ToInt32()->Value();
    int shader = args[1]->ToInt32()->Value();

    glAttachShader(program, shader);
}

void glLinkProgramCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;

    HandleScope scope(args.GetIsolate());
    int program = args[0]->ToInt32()->Value();

    glLinkProgram(program);
}

void glGetProgramParameterCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 2) 
        return;

    HandleScope scope(args.GetIsolate());
    int program = args[0]->ToInt32()->Value();
    int flag = args[1]->ToInt32()->Value();

    GLint status;
    glGetProgramiv(program, flag, &status);
    
    bool success = status != GL_FALSE;
    Handle<Boolean> ret = Handle<Boolean>::New(args.GetIsolate(), Boolean::New(success));
    args.GetReturnValue().Set(ret);
}

void glGetUniformLocationCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 2) 
        return;

    HandleScope scope(args.GetIsolate());
    int program = args[0]->ToInt32()->Value();
    String::Utf8Value param(args[1]);
    
    int location = glGetUniformLocation(program, *param);
    if( location >= 0 )
    {
        Handle<Integer> ret = Handle<Integer>::New(args.GetIsolate(), Int32::New(location + 1));
        args.GetReturnValue().Set(ret);
    }
    else
        args.GetReturnValue().Set(v8::Null());
}

void glGetAttribLocationCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 2) 
        return;

    HandleScope scope(args.GetIsolate());
    int program = args[0]->ToInt32()->Value();
    String::Utf8Value param(args[1]);
    
    int location = glGetAttribLocation(program, *param);
    Handle<Integer> ret = Handle<Integer>::New(args.GetIsolate(), Int32::New(location));
    args.GetReturnValue().Set(ret);
}

void glCreateBufferCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    unsigned int buffer;
    glGenBuffers(1, &buffer);

    Handle<Integer> ret = Handle<Integer>::New(args.GetIsolate(), Int32::New(buffer));
    args.GetReturnValue().Set(ret);
}

void glBindBufferCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 2) 
        return;

    HandleScope scope(args.GetIsolate());
    int target = args[0]->ToInt32()->Value();
    int buffer = args[1]->ToInt32()->Value();

    glBindBuffer(target, buffer);
}

void glBufferDataCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 3) 
        return;

    HandleScope scope(args.GetIsolate());
    int target = args[0]->ToInt32()->Value();
    Float32Array* data = Float32Array::Cast(*args[1]);
    int usage = args[2]->ToInt32()->Value();

    glBufferData(target, data->Buffer()->ByteLength(), data->Buffer()->BaseAddress(), usage);
}

void glCreateTextureCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    unsigned int tex;
    glGenTextures(1, &tex);
        
    Handle<Integer> ret = Handle<Integer>::New(args.GetIsolate(), Int32::New(tex));
    args.GetReturnValue().Set(ret);
}

void glBindTextureCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 2) 
        return;

    HandleScope scope(args.GetIsolate());
    int target = args[0]->ToInt32()->Value();
    int tex = args[1]->ToInt32()->Value();

    glBindTexture(target, tex);
}

void glTexParameteriCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 3) 
        return;

    HandleScope scope(args.GetIsolate());
    int target = args[0]->ToInt32()->Value();
    int param = args[1]->ToInt32()->Value();
    int val = args[2]->ToInt32()->Value();

    glTexParameteri(target, param, val);            
}

void glTexImage2DCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 9) 
        return;

    HandleScope scope(args.GetIsolate());
    int target = args[0]->ToInt32()->Value();
    int level = args[1]->ToInt32()->Value();
    int internalFormat = args[2]->ToInt32()->Value();
    int width = args[3]->ToInt32()->Value();
    int height = args[4]->ToInt32()->Value();
    int border = args[5]->ToInt32()->Value();
    int format = args[6]->ToInt32()->Value();
    int type = args[7]->ToInt32()->Value();

    void* data = 0;
    bool nullData = args[8]->IsNull();
    if( !nullData )
    {        
        bool arrayData = args[8]->IsTypedArray();
        if( arrayData )
        {
            TypedArray* arr = TypedArray::Cast(*args[8]);
            data = arr->Buffer()->BaseAddress();
        }
    }

    glTexImage2D(target, level, internalFormat, width, height, border, format, type, data);
}

void glCreateFrameBufferCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    unsigned int fb;
    glGenFramebuffers(1, &fb);
        
    Handle<Integer> ret = Handle<Integer>::New(args.GetIsolate(), Int32::New(fb));
    args.GetReturnValue().Set(ret);
}

void glBindFrameBufferCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 2) 
        return;

    HandleScope scope(args.GetIsolate());
    int target = args[0]->ToInt32()->Value();
    int fb = args[1]->ToInt32()->Value();

    glBindFramebuffer(target, fb);
}

void glFrameBufferTexture2DCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 5) 
        return;

    HandleScope scope(args.GetIsolate());
    int target = args[0]->ToInt32()->Value();
    int attachment = args[1]->ToInt32()->Value();
    int textarget = args[2]->ToInt32()->Value();
    int texture = args[3]->ToInt32()->Value();
    int level = args[4]->ToInt32()->Value();

    glFramebufferTexture2D(target, attachment, textarget, texture, level);
}

void glUseProgramCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;

    HandleScope scope(args.GetIsolate());
    int prg = args[0]->ToInt32()->Value();

    glUseProgram(prg);
}

void glViewportCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 4) 
        return;

    HandleScope scope(args.GetIsolate());
    int left = args[0]->ToInt32()->Value();
    int top = args[1]->ToInt32()->Value();
    int width = args[2]->ToInt32()->Value();
    int height = args[3]->ToInt32()->Value();

    glViewport(left, top, width, height);
}

void glUniformMatrix4fvCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 3) 
        return;

    HandleScope scope(args.GetIsolate());
    int location = args[0]->ToInt32()->Value() - 1;
    int transpose = args[1]->ToInt32()->Value();
    Float32Array* values = Float32Array::Cast(*args[2]);
    
    float* data = (float*)values->Buffer()->BaseAddress();
    glUniformMatrix4fv(location, 1, transpose, data);
}

void glUniformMatrix3fvCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 3) 
        return;

    HandleScope scope(args.GetIsolate());
    int location = args[0]->ToInt32()->Value() - 1;
    int transpose = args[1]->ToInt32()->Value();
    Float32Array* values = Float32Array::Cast(*args[2]);

    glUniformMatrix3fv(location, 1, transpose, (float*)values->Buffer()->BaseAddress());
}

void glUniform3fvCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 2) 
        return;

    HandleScope scope(args.GetIsolate());
    int location = args[0]->ToInt32()->Value() - 1;
    Float32Array* values = Float32Array::Cast(*args[1]);

    glUniform3fv(location, 1, (float*)values->Buffer()->BaseAddress());
}


void glEnableVertexAttribArrayCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;

    HandleScope scope(args.GetIsolate());
    int arr = args[0]->ToInt32()->Value();

    glEnableVertexAttribArray(arr);
}

void glVertexAttribPointerCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 6) 
        return;

    HandleScope scope(args.GetIsolate());
    int index = args[0]->ToInt32()->Value();
    int size = args[1]->ToInt32()->Value();
    int type = args[2]->ToInt32()->Value();
    int nrm = args[3]->ToInt32()->Value();
    int stride = args[4]->ToInt32()->Value();    
    int offset = args[5]->ToInt32()->Value();

    glVertexAttribPointer(index, size, type, nrm, stride, (void*)offset);
}

void glDrawArraysCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 3) 
        return;

    HandleScope scope(args.GetIsolate());
    int mode = args[0]->ToInt32()->Value();
    int first = args[1]->ToInt32()->Value();
    int count = args[2]->ToInt32()->Value();

    glDrawArrays(mode, first, count);
}

void glDrawElementsCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 3) 
        return;

    HandleScope scope(args.GetIsolate());
    int mode = args[0]->ToInt32()->Value();
    int count = args[1]->ToInt32()->Value();
    int type = args[2]->ToInt32()->Value();
    int indices = args[3]->ToInt32()->Value();
    
    glDrawElements(mode, count, type, (void*)indices);
}

void glClearCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;

    HandleScope scope(args.GetIsolate());
    int bits = args[0]->ToInt32()->Value();

    glClear(bits);
}

void glClearColorCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 4) 
        return;

    HandleScope scope(args.GetIsolate());
    float red = (float)args[0]->NumberValue();
    float green = (float)args[1]->NumberValue();
    float blue = (float)args[2]->NumberValue();
    float alpha = (float)args[3]->NumberValue();

    glClearColor(red, green, blue, alpha);
}


void glActiveTextureCB(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() < 1) 
        return;

    HandleScope scope(args.GetIsolate());
    int texStage = args[0]->ToInt32()->Value();

    glActiveTexture(texStage);
}

void jsgl::SetupTemplate(Handle<ObjectTemplate> templ)
{
    templ->Set(String::New("enable"), FunctionTemplate::New(glEnableCB));
    templ->Set(String::New("createShader"), FunctionTemplate::New(glCreateShaderCB));
    templ->Set(String::New("shaderSource"), FunctionTemplate::New(glShaderSourceCB));
    templ->Set(String::New("compileShader"), FunctionTemplate::New(glCompileShaderCB));
    templ->Set(String::New("getShaderParameter"), FunctionTemplate::New(glGetShaderParameterCB));
    templ->Set(String::New("getShaderInfoLog"), FunctionTemplate::New(glGetShaderInfoLogCB));
    templ->Set(String::New("createProgram"), FunctionTemplate::New(glCreateProgramCB));
    templ->Set(String::New("attachShader"), FunctionTemplate::New(glAttachShaderCB));
    templ->Set(String::New("linkProgram"), FunctionTemplate::New(glLinkProgramCB));
    templ->Set(String::New("getProgramParameter"), FunctionTemplate::New(glGetProgramParameterCB));
    templ->Set(String::New("getUniformLocation"), FunctionTemplate::New(glGetUniformLocationCB));
    templ->Set(String::New("getAttribLocation"), FunctionTemplate::New(glGetAttribLocationCB));
    templ->Set(String::New("createBuffer"), FunctionTemplate::New(glCreateBufferCB));
    templ->Set(String::New("bindBuffer"), FunctionTemplate::New(glBindBufferCB));
    templ->Set(String::New("bufferData"), FunctionTemplate::New(glBufferDataCB));
    templ->Set(String::New("createTexture"), FunctionTemplate::New(glCreateTextureCB));
    templ->Set(String::New("bindTexture"), FunctionTemplate::New(glBindTextureCB));
    templ->Set(String::New("texParameteri"), FunctionTemplate::New(glTexParameteriCB));
    templ->Set(String::New("texImage2D"), FunctionTemplate::New(glTexImage2DCB));
    templ->Set(String::New("createFramebuffer"), FunctionTemplate::New(glCreateFrameBufferCB));
    templ->Set(String::New("bindFramebuffer"), FunctionTemplate::New(glBindFrameBufferCB));
    templ->Set(String::New("framebufferTexture2D"), FunctionTemplate::New(glFrameBufferTexture2DCB));

    templ->Set(String::New("useProgram"), FunctionTemplate::New(glUseProgramCB));
    templ->Set(String::New("viewport"), FunctionTemplate::New(glViewportCB));
    templ->Set(String::New("uniformMatrix4fv"), FunctionTemplate::New(glUniformMatrix4fvCB));
    templ->Set(String::New("uniformMatrix3fv"), FunctionTemplate::New(glUniformMatrix3fvCB));
    templ->Set(String::New("uniform3fv"), FunctionTemplate::New(glUniform3fvCB));
    templ->Set(String::New("enableVertexAttribArray"), FunctionTemplate::New(glEnableVertexAttribArrayCB));
    templ->Set(String::New("vertexAttribPointer"), FunctionTemplate::New(glVertexAttribPointerCB));
    templ->Set(String::New("drawArrays"), FunctionTemplate::New(glDrawArraysCB));
    templ->Set(String::New("drawElements"), FunctionTemplate::New(glDrawElementsCB));
    templ->Set(String::New("clear"), FunctionTemplate::New(glClearCB));
    templ->Set(String::New("clearColor"), FunctionTemplate::New(glClearColorCB));
    templ->Set(String::New("activeTexture"), FunctionTemplate::New(glActiveTextureCB));

    templ->SetNamedPropertyHandler(GetGLProperty);
}
