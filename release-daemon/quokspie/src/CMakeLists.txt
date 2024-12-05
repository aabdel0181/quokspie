cmake_minimum_required(VERSION 3.10)
project(installer LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add the main executable
add_executable(installer installer.cpp)

# Platform-specific NVML setup
if(WIN32)
    # Windows-specific NVML setup
    set(NVML_DLL_PATH "C:/Windows/System32/nvml.dll")
    set(NVML_INCLUDE_PATH "C:/Program Files/NVIDIA GPU Computing Toolkit/CUDA/v12.6/include")

    if(EXISTS "${NVML_DLL_PATH}")
        message(STATUS "Found nvml.dll at ${NVML_DLL_PATH}")
        set(NVML_LIB "${NVML_DLL_PATH}")
    else()
        message(FATAL_ERROR "NVML library (nvml.dll) not found at ${NVML_DLL_PATH}. Please check the path.")
    endif()

    target_link_libraries(installer PRIVATE ${NVML_LIB})

    if(EXISTS "${NVML_INCLUDE_PATH}/nvml.h")
        message(STATUS "Found nvml.h at ${NVML_INCLUDE_PATH}")
        target_include_directories(installer PRIVATE ${NVML_INCLUDE_PATH})
    else()
        message(FATAL_ERROR "NVML header (nvml.h) not found in ${NVML_INCLUDE_PATH}. Please check the path.")
    endif()

else()
    # Linux-specific NVML setup
    find_library(NVML_LIB nvidia-ml HINTS /usr/lib /usr/local/lib /usr/lib64 /usr/local/cuda/lib64 /usr/local/cuda-12.6/lib64/stubs)
    
    if(NVML_LIB)
        message(STATUS "Found NVML library: ${NVML_LIB}")
        target_link_libraries(installer PRIVATE ${NVML_LIB})
    else()
        message(FATAL_ERROR "NVML library not found on Linux. Ensure NVML is installed or adjust the path.")
    endif()

    # Add the default include path for CUDA/NVML headers
    target_include_directories(installer PRIVATE /usr/local/cuda/include /usr/include)
endif()

# Include other directories like Stopwatch.h
target_include_directories(installer PRIVATE ${CMAKE_SOURCE_DIR})

# Additional libraries (e.g., pthread for multithreading support)
target_link_libraries(installer PRIVATE pthread)

# Find and link libcurl
find_package(CURL REQUIRED)
target_link_libraries(installer PRIVATE CURL::libcurl)
