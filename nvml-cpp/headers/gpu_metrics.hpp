#pragma once

#include <string>
#include <stdexcept>

#ifdef _WIN32
#include <windows.h>
#else
#include <dlfcn.h>
#endif

class NVMLWrapper
{
private:
#ifdef _WIN32
    HMODULE nvmlLibrary;
#else
    void *nvmlLibrary;
#endif

    // Function pointer types
    typedef int (*NvmlInitFunc)();
    typedef int (*NvmlShutdownFunc)();
    // Add other function pointer types as needed

    // Function pointers
    NvmlInitFunc nvmlInit;
    NvmlShutdownFunc nvmlShutdown;
    // Add other function pointers as needed

public:
    NVMLWrapper()
    {
#ifdef _WIN32
        nvmlLibrary = LoadLibrary("nvml.dll");
#else
        nvmlLibrary = dlopen("libnvml.so", RTLD_LAZY);
#endif

        if (!nvmlLibrary)
        {
            throw std::runtime_error("Failed to load NVML library");
        }

// Load functions
#ifdef _WIN32
        nvmlInit = (NvmlInitFunc)GetProcAddress(nvmlLibrary, "nvmlInit_v2");
        nvmlShutdown = (NvmlShutdownFunc)GetProcAddress(nvmlLibrary, "nvmlShutdown");
#else
        nvmlInit = (NvmlInitFunc)dlsym(nvmlLibrary, "nvmlInit_v2");
        nvmlShutdown = (NvmlShutdownFunc)dlsym(nvmlLibrary, "nvmlShutdown");
#endif

        // Check if functions were loaded successfully
        if (!nvmlInit || !nvmlShutdown)
        {
            throw std::runtime_error("Failed to load NVML functions");
        }
    }

    ~NVMLWrapper()
    {
        if (nvmlLibrary)
        {
#ifdef _WIN32
            FreeLibrary(nvmlLibrary);
#else
            dlclose(nvmlLibrary);
#endif
        }
    }

    // Wrapper functions
    int init()
    {
        return nvmlInit();
    }

    int shutdown()
    {
        return nvmlShutdown();
    }

    // Add other wrapper functions as needed
};