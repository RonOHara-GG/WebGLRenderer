#include "StdAfx.h"
#include "PerfTimer.h"


PerfTimer::PerfTimer(const char* name)
{
    mName = name;
    mbRunning = false;

    LARGE_INTEGER freq;
    QueryPerformanceFrequency(&freq);

    mClocksPerSecond = (double)freq.QuadPart / 1000.0;
    mTime = 0;
}


PerfTimer::~PerfTimer(void)
{
}

void PerfTimer::Start()
{
    mbRunning = true;
    QueryPerformanceCounter(&mTimer);
}

void PerfTimer::Stop()
{
    if( mbRunning )
    {
        LARGE_INTEGER now;
        QueryPerformanceCounter(&now);
        double delta = (double)(now.QuadPart - mTimer.QuadPart) / mClocksPerSecond;
        mTime += delta;
    }
}

void PerfTimer::Print()
{
    Stop();

    char str[256];
    sprintf_s(str, sizeof(str), "%s - %fms\n", mName, mTime);
    OutputDebugStringA(str);

    mTime = 0;
}
