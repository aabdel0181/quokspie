#include <iostream>
#include <thread>
#include <chrono>
#include <nvml.h>

nvmlDevice_t handle;
nvmlReturn_t result;
float last_power_reading = -1.0f;

void initialize()
{
    unsigned int device_count;
    char name[NVML_DEVICE_NAME_V2_BUFFER_SIZE];

    result = nvmlInit();
    if (result != NVML_SUCCESS)
    {
        std::cerr << "Failed to initialize NVML: " << nvmlErrorString(result) << std::endl;
        return;
    }
    std::cout << "NVML initialized successfully." << std::endl;

    result = nvmlDeviceGetCount(&device_count);
    if (result != NVML_SUCCESS)
    {
        std::cerr << "Failed to get device count: " << nvmlErrorString(result) << std::endl;
        return;
    }
    std::cout << "Found " << device_count << " devices." << std::endl;

    for (int i = 0; i < device_count; i++)
    {
        result = nvmlDeviceGetHandleByIndex(i, &handle);
        if (result != NVML_SUCCESS)
        {
            std::cerr << "Failed to get device handle for device " << i << ": " << nvmlErrorString(result) << std::endl;
            return;
        }

        result = nvmlDeviceGetName(handle, name, NVML_DEVICE_NAME_V2_BUFFER_SIZE);
        if (result != NVML_SUCCESS)
        {
            std::cerr << "Failed to get device name for device " << i << ": " << nvmlErrorString(result) << std::endl;
            return;
        }
        std::cout << "Device " << i << ": " << name << std::endl;
    }

    char driver_version[80];
    result = nvmlSystemGetDriverVersion(driver_version, sizeof(driver_version));
    if (result == NVML_SUCCESS)
    {
        std::cout << "Driver version: " << driver_version << std::endl;
    }
    else
    {
        std::cerr << "Failed to get driver version: " << nvmlErrorString(result) << std::endl;
    }
}

void gpu_prober()
{
    while (true)
    {
        unsigned int temperature;
        unsigned int clock_speed;
        nvmlMemory_t memory_info;
        unsigned int power;

        result = nvmlDeviceGetTemperature(handle, NVML_TEMPERATURE_GPU, &temperature);
        result = nvmlDeviceGetClockInfo(handle, NVML_CLOCK_GRAPHICS, &clock_speed);
        result = nvmlDeviceGetMemoryInfo(handle, &memory_info);
        result = nvmlDeviceGetPowerUsage(handle, &power);

        if (result == NVML_SUCCESS)
        {
            last_power_reading = power / 1000.0f;
            std::cout << "Temp: " << temperature << " C, Clock: " << clock_speed << " MHz, Power: "
                      << last_power_reading << " W, Memory Used: "
                      << memory_info.used / (1024 * 1024) << " MB" << std::endl;
        }
        else
        {
            std::cerr << "Error getting GPU metrics: " << nvmlErrorString(result) << std::endl;
            break;
        }

        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
}

void execute_workload()
{
    std::cout << "Executing our sample workload..." << std::endl;
}

int main()
{
    std::cout << "Starting program..." << std::endl;

    initialize();

    // Run the GPU prober in a separate thread
    std::thread odometer_thread(gpu_prober);
    odometer_thread.detach();

    execute_workload();

    // Keep the main thread alive to allow the odometer to run
    try
    {
        while (true)
        {
            std::this_thread::sleep_for(std::chrono::seconds(1));
        }
    }
    catch (...)
    {
        std::cerr << "Exiting..." << std::endl;
    }

    // Shutdown NVML
    nvmlShutdown();
    return 0;
}
