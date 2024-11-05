#ifndef GPU_ODOMETER_ENCLAVE_H_
#define GPU_ODOMETER_ENCLAVE_H_

#include <nvml.h>
#include "asylo/enclave.pb.h"
#include "asylo/trusted_application.h"
#include "asylo/util/status.h"
#include <string>
#include "asylo/util/hkdf_sha256.h"
#include "asylo/util/secure_random.h"
#include "asylo/util/status.h"
#include <openssl/sha.h>
#include <openssl/hmac.h>
#include <openssl/crypto.h>
#include <openssl/evp.h>
#include gpu_odometer.h

class GpuOdometerEnclave : public asylo::TrustedApplication {
 public:
  GpuOdometerEnclave() = default;

  // Initializes NVML and prepares the GPU handle
  asylo::Status Initialize(const asylo::EnclaveConfig &config) override;

  // Collects GPU metrics and outputs them to the host
  asylo::Status Run(const asylo::EnclaveInput &input, asylo::EnclaveOutput *output) override;

  // Shuts down NVML
  asylo::Status Finalize(const asylo::EnclaveFinal &enclave_final) override;

 private:
  nvmlDevice_t device_handle_;  // Handle for GPU device
  bool initialized_ = false;    // Indicates if NVML is initialized
};

#endif  // GPU_ODOMETER_ENCLAVE_H_
