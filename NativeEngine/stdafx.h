// stdafx.h : include file for standard system include files,
// or project specific include files that are used frequently, but
// are changed infrequently
//

#pragma once

#include "targetver.h"

#define WIN32_LEAN_AND_MEAN             // Exclude rarely-used stuff from Windows headers
// Windows Header Files:
#include <windows.h>
#include <objbase.h>
#include <msxml6.h>

#include "v8/include/v8.h"


using namespace v8;

// TODO: reference additional headers your program requires here

extern void DumpJSStack();
