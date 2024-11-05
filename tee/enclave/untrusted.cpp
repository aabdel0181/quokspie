#include <iostream>
#include <thread>
#include <chrono>
#include <nvml.h>
#include <vector>
#include "pollPack.h"

nvmlDevice_t handle;
nvmlReturn_t result;
float last_power_reading = -1.0f;

unsigned int key;

//key can be anything, has to match the one inside the enclave to work

void keygen(asylo::EnclaveClient *client) {
    asylo::EnclaveInput input;
    asylo::EnclaveOutput output;
    input.SetExtension(my_proto::command, "GenerateKey");
    client->EnterAndRun(input, &output);
    if (!status.ok()) {
        std::cerr << "Failed to generate key" << std::endl;
        return 0;
    }
    key = output.GetExtension(my_proto::pollkey);
    std::cout << "Key: " << key << std::endl;
}

void sendHMAC(asylo::EnclaveCleint *client, pollPack pack) {
    asylo::EnclaveInput input;
    asylo::EnclaveOutput output;
    key = output.GetExtension(my_proto::pollkey);
    std::cout << "Key: " << key << std::endl;
    unsigned char hmac[EVP_MAX_MD_SIZE];
    HMAC(EVP_sha256(), key, sizeof(key), (const unsigned char*)&pack, sizeof(pack), hmac, NULL);
    //SEND PACK + HMAC TO ENCLAVE
    input.SetExtension(my_proto::command, "ValidateHmac");
    input.SetExtension(my_proto::pack, pack);
    input.SetExtension(my_proto::hmac, hmac);
    client->EnterAndRun(input, &output);
    if (!status.ok()) {
        std::cerr << "Failed to call validate hmac" << std::endl;
        return 0;
    }
    bool validated = output.GetExtension(my_proto::valid);
    if (valid) {
        std::cout << "HMAC Valid" << std::endl;
    } else {
        std::cout << "HMAC Invalid" << std::endl;
        std::cerr << "HMAC Validation failed. Exiting..." << std::endl;
        return 0;
    }
}



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
        pollPack pack;
        unsigned int temperature;
        unsigned int clock_speed;
        nvmlMemory_t memory_info;
        unsigned int power;
        unsigned int infoCount = 0;

        // Poll for temperature, clock speed, memory, power
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
            //pack.uuid = uuid
            pack.temperature = temperature;
            pack.clock_speed = clock_speed;
            pack.memory_used = memory_info.used / (1024 * 1024);
            pack.power = last_power_reading;
            sendHMAC(pack);
        }
        else
        {
            std::cerr << "Error getting GPU metrics: " << nvmlErrorString(result) << std::endl;
            break;
        }

        // Check for running compute processes
        result = nvmlDeviceGetComputeRunningProcesses_v3(handle, &infoCount, nullptr);
        if (result == NVML_SUCCESS) {
            std::vector<nvmlProcessInfo_t> infos(infoCount);
            result = nvmlDeviceGetComputeRunningProcesses_v3(handle, &infoCount, infos.data());
            // .data() is pointer to the first element of the infos array
            if (result == NVML_SUCCESS) {
                std::cout << "Compute Processes Running:" << std::endl;
                // Iterating over each element in the infos container
                // Auto automatically detects type
                for (const auto &info: infos) {
                    std::cout << "  PID: " << info.pid << ", Memory Used: "
                              << info.usedGpuMemory / (1024 * 1024) << " MB" << std::endl;
                }
            }
        }

        // Check for running graphics processes
        result = nvmlDeviceGetGraphicsRunningProcesses_v3(handle, &infoCount, nullptr);
        if (result == NVML_SUCCESS) {
            std::vector<nvmlProcessInfo_t> infos(infoCount);
            result = nvmlDeviceGetGraphicsRunningProcesses_v3(handle, &infoCount, infos.data());
            // .data() is pointer to the first element of the infos array
            if (result == NVML_SUCCESS) {
                std::cout << "Graphics Processes Running:" << std::endl;
                // Iterating over each element in the infos container
                // Auto automatically detects type
                for (const auto &info: infos) {
                    std::cout << "  PID: " << info.pid << ", Memory Used: "
                              << info.usedGpuMemory / (1024 * 1024) << " MB" << std::endl;
                }
            }
        }

        // Sleep
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
