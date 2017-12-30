---
title: SDR with Ubuntu
author: mimiflynn
date: 2017-11-04 18:36
template: article.jade
---

Useful links and notes from installing SDR tools on Ubuntu. Focused on the HackRF and RTL-SDR USB dongles.


## HackRF

https://github.com/mossmann/hackrf/tree/master/host

## GnuRadio Companion

https://wiki.gnuradio.org/index.php/InstallingGRFromSource#Using-the-build-gnuradio-script

## CubicSDR

http://cubicsdr.com/

https://github.com/cjcliffe/CubicSDR

### Source

https://github.com/cjcliffe/CubicSDR/wiki/Build-Linux

```
sudo apt-get install libpulse-dev libgtk-3-dev
sudo apt-get install freeglut3 freeglut3-dev
sudo apt-get install automake

git clone https://github.com/pothosware/SoapySDR.git
cd SoapySDR
mkdir build
cd build
cmake ../ -DCMAKE_BUILD_TYPE=Release
make -j4
sudo make install
sudo ldconfig
SoapySDRUtil --info #test SoapySDR install

git clone https://github.com/jgaeddert/liquid-dsp
cd liquid-dsp
./bootstrap.sh
CFLAGS="-march=native -O3" ./configure --enable-fftoverride 
make -j4
sudo make install
sudo ldconfig

wget https://github.com/wxWidgets/wxWidgets/releases/download/v3.1.0/wxWidgets-3.1.0.tar.bz2
tar -xvjf wxWidgets-3.1.0.tar.bz2  
cd wxWidgets-3.1.0/
mkdir -p ~/Develop/wxWidgets-staticlib
./autogen.sh
./configure --with-opengl --disable-shared --enable-monolithic --with-libjpeg --with-libtiff --with-libpng --with-zlib --disable-sdltest --enable-unicode --enable-display --enable-propgrid --disable-webkit --disable-webview --disable-webviewwebkit --prefix=`echo ~/Develop/wxWidgets-staticlib` CXXFLAGS="-std=c++0x"
make -j4 && make install


git clone https://github.com/cjcliffe/CubicSDR.git
cd CubicSDR
mkdir build
cd build
cmake ../ -DCMAKE_BUILD_TYPE=Release -DwxWidgets_CONFIG_EXECUTABLE=~/Develop/wxWidgets-staticlib/bin/wx-config
make
cd x64/
./CubicSDR
sudo make install

sudo apt-get install librtlsdr-dev
git clone https://github.com/pothosware/SoapyRTLSDR.git
cd SoapyRTLSDR
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make
sudo make install
sudo ldconfig
# should now show RTL-SDR device if connected
SoapySDRUtil --probe
```

### flatpack

```
sudo add-apt-repository ppa:alexlarsson/flatpak
sudo apt update
sudo apt install flatpak
wget https://sdk.gnome.org/keys/gnome-sdk.gpg
sudo flatpak remote-add --gpg-import=gnome-sdk.gpg gnome https://sdk.gnome.org/repo/
flatpak install --bundle CubicSDR-0.2.0.flatpak
```
to run
```
flatpak run com.cubicsdr.App
```

## GQRX
http://gqrx.dk/download/install-ubuntu

```
sudo add-apt-repository -y ppa:bladerf/bladerf
sudo add-apt-repository -y ppa:ettusresearch/uhd
sudo add-apt-repository -y ppa:myriadrf/drivers
sudo add-apt-repository -y ppa:myriadrf/gnuradio
sudo add-apt-repository -y ppa:gqrx/gqrx-sdr
sudo apt-get update
sudo apt-get install gqrx-sdr
sudo apt-get install libvolk1-bin
volk_profile
```