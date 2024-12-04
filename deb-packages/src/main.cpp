#include <syslog.h>
#include <unistd.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <iostream>
#include <thread>
#include <chrono>
#include <nvml.h>
#include <vector>
#include <sstream>
nvmlDevice_t handle;
nvmlReturn_t result;
float last_power_reading = -1.0f;
char uuid[96]; // Buffer to store the UUID

void log_message(int priority, const std::string &message)
{
    syslog(priority, "%s", message.c_str());
}

void initialize()
{
    unsigned int device_count;
    char name[NVML_DEVICE_NAME_V2_BUFFER_SIZE];

    result = nvmlInit();
    if (result != NVML_SUCCESS)
    {
        // std::cerr << "Failed to initialize NVML: " << nvmlErrorString(result) << std::endl;
        std::ostringstream log;
        log << "Failed to initialize NVML: " << nvmlErrorString(result);
        log_message(LOG_ERR, log.str());

        return;
    }
    // std::cout << "NVML initialized successfully." << std::endl;
    log_message(LOG_INFO, "NVML initialized successfully.");
    // std::cout << "NVML initialized successfully." << std::endl;

    result = nvmlDeviceGetCount(&device_count);
    if (result != NVML_SUCCESS)
    {
        std::ostringstream log;
        log << "Failed to get device count: " << nvmlErrorString(result);
        log_message(LOG_ERR, log.str());
        return;
    }
    // std::cout << "Found " << device_count << " devices." << std::endl;
    std::ostringstream log;
    log << "Found " << device_count << " devices.";
    log_message(LOG_INFO, log.str());
    for (int i = 0; i < device_count; i++)
    {
        result = nvmlDeviceGetHandleByIndex(i, &handle);
        if (result != NVML_SUCCESS)
        {
            std::ostringstream log;
            log << "Failed to get device handle for device " << i << ": " << nvmlErrorString(result);
            log_message(LOG_ERR, log.str());
            // std::cerr << "Failed to get device handle for device " << i << ": " << nvmlErrorString(result) << std::endl;
            return;
        }

        result = nvmlDeviceGetName(handle, name, NVML_DEVICE_NAME_V2_BUFFER_SIZE);
        if (result != NVML_SUCCESS)
        {
            std::ostringstream log;
            log << "Failed to get device name for device " << i << ": " << nvmlErrorString(result);
            log_message(LOG_ERR, log.str());
            // std::cerr << "Failed to get device name for device " << i << ": " << nvmlErrorString(result) << std::endl;
            return;
        }
        std::ostringstream log;
        log << "Device " << i << ": " << name;
        log_message(LOG_INFO, log.str());
        // std::cout << "Device " << i << ": " << name << std::endl;

        // Get the UUID once and store it for printing in each loop iteration
        result = nvmlDeviceGetUUID(handle, uuid, sizeof(uuid));
        if (result == NVML_SUCCESS)
        {
            std::ostringstream log;
            log << "Device UUID: " << uuid;
            log_message(LOG_INFO, log.str());
            // std::cout << "Device UUID: " << uuid << std::endl;
        }
        else
        {
            std::ostringstream log;
            log << "Failed to get device UUID for device " << i << ": " << nvmlErrorString(result);
            log_message(LOG_ERR, log.str());
            // std::cerr << "Failed to get device UUID for device " << i << ": " << nvmlErrorString(result) << std::endl;
        }
    }

    char driver_version[80];
    result = nvmlSystemGetDriverVersion(driver_version, sizeof(driver_version));
    if (result == NVML_SUCCESS)
    {
        std::ostringstream log;
        log << "Driver version: " << driver_version;
        log_message(LOG_INFO, log.str());
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
        unsigned int infoCount = 0;

        // Poll for temperature, clock speed, memory, power
        result = nvmlDeviceGetTemperature(handle, NVML_TEMPERATURE_GPU, &temperature);
        result = nvmlDeviceGetClockInfo(handle, NVML_CLOCK_GRAPHICS, &clock_speed);
        result = nvmlDeviceGetMemoryInfo(handle, &memory_info);
        result = nvmlDeviceGetPowerUsage(handle, &power);
        result = nvmlDeviceGetUUID(handle, uuid, sizeof(uuid));
        if (result == NVML_SUCCESS)
        {
            last_power_reading = power / 1000.0f;
            std::ostringstream log;
            log << "UUID: " << uuid << ", Temp: " << temperature << " C, Clock: " << clock_speed
                << " MHz, Power: " << last_power_reading << " W, Memory Used: "
                << memory_info.used / (1024 * 1024) << " MB";
            log_message(LOG_INFO, log.str());
            // std::cout << "UUID: " << uuid << ", Temp: " << temperature << " C, Clock: " << clock_speed
            //           << " MHz, Power: " << last_power_reading << " W, Memory Used: "
            //           << memory_info.used / (1024 * 1024) << " MB" << std::endl;
        }
        else
        {
            std::cerr << "Error getting GPU metrics: " << nvmlErrorString(result) << std::endl;
            break;
        }

        // Check for running compute processes
        result = nvmlDeviceGetComputeRunningProcesses_v3(handle, &infoCount, nullptr);
        if (result == NVML_ERROR_INSUFFICIENT_SIZE && infoCount > 0)
        {
            // Allocate the required buffer
            std::vector<nvmlProcessInfo_t> infos(infoCount);

            // Call again with the allocated array to retrieve the actual process info
            result = nvmlDeviceGetComputeRunningProcesses_v3(handle, &infoCount, infos.data());

            if (result == NVML_SUCCESS)
            {
                for (const auto &info : infos)
                {
                    std::ostringstream log;
                    log << " Compute Processes Running: PID: " << info.pid
                        << ", Memory Used: " << info.usedGpuMemory / (1024 * 1024) << " MB";
                    log_message(LOG_INFO, log.str());
                    std::cout << " Compute Processes Running: PID: " << info.pid
                              << ", Memory Used: " << info.usedGpuMemory / (1024 * 1024) << " MB" << std::endl;
                }
            }
        }

        // Check for running graphics processes
        result = nvmlDeviceGetGraphicsRunningProcesses_v3(handle, &infoCount, nullptr);
        if (result == NVML_ERROR_INSUFFICIENT_SIZE && infoCount > 0)
        {
            // Allocate the required buffer
            std::vector<nvmlProcessInfo_t> infos(infoCount);

            // Call again with the allocated array to retrieve the actual process info
            result = nvmlDeviceGetGraphicsRunningProcesses_v3(handle, &infoCount, infos.data());

            if (result == NVML_SUCCESS)
            {
                for (const auto &info : infos)
                {
                    std::cout << "  Graphics Processes Running: PID: " << info.pid
                              << ", Memory Used: " << info.usedGpuMemory / (1024 * 1024) << " MB" << std::endl;
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

void daemonize()
{
    // fork the process
    pid_t pid = fork();
    if (pid < 0)
    {
        exit(EXIT_FAILURE);
    }
    if (pid > 0)
    {
        exit(EXIT_SUCCESS); // on success, exit the parent and keep the child
    }

    // give our daemon the ability to create files with all permissions
    umask(0);

    // now we need to move out of our parents process group / session

    pid_t sid = setsid(); // make a new session
    if (sid < 0)
    {
        exit(EXIT_FAILURE);
    }

    if ((chdir("/")) < 0) // change to root directory to avoid any depedencies
    {
        exit(EXIT_FAILURE);
    }

    // close all our IO to fully detach from the terminal
    close(STDIN_FILENO);
    close(STDOUT_FILENO);
    close(STDERR_FILENO);

    // set up a system log since we lose I/O :(
    openlog("quakspie", LOG_PID, LOG_DAEMON);
}

int main()
{
    daemonize();

    syslog(LOG_NOTICE, "Quakspie daemon started.");

    initialize();

    std::thread odometer_thread(gpu_prober);
    odometer_thread.detach();

    execute_workload();

    try
    {
        while (true)
        {
            std::this_thread::sleep_for(std::chrono::seconds(1));
        }
    }
    catch (...)
    {
        syslog(LOG_ERR, "Exiting...");
    }

    nvmlShutdown();
    closelog();
    return 0;
}