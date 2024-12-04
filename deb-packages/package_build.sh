#!/bin/bash

# Define paths
CUDA_LIB_PATH="/usr/local/cuda/lib64/stubs"
CUDA_INCLUDE_PATH="/usr/local/cuda/include"

# Compile the C++ program
g++ -o quakspie src/main.cpp -I${CUDA_INCLUDE_PATH} -L${CUDA_LIB_PATH} -lnvidia-ml -lpthread

# Check if compilation was successful
if [ $? -eq 0 ]; then
    echo "Compilation successful."
else
    echo "Compilation failed."
    exit 1
fi

# Build the package
dpkg-deb --build . ../quakspie.deb

echo "Debian package created: ./quakspie.deb"