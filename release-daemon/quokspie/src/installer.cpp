#include <iostream>
#include <sstream>
#include <vector>
#include <string>
#include <nvml.h>
#include <limits>
#include <iomanip>
#include <thread>
#include <chrono>

// set up logging
enum class LogLevel
{
    INFO = 1,
    WARNING = 2,
    ERROR = 3
};

// provide info vs warning vs error handle
void log_message(LogLevel level, const std::string &message)
{
    const char *level_str[] = {"INFO", "WARNING", "ERROR"};
    std::cout << "[" << level_str[static_cast<int>(level) - 1] << "] " << message << std::endl;
}

// clears screen before instllation starts
void clearScreen()
{
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

// makes a silly progress bar
void displayProgressBar(int progress)
{
    int barWidth = 50;
    std::cout << "[";
    int pos = barWidth * progress / 100;
    for (int i = 0; i < barWidth; ++i)
    {
        if (i < pos)
            std::cout << "=";
        else if (i == pos)
            std::cout << ">";
        else
            std::cout << " ";
    }
    std::cout << "] " << progress << "%\r";
    std::cout.flush();
}

// returns: vector of GPU indices
std::vector<int> detectAndSelectGPUs()
{
    nvmlReturn_t result;
    unsigned int device_count;
    char name[NVML_DEVICE_NAME_V2_BUFFER_SIZE];
    nvmlDevice_t handle;
    std::vector<int> selected_devices;

    result = nvmlInit();
    if (result != NVML_SUCCESS)
    {
        log_message(LogLevel::ERROR, "Failed to initialize NVML: " + std::string(nvmlErrorString(result)));
        return selected_devices;
    }
    log_message(LogLevel::INFO, "NVML initialized successfully.");

    result = nvmlDeviceGetCount(&device_count);
    if (result != NVML_SUCCESS)
    {
        log_message(LogLevel::ERROR, "Failed to get device count: " + std::string(nvmlErrorString(result)));
        nvmlShutdown();
        return selected_devices;
    }
    log_message(LogLevel::INFO, "\nFound " + std::to_string(device_count) + " devices.");

    std::cout << "\nAvailable GPUs:\n";
    for (unsigned int i = 0; i < device_count; i++)
    {
        result = nvmlDeviceGetHandleByIndex(i, &handle);
        if (result != NVML_SUCCESS)
        {
            log_message(LogLevel::WARNING, "Failed to get device handle for device " + std::to_string(i) + ": " + std::string(nvmlErrorString(result)));
            continue;
        }

        result = nvmlDeviceGetName(handle, name, NVML_DEVICE_NAME_V2_BUFFER_SIZE);
        if (result != NVML_SUCCESS)
        {
            log_message(LogLevel::WARNING, "Failed to get device name for device " + std::to_string(i) + ": " + std::string(nvmlErrorString(result)));
            continue;
        }

        std::cout << "[" << i << "] " << name << "\n";
    }

    // prompts the user to select which GPUs they wish to track
    while (true)
    {
        std::cout << "\nEnter the indices of GPUs you want to track (space-separated), or 'all' for all GPUs: ";
        std::string input;
        std::getline(std::cin, input);

        if (input == "all")
        {
            for (unsigned int i = 0; i < device_count; i++)
            {
                selected_devices.push_back(i);
            }
            break;
        }

        std::istringstream iss(input);
        int index;
        bool valid_input = true;
        while (iss >> index)
        {
            if (index >= 0 && index < static_cast<int>(device_count))
            {
                selected_devices.push_back(index);
            }
            else
            {
                std::cerr << "Invalid GPU index: " << index << "\n";
                valid_input = false;
                break;
            }
        }

        if (valid_input && !selected_devices.empty())
        {
            break;
        }
        else
        {
            selected_devices.clear();
            std::cerr << "Invalid input. Please try again.\n";
        }
    }

    nvmlShutdown();
    return selected_devices;
}

// TODO: Make this real XD
bool signUp()
{
    std::string username, password, confirm_password;

    while (true)
    {
        std::cout << "Enter new username: ";
        std::getline(std::cin, username);
        if (username.empty())
        {
            std::cout << "Username cannot be empty. Please try again.\n";
            continue;
        }
        break;
    }

    while (true)
    {
        std::cout << "Enter new password: ";
        std::getline(std::cin, password);
        if (password.length() < 8)
        {
            std::cout << "Password must be at least 8 characters long. Please try again.\n";
            continue;
        }

        std::cout << "Confirm password: ";
        std::getline(std::cin, confirm_password);
        if (password != confirm_password)
        {
            std::cout << "Passwords do not match. Please try again.\n";
            continue;
        }
        break;
    }

    // here we would actually create the account
    std::cout << "Creating account";
    for (int i = 0; i < 3; i++)
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        std::cout << ".";
        std::cout.flush();
    }
    std::cout << "\nAccount created successfully!\n";
    return true;
}

// TODO: make this real XD
bool login()
{
    std::string username, password;
    std::cout << "Enter username: ";
    std::getline(std::cin, username);
    std::cout << "Enter password: ";
    std::getline(std::cin, password);

    // TODO: actually verify credentials hehe
    std::cout << "Completing retina scan";
    for (int i = 0; i < 3; i++)
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        std::cout << ".";
        std::cout.flush();
    }
    std::cout << "\nLogin successful!\n";
    return true;
}

// makes it look like stuff is happening (actual install takes 2 seconds LOL)
void runInstallation(const std::vector<int> &selected_gpus)
{
    std::cout << "\nSaving Quokkas..\n";
    for (int i = 0; i <= 100; i += 10)
    {
        displayProgressBar(i);
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }
    std::cout << "\nQuakspie installed successfully!\n";
}

// prompts the welcome, selects GPUS, and initilaizes sign up / login
int main()
{
    clearScreen();
    std::cout << "Welcome to the Quakspie installer!\n";
    std::cout << "==========================================\n\n";

    std::vector<int> selected_gpus = detectAndSelectGPUs();

    if (!selected_gpus.empty())
    {
        std::cout << "\nSelected GPUs: ";
        for (int gpu : selected_gpus)
        {
            std::cout << gpu << " ";
        }
        std::cout << "\n\n";
    }
    else
    {
        std::cout << "No GPUs selected. Exiting.\n";
        return 1;
    }

    while (true)
    {
        std::cout << "1. Sign up\n2. Log in\n3. Exit\nEnter your choice (1-3): ";
        int choice;
        std::cin >> choice;
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

        bool success = false;
        switch (choice)
        {
        case 1:
            success = signUp();
            break;
        case 2:
            success = login();
            break;
        case 3:
            std::cout << "Exiting. Thank you for using the installer.\n";
            return 0;
        default:
            std::cout << "Invalid choice. Please try again.\n";
            continue;
        }

        if (success)
        {
            // yay
            runInstallation(selected_gpus);
            break;
        }
    }

    return 0;
}