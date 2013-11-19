// stdafx.cpp : source file that includes just the standard includes
// NativeEngine.pch will be the pre-compiled header
// stdafx.obj will contain the pre-compiled type information

#include "stdafx.h"

// TODO: reference any additional headers you need in STDAFX.H
// and not in this file


void DumpJSStack()
{
    Local<StackTrace> st = StackTrace::CurrentStackTrace(25);

    OutputDebugStringA("\n\n--- Javascript Stack ---\n");
    for( int i = 0; i < st->GetFrameCount(); i++ )
    {
        Local<StackFrame> sf = st->GetFrame(i);

        char szOut[8 * 1024];
        String::Utf8Value scriptName(sf->GetScriptName());
        String::Utf8Value funcName(sf->GetFunctionName());
        sprintf(szOut, "%s (%d,%d):%s\n", *scriptName, sf->GetLineNumber(), sf->GetColumn(), *funcName);
        OutputDebugStringA(szOut);
    }
}