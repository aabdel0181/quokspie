#include "Enclave_t.h"

char[32] pk;

// Global buffer to store device handles
uintptr_t device_handles[64];
size_t num_device_handles = 0;

//tell the tee to initialize
void ecallInit() {
    //keygen
    
    //attestation

    //get handles
}
//tell the TEE it's time to grab data
void ecallGetData() {
    //keygen for temp key

    //call ocall

    //validate hmac
}