#include "headers/gpu_metrics.hpp"

namespace nvml_metrics
{

    // public interfaces for initialization and shutdown of nvml
    GPUMetrics::GPUMetrics()
    {
        initialize();
    }

    GPUMetrics::~GPUMetrics()
    {
        shutdown();
    }

    // private init implementation
    void GPUMetrics::initialize()
    {
        nvmlReturn_t result = nvmlInit();
        if (result != NVML_SUCCESS)
        {
            throw NVMLException("Failed to initialize NVML: " + std::string(nvmlErrorString(result)));
        }
    }

    void GPUMetrics::shutdown()
    {
        nvmlReturn_t result = nvmlShutdown();
        if (result != NVML_SUCCESS)
        {
            // Just log the error, don't throw in destructor
            fprintf(stderr, "Failed to shutdown NVML: %s\n", nvmlErrorString(result));
        }
    }

    unsigned int GPUMetrics::getGPUTemperature(unsigned int deviceIndex)
    {
        nvmlDevice_t device;
        nvmlReturn_t result = nvmlDeviceGetHandleByIndex(deviceIndex, &device);
        if (result != NVML_SUCCESS)
        {
            throw NVMLException("Failed to get device handle: " + std::string(nvmlErrorString(result)));
        }

        unsigned int temperature;
        result = nvmlDeviceGetTemperature(device, NVML_TEMPERATURE_GPU, &temperature);
        if (result != NVML_SUCCESS)
        {
            throw NVMLException("Failed to get GPU temperature: " + std::string(nvmlErrorString(result)));
        }

        return temperature;
    }

} // namespace nvml_metrics