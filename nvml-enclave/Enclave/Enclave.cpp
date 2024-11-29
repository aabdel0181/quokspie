#include "Enclave_t.h"

char[32] pk;

//global RSA Key Pair
sgx_ec256_private_t private_key;
sgx_ec256_public_t public_key;

// Global buffer to store device handles
uintptr_t device_handles[64];
size_t num_device_handles = 0;

// private keygen + attestation!

void generateAttestedKeyPair() {
    sgx_status_t status;
    sgx_ecc_state_handle_t ecc_handle;

    // create ecc context
    status = sgx_ecc256_open_context(&ecc_handle);
    if (status != SGX_SUCCESS) {
        enclavePrint("Failed to open ECC context.");
        return;
    }

    // generate keypair
    status = sgx_ecc256_create_key_pair(&private_key, &public_key, ecc_handle);
    if (status != SGX_SUCCESS) {
        sgx_ecc256_close_context(ecc_handle);
        enclavePrint("Failed to generate key pair.");
        return;
    }
    enclavePrint("Key pair successfully generated.");
    sgx_ecc256_close_context(ecc_handle);

    //attestation

    //TODO! Will need to configure DCAP for remote attestation validation
    //via server

    /*

    sgx_report_data_t report_data = {0};
    memcpy(report_data.d, &public_key, sizeof(public_key));
    status = sgx_create_report()

    */
}





//ECALLS

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