#!/bin/bash

# Compile cpp 
g++ -o quakspie src/main.cpp -lnvidia-ml -lpthread

# Build the package
dpkg-deb --build . ./quakspie.deb

echo "Debian package created: quakspie.deb"