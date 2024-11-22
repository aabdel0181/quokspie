#!/bin/bash

# Reload systemd
sudo systemctl daemon-reload

# Enable and start the service
sudo systemctl enable quakspie.service
sudo systemctl start quakspie.service

echo "Quakspie GPU Monitor has been installed and started."
