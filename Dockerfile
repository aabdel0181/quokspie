FROM ubuntu:24.04
WORKDIR /home/ubuntu/quokkspeed

RUN apt-get update
RUN apt-get -y install sudo
RUN sudo apt -y install wget
RUN wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-ubuntu2404.pin
RUN sudo mv cuda-ubuntu2404.pin /etc/apt/preferences.d/cuda-repository-pin-600
RUN wget https://developer.download.nvidia.com/compute/cuda/12.6.3/local_installers/cuda-repo-ubuntu2404-12-6-local_12.6.3-560.35.05-1_amd64.deb
RUN sudo dpkg -i cuda-repo-ubuntu2404-12-6-local_12.6.3-560.35.05-1_amd64.deb
RUN sudo cp /var/cuda-repo-ubuntu2404-12-6-local/cuda-*-keyring.gpg /usr/share/keyrings/
RUN sudo apt-get update
RUN sudo apt-get -y install cuda-toolkit-12-6
RUN sudo apt-get install -y nvidia-open
RUN sudo apt-get install -y git
RUN sudo apt-get install -y cmake
RUN sudo apt -y install ninja-build 

RUN git clone https://github.com/aabdel0181/senior_design.git

WORKDIR /home/ubuntu/quokkspeed/senior_design

CMD ["bash"]
