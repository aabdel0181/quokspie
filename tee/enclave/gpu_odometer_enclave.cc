#include "gpu_odometer_enclave.h"
#include <iostream>
#include "asylo/util/status_macros.h"

asylo::Status GpuOdometerEnclave::Initialize(const asylo::EnclaveConfig &config) {
  // Initialize NVML
  nvmlReturn_t result = nvmlInit();
  if (result != NVML_SUCCESS) {
    return asylo::Status(asylo::error::GoogleError::INTERNAL, "Failed to initialize NVML");
  }

  // Obtain handle to the GPU device (assuming a single GPU at index 0)
  result = nvmlDeviceGetHandleByIndex(0, &device_handle_);
  if (result != NVML_SUCCESS) {
    return asylo::Status(asylo::error::GoogleError::INTERNAL, "Failed to get device handle");
  }

  initialized_ = true;
  return asylo::Status::OkStatus();
}

asylo::Status GpuOdometerEnclave::Run(const asylo::EnclaveInput &input, asylo::EnclaveOutput *output) {
  if (!initialized_) {
    return asylo::Status(asylo::error::GoogleError::FAILED_PRECONDITION, "NVML not initialized");
  }

  unsigned int temperature;
  nvmlMemory_t memory_info;
  unsigned int power;
  
  nvmlDeviceGetTemperature(device_handle_, NVML_TEMPERATURE_GPU, &temperature);
  nvmlDeviceGetMemoryInfo(device_handle_, &memory_info);
  nvmlDeviceGetPowerUsage(device_handle_, &power);

  output->Set("temperature", temperature);
  output->Set("memory_used", memory_info.used / (1024 * 1024)); // MB
  output->Set("power", power / 1000.0); // Watts

  return asylo::Status::OkStatus();
}

asylo::Status GpuOdometerEnclave::Finalize(const asylo::EnclaveFinal &enclave_final) {
  // Shutdown NVML
  nvmlShutdown();
  return asylo::Status::OkStatus();
}
