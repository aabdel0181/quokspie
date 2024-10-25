cmake_minimum_required(VERSION 3.10)
project(NVMLMetrics LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include directories
include_directories(${CMAKE_SOURCE_DIR})

# Add library
add_library(headers INTERFACE
    headers/gpu_metrics.hpp
)

# Set the include directories for the target
target_include_directories(headers INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})

# On non-Windows, we need to link against dl. TODO: FIgure this out for linux
if(NOT WIN32)
    target_link_libraries(headers INTERFACE dl)
endif()

# Add the test executable
add_executable(initial_tests ${CMAKE_SOURCE_DIR}/tests/temperature_test.cpp)
target_link_libraries(initial_tests headers)

# Set the working directory for the test executable
set_target_properties(initial_tests PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/tests
)

# Optionally, add this to automatically run the tests after building
add_custom_command(TARGET initial_tests POST_BUILD
    COMMAND initial_tests
    WORKING_DIRECTORY ${CMAKE_BINARY_DIR}/tests
)