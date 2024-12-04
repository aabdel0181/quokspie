cmake_minimum_required(VERSION 3.10)
project(GPUOdometer LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add the main executable
add_executable(gpu_odometer main.cpp)

# Platform-specific NVML setup
if(WIN32)
    # Explicitly set the path for nvml.dll
    set(NVML_DLL_PATH "C:/Windows/System32/nvml.dll")
    
    # Explicitly set the path for nvml.h in the CUDA directory
    set(NVML_INCLUDE_PATH "C:/Program Files/NVIDIA GPU Computing Toolkit/CUDA/v12.6/include")

    # Check if nvml.dll exists at the specified path
    if(EXISTS "${NVML_DLL_PATH}")
        message(STATUS "Found nvml.dll at ${NVML_DLL_PATH}")
        set(NVML_LIB "${NVML_DLL_PATH}")
    else()
        message(FATAL_ERROR "NVML library (nvml.dll) not found at ${NVML_DLL_PATH}. Please check the path.")
    endif()

    # Link nvml.dll to the executable
    target_link_libraries(gpu_odometer PRIVATE ${NVML_LIB})

    # Check if nvml.h exists at the specified include path
    if(EXISTS "${NVML_INCLUDE_PATH}/nvml.h")
        message(STATUS "Found nvml.h at ${NVML_INCLUDE_PATH}")
        target_include_directories(gpu_odometer PRIVATE ${NVML_INCLUDE_PATH})
    else()
        message(FATAL_ERROR "NVML header (nvml.h) not found in ${NVML_INCLUDE_PATH}. Please check the path.")
    endif()

else()
    # Locate NVML on Linux
    find_library(NVML_LIB libnvidia-ml.so HINTS /usr/local/cuda-12.6/lib64/stubs)
    if(NVML_LIB)
        target_link_libraries(gpu_odometer PRIVATE ${NVML_LIB})
    else()
        message(FATAL_ERROR "NVML library not found on Linux. Ensure NVML is installed or adjust the path.")
    endif()
endif()

# Include other directories like Stopwatch.h
target_include_directories(gpu_odometer PRIVATE ${CMAKE_SOURCE_DIR})
