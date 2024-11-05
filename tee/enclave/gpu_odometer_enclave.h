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

class GpuOdometerEnclave : public asylo::Enclave {
  public:
    asylo::Status Initialize(const asylo::EnclaveConfig &config) override;
    asylo::Status Run(const asylo::EnclaveInput &input, asylo::EnclaveOutput *output) override;
    asylo::Status Finalize(const asylo::EnclaveFinal &enclave_final) override;
  private:
    private std::string seed;
    private uint64_t nonce = 0;
    bool initialized_ = false;
    std::string GenerateSeed();
    asylo::Status GenerateKey(uint64_t &nonce);
    std::string DerivePollKey(std::string &seed, uint64_t nonce);
    Status ValidateHmac(pollPack pack const std::string_view received_hmac);
}

#endif  // GPU_ODOMETER_ENCLAVE_H_
