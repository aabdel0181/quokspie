#!/bin/bash

# Compile cpp 
g++ -o quakspie main.cpp -lnvidia-ml -lpthread

# Move the executable to /usr/local/bin
sudo mv quakspie /usr/local/bin/

# Move the service file to systemd directory
sudo mv quakspie.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable and start our service :D 
sudo systemctl enable quakspie.service
sudo systemctl start quakspie.service

echo "Quakspie has successfully been installed and started!"   