#!/usr/bin/env bash

apt-get update
apt-get install -y git codeblocks
git clone https://github.com/jayrambhia/Install-OpenCV.git
cd Install-OpenCV/
cd Ubuntu/
./opencv_latest.sh
