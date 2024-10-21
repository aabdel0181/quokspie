#include "headers/gpu_metrics.hpp"
#include <iostream>

int main()
{
    try
    {
        NVMLWrapper nvml;

        std::cout << "Initializing NVML..." << std::endl;
        int result = nvml.init();
        if (result == 0)
        {
            std::cout << "NVML initialized successfully!" << std::endl;

            std::cout << "Shutting down NVML..." << std::endl;
            result = nvml.shutdown();
            if (result == 0)
            {
                std::cout << "NVML shut down successfully!" << std::endl;
            }
            else
            {
                std::cerr << "Failed to shut down NVML. Error code: " << result << std::endl;
            }
        }
        else
        {
            std::cerr << "Failed to initialize NVML. Error code: " << result << std::endl;
        }
    }
    catch (const std::exception &e)
    {
        std::cerr << "An error occurred: " << e.what() << std::endl;
    }

    return 0;
}