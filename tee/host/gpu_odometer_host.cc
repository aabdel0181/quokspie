#include "asylo/util/status.h"
#include "asylo/client.h"
#include <iostream>

int main() {
  asylo::EnclaveClient *client = asylo::LoadEnclaveOrDie("gpu_odometer_enclave");

  // Call the enclave to probe GPU metrics
  asylo::EnclaveInput input;
  asylo::EnclaveOutput output;
  client->EnterAndRun(input, &output);

  std::cout << "GPU Temperature: " << output.GetInt("temperature") << " C\n";
  std::cout << "Memory Used: " << output.GetInt("memory_used") << " MB\n";
  std::cout << "Power Usage: " << output.GetDouble("power") << " W\n";

  client->Destroy();
  return 0;
}
