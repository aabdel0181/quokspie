cmake_minimum_required(VERSION 3.10)
project(GPUOdometer LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Paths
set(APP_DIR "${CMAKE_SOURCE_DIR}/App")
set(ENCLAVE_DIR "${CMAKE_SOURCE_DIR}/Enclave")

# Add the main executable
add_executable(gpu_odometer ${APP_DIR}/main.cpp ${APP_DIR}/ocalls.cpp)

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

#include sgx

# SGX paths
set(SGX_SDK "/opt/intel/sgxsdk")
set(SGX_LIB "${SGX_SDK}/lib64")
set(SGX_INCLUDE "${SGX_SDK}/include")

# Enclave settings
set(ENCLAVE_NAME "Enclave")
set(ENCLAVE_EDL "${ENCLAVE_DIR}/Enclave.edl")

# Generate the SGX edger8r files
add_custom_command(
    OUTPUT ${ENCLAVE_DIR}/Enclave_t.c ${ENCLAVE_DIR}/Enclave_t.h
    COMMAND ${SGX_SDK}/bin/x64/sgx_edger8r --trusted ${ENCLAVE_EDL} --search-path ${SGX_INCLUDE}
    COMMAND ${SGX_SDK}/bin/x64/sgx_edger8r --untrusted ${ENCLAVE_EDL} --search-path ${SGX_INCLUDE}
    DEPENDS ${ENCLAVE_EDL}
)

# Enclave library
add_library(${ENCLAVE_NAME}_lib STATIC ${ENCLAVE_DIR}/Enclave_t.c ${ENCLAVE_DIR}/Enclave.cpp)
target_include_directories(${ENCLAVE_NAME}_lib PRIVATE ${SGX_INCLUDE} ${ENCLAVE_DIR})

# Build the enclave shared object
add_library(${ENCLAVE_NAME}_so SHARED ${ENCLAVE_DIR}/Enclave.cpp)
target_include_directories(${ENCLAVE_NAME}_so PRIVATE ${SGX_INCLUDE} ${ENCLAVE_DIR})

# Sign the enclave
add_custom_command(
    OUTPUT ${ENCLAVE_DIR}/${ENCLAVE_NAME}.signed.so
    COMMAND ${SGX_SDK}/bin/x64/sgx_sign sign -key ${ENCLAVE_DIR}/Enclave_private.pem -enclave ${ENCLAVE_DIR}/${ENCLAVE_NAME}.so -out ${ENCLAVE_DIR}/${ENCLAVE_NAME}.signed.so
    DEPENDS ${ENCLAVE_DIR}/${ENCLAVE_NAME}.so
)

# Link the main executable with SGX untrusted library and NVML
target_link_libraries(gpu_odometer PRIVATE ${SGX_LIB}/libsgx_urts.so ${ENCLAVE_NAME}_lib)
target_include_directories(gpu_odometer PRIVATE ${SGX_INCLUDE} ${APP_DIR})

# Include other directories like Stopwatch.h
target_include_directories(gpu_odometer PRIVATE ${CMAKE_SOURCE_DIR})
