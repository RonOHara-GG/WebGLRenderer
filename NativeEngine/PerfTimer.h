#pragma once
class PerfTimer
{
public:
    PerfTimer(const char* name);
    ~PerfTimer(void);

    void Start();
    void Stop();
    void Print();

private:
    const char*     mName;
    bool            mbRunning;
    double          mClocksPerSecond;
    double          mTime;
    LARGE_INTEGER   mTimer;
};

