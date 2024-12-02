#include "Enclave_t.h"
#include <sgx_tcrypto.h>

char[32] pk;

//global RSA Key Pair
sgx_ec256_private_t private_key;
sgx_ec256_public_t public_key;

// global buffer to store device handles
uintptr_t handles[64];
size_t numHandles = 0;

//store tempkey
unsigned char tempKey[32];

//

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

// temp keygen
void tempKeyGen(unsigned char *key) {
    // generate random bytes
    sgx_status_t status = sgx_read_rand(key, 32);
    if (status != SGX_SUCCESS) {
        memset(key, 0, 32); // Clear key if generation fails
        enclavePrint("Failed to generate secure random key.");
        return;
    }

    enclavePrint("Secure HMAC key generated successfully.");
}


//hmac validation

sgx_status_t validate_hmac(const unsigned char *key, size_t key_len,
                           const unsigned char *data, size_t data_len,
                           const unsigned char *received_hmac) {
    unsigned char calculated_hmac[32];

    sgx_status_t status = generate_hmac(key, key_len, data, data_len, calculated_hmac);
    if (status != SGX_SUCCESS) {
        return status;
    }

    if (memcmp(calculated_hmac, received_hmac, 32) != 0) {
        return SGX_ERROR_MAC_MISMATCH;
    }

    return SGX_SUCCESS;
}



//ECALLS

//tell the tee to initialize
void ecallInit() {
    //keygen
    generateAttestedKeyPair();
    //attestation TBD

    //temp keygen
    tempKeyGen(tempKey);
    //get handles
    getDeviceHandles(tempKey, handles, &numHandles);

}
//tell the TEE it's time to grab data
void ecallGetData() {
    //keygen for temp key
    tempKeyGen(tempKey);

    //pollpack struct later maybe? for now j vars
    unsigned int temp;
    unsigned int quokk;
    unsigned int mem;
    unsigned int power;
    unsigned int hmac;

    //poll gpu for each handle we have
    for(size_t i = 0; i < numHandles; i ++) {
        pollGPU(tempKey, handles[i], &temp, &quokk, &mem, &power, &hmac);
        
        //validate hmac

        // data buffer
        unsigned char data[128];
        size_t offset = 0;

        //serialize data in buffer
        memcpy(data + offset, &temp, sizeof(temp)); 
        offset += sizeof(temp);
        memcpy(data + offset, &quokk, sizeof(quokk));
        offset += sizeof(quokk);
        memcpy(data + offset, &mem, sizeof(mem));    
        offset += sizeof(mem);
        memcpy(data + offset, &power, sizeof(power));
        offset += sizeof(power);

        // validateh hmac
        sgx_status_t status = validate_hmac(tempKey, 32, data, offset, hmac);
        if (status != SGX_SUCCESS) {
            enclavePrint("HMAC validation failed! Data tampered with");
        }

        // FUTURE PROCESSING
        char success_msg[128];
        snprintf(success_msg, sizeof(success_msg),
                "Device %zu validated: Temp=%u, Clock=%u, Mem=%uMB, Power=%uW",
                i, temp, quokk, mem, power);
        enclavePrint(success_msg);
    }

}