#!/bin/bash

servicename=quokspie.service
binary=quokspie
sudo systemctl stop $servicename
sudo systemctl disable $servicename
sudo rm /etc/systemd/system/$servicename
sudo rm /usr/local/bin/$binary
sudo systemctl daemon-reload
sudo systemctl reset-failed