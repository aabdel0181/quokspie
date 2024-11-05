#include "gpu_odometer_enclave.h"
#include <iostream>
#include "asylo/util/status_macros.h"




asylo::Status GpuOdometerEnclave::Initialize(const asylo::EnclaveConfig &config) {
  //init nonce
  nonce = 0;
  //pass nonce into pkey
  seed = GenerateSeed(); 
  initialized_ = true;
  return asylo::Status::OkStatus();
}

asylo::Status GpuOdometerEnclave::Run(const asylo::EnclaveInput &input, asylo::EnclaveOutput *output) {
  //check init
  if (!initialized_) {
    return asylo::Status(error::GoogleError::FAILED_PRECONDITION, "Enclave not initialized");
  }
  const std::string &command = input.GetExtension(asylo::my_proto::command);
  if (command ==  "GenerateKey") {
    return GenerateKey(nonce);
  } else if (command == "ValidateHmac") {
    pollPack pack = input.GetExtension(asylo::my_proto::pack);
    std::string_view received_hmac = input.GetExtension(asylo::my_proto::hmac);
    return ValidateHmac(pack, received_hmac);
  } else {
    return asylo::Status(error::GoogleError::INVALID_ARGUMENT, "Invalid command");
  }
}

asylo::Status GpuOdometerEnclave::Finalize(const asylo::EnclaveFinal &enclave_final) {
  initialized_ = false;
  return asylo::Status::OkStatus();
}

std::string DerivePollKey(std::string &seed, uint64_t nonce) {
    std::string nonceStr = std::to_string(nonce);
    return asylo::util::HkdfSha256::ExtractAndExpand(seed, nonceStr);
}

Status GenerateKey(uint64_t &nonce) {
    //maybe we make nonce random or something
    nonce ++;
    std::string pollKey = DerivePollKey(GenerateSeed(), nonce);
    asylo::EnclaveOutput output;
    output.Set("pollkey", pollKey);
    return output;
}
Status ValidateHmac(pollPack pack const std::string_view received_hmac) {
  unsigned char comparison[EVP_MAX_MD_SIZE];
  HMAC(EVP_sha256(), key, sizeof(key), (const unsigned char*)&pack, sizeof(pack), comparison, NULL);
  //true if validated, same hmac as we created, false if not
  asylo::EnclaveOutput output;
  output.Set("valid", CRYPTO_memcmp(comparison, received_hmac, EVP_MAX_MD_SIZE));
  return output;
}
std::string GenerateSeed() {
    std::string seed(32, '/0');
    asylo::SecureRandom().RandomData(&seed[0], seed.size());
    return seed;
}

