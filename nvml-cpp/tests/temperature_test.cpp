#include "headers/gpu_metrics.hpp"
#include <iostream>
#include <chrono>
#include <thread>

int main()
{
    try
    {
        // Init NVMLWrapper and GPUMetrics
        NVMLWrapper nvml;
        nvml.init();

        nvml_metrics::GPUMetrics gpuMetrics;
        unsigned int deviceIndex = 0; // Assuming the first GPU device for testing

        std::cout << "Polling GPU temperature..." << std::endl;

        // Poll the GPU temperature 5 times with a 1-second interval
        for (int i = 0; i < 5; ++i)
        {
            try
            {
                unsigned int temperature = gpuMetrics.getGPUTemperature(deviceIndex);
                std::cout << "GPU Temperature: " << temperature << " C" << std::endl;
            }
            catch (const nvml_metrics::NVMLException &e)
            {
                std::cerr << "An error occurred while fetching temperature: " << e.what() << std::endl;
            }

            // Wait 1 second before polling again
            std::this_thread::sleep_for(std::chrono::seconds(1));
        }

        // Shutdown NVML after polling
        nvml.shutdown();
        std::cout << "NVML shutdown completed successfully!" << std::endl;
    }
    catch (const std::exception &e)
    {
        std::cerr << "An error occurred during setup or shutdown: " << e.what() << std::endl;
    }

    return 0;
}
