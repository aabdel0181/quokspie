#include <iostream>
#include <sstream>
#include <vector>
#include <string>
#include <nvml.h>
#include <limits>
#include <iomanip>
#include <thread>
#include <chrono>

#include <curl/curl.h>
#include <cstring>

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

// helper function to handle http requests
size_t WriteCallback(void *contents, size_t size, size_t nmemb, std::string *output)
{
    size_t totalSize = size * nmemb;
    output->append((char *)contents, totalSize);
    return totalSize;
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
#include <tuple>

std::vector<std::tuple<int, std::string>> detectAndSelectGPUs()
{
    nvmlReturn_t result;
    unsigned int device_count;
    char name[NVML_DEVICE_NAME_V2_BUFFER_SIZE];
    char uuid[NVML_DEVICE_UUID_BUFFER_SIZE];
    nvmlDevice_t handle;
    std::vector<std::tuple<int, std::string>> selected_devices;

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

        result = nvmlDeviceGetUUID(handle, uuid, NVML_DEVICE_UUID_BUFFER_SIZE);
        if (result != NVML_SUCCESS)
        {
            log_message(LogLevel::WARNING, "Failed to get device UUID for device " + std::to_string(i) + ": " + std::string(nvmlErrorString(result)));
            continue;
        }

        std::cout << "[" << i << "] " << name << " (UUID: " << uuid << ")\n";
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
                result = nvmlDeviceGetHandleByIndex(i, &handle);
                if (result == NVML_SUCCESS)
                {
                    result = nvmlDeviceGetUUID(handle, uuid, NVML_DEVICE_NAME_V2_BUFFER_SIZE);
                    if (result == NVML_SUCCESS)
                    {
                        selected_devices.push_back(std::make_tuple(i, std::string(uuid)));
                    }
                }
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
                result = nvmlDeviceGetHandleByIndex(index, &handle);
                if (result == NVML_SUCCESS)
                {
                    result = nvmlDeviceGetUUID(handle, uuid, NVML_DEVICE_NAME_V2_BUFFER_SIZE);
                    if (result == NVML_SUCCESS)
                    {
                        selected_devices.push_back(std::make_tuple(index, std::string(uuid)));
                    }
                }
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

std::string getGpuName(int deviceIndex)
{
    nvmlReturn_t result;
    nvmlDevice_t handle;
    char name[NVML_DEVICE_NAME_V2_BUFFER_SIZE];

    // init NVML
    result = nvmlInit();
    if (result != NVML_SUCCESS)
    {
        log_message(LogLevel::ERROR, "Failed to initialize NVML: " + std::string(nvmlErrorString(result)));
        return "Unknown GPU";
    }

    // get device handle by index
    result = nvmlDeviceGetHandleByIndex(deviceIndex, &handle);
    if (result != NVML_SUCCESS)
    {
        log_message(LogLevel::ERROR, "Failed to get handle for GPU index " + std::to_string(deviceIndex) + ": " + std::string(nvmlErrorString(result)));
        nvmlShutdown();
        return "Unknown GPU";
    }

    // get GPU name
    result = nvmlDeviceGetName(handle, name, NVML_DEVICE_NAME_V2_BUFFER_SIZE);
    if (result != NVML_SUCCESS)
    {
        log_message(LogLevel::ERROR, "Failed to get name for GPU index " + std::to_string(deviceIndex) + ": " + std::string(nvmlErrorString(result)));
        nvmlShutdown();
        return "Unknown GPU";
    }

    // return name
    nvmlShutdown();
    return std::string(name);
}

// TODO: Make this real XD
bool signUp(std::vector<std::tuple<int, std::string>> selected_gpus)
{
    std::string username, password, confirm_password, firstName, lastName;

    while (true)
    {
        std::cout << "Enter first name: ";
        std::getline(std::cin, firstName);
        if (firstName.empty())
        {
            std::cout << "First name cannot be empty. Please try again.\n";
            continue;
        }

        std::cout << "Enter last name: ";
        std::getline(std::cin, lastName);
        if (lastName.empty())
        {
            std::cout << "Last name cannot be empty. Please try again.\n";
            continue;
        }

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

    // serialize GPUs to JSON-like format
    // Serialize the entire request body as JSON
    std::ostringstream json;
    json << "{";
    json << "\"username\":\"" << username << "\",";
    json << "\"password\":\"" << password << "\",";
    json << "\"firstName\":\"" << firstName << "\",";
    json << "\"lastName\":\"" << lastName << "\",";
    json << "\"gpus\":[";

    for (size_t i = 0; i < selected_gpus.size(); ++i)
    {
        int index = std::get<0>(selected_gpus[i]);
        std::string uuid = std::get<1>(selected_gpus[i]);
        std::string gpuName = getGpuName(index); // Function to get GPU name dynamically

        json << "{\"gpu_id\":\"" << uuid << "\",\"model\":\"" << gpuName << "\"}";
        if (i < selected_gpus.size() - 1)
        {
            json << ",";
        }
    }

    json << "]";
    json << "}";

    std::string requestBody = json.str();
    std::cout << "Request Body: " << requestBody << std::endl; // Debug log

    CURL *curl;
    CURLcode res;
    curl = curl_easy_init();

    if (!curl)
    {
        std::cerr << "Failed to initialize curl correctly" << std::endl;
        return false;
    }

    // Set CURL options
    curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:9000/register");
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, requestBody.c_str());

    // Add headers
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

    // Response handling
    std::string response;
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

    // Perform the request
    res = curl_easy_perform(curl);

    // Cleanup
    curl_easy_cleanup(curl);
    curl_slist_free_all(headers);

    if (res != CURLE_OK)
    {
        std::cerr << "Curl error: " << curl_easy_strerror(res) << "\n";
        return false;
    }

    std::cout << "Response from server: " << response << "\n";
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

    // Serialize login data as JSON
    std::string loginData = "{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}";

    // Initialize CURL
    CURL* curl = curl_easy_init();
    if (!curl)
    {
        std::cerr << "Failed to initialize curl correctly" << std::endl;
        return false;
    }

    // Set CURL options
    std::string response;
    curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:9000/login");
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, loginData.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

    // Add headers
    struct curl_slist* headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

    // Perform the request
    CURLcode res = curl_easy_perform(curl);

    // Cleanup
    curl_easy_cleanup(curl);
    curl_slist_free_all(headers);

    if (res != CURLE_OK)
    {
        std::cerr << "Curl error: " << curl_easy_strerror(res) << "\n";
        return false;
    }

    // Process the server's response
    std::cout << "Response from server: " << response << "\n";

    // Simulate login animation 
    std::cout << "Completing retina scan";
    for (int i = 0; i < 3; i++)
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        std::cout << ".";
        std::cout.flush();
    }
    std::cout << "\n";

    // Check if the response contains a success message
    if (response.find("\"message\":\"Login successful.\"") != std::string::npos)
    {
        std::cout << "Login successful!\n";
        return true;
    }
    else
    {
        std::cerr << "Login failed. Check your username and password.\n";
        return false;
    }
}

// makes it look like stuff is happening (actual install takes 2 seconds LOL)
void runInstallation(const std::vector<std::tuple<int, std::string>> &selected_gpus)
{
    std::cout << "\nSaving Quokkas..\n";
    for (int i = 0; i <= 100; i += 10)
    {
        displayProgressBar(i);
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }
    std::cout << "\nQuokspie installed successfully!\n";
}

// prompts the welcome, selects GPUS, and initilaizes sign up / login
int main()
{
    clearScreen();
    std::cout << "Welcome to the Quokspie installer!\n";
    std::cout << "==========================================\n\n";

    std::vector<std::tuple<int, std::string>> selected_gpus = detectAndSelectGPUs();

    if (!selected_gpus.empty())
    {
        std::cout << "\nSelected GPUs:\n";
        for (const auto &gpu : selected_gpus)
        {
            int index;
            std::string uuid;
            std::tie(index, uuid) = gpu;

            std::cout << "Index: " << index << ", UUID: " << uuid << "\n";
        }
        std::cout << "\n";
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
            success = signUp(selected_gpus);
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