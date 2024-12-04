#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# List of dependencies
dependencies=(
    "nvidia-smi"
    "g++"
    "make"
    "dpkg"
    "apt-get"
)

# Check for missing dependencies
missing_dependencies=()
for dep in "${dependencies[@]}"; do
    if ! command_exists "$dep"; then
        missing_dependencies+=("$dep")
    fi
done

# Install missing dependencies
if [ ${#missing_dependencies[@]} -ne 0 ]; then
    echo "Missing dependencies: ${missing_dependencies[*]}"
    echo "Attempting to install missing dependencies..."
    
    # Update package list
    sudo apt-get update
    
    # Install each missing dependency
    for dep in "${missing_dependencies[@]}"; do
        if [ "$dep" == "nvidia-smi" ]; then
            echo "NVIDIA drivers must be installed manually."
        else
            sudo apt-get install -y "$dep"
        fi
    done
    
    echo "Installation of dependencies complete."
else
    echo "All dependencies are already installed."
fi

# Reload systemd
sudo systemctl daemon-reload

# Enable and start the service
sudo systemctl enable quakspie.service
sudo systemctl start quakspie.service

echo "Quakspie GPU Monitor has been installed and started."
