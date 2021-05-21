# Smartscreen
RPiZero compatible smartscreen system.

## Features

- Webapp connection
- Status LED and reset button
- ✨Caching✨
- Device ID system
- WiFi Setup/AP mode
- Up to 1.5 MB image views

![alt text](https://github.com/MAkcanca/pi_kiosk_smartscreen/blob/vanilla-dev/images/devid.png?raw=true "Hello screen")

## Usage

In first setup, user must connect to the Smartscreen_Setup AP, then visit the http://10.0.0.1 or http://smartscreen.local for internet configuration. After that system automatically connects to webapp specified in index.js as `SERVER_URL` constant variable.

## Wiring & Schematics

This image is designed for RPi-zero but it can run on various RPi versions. We used Common Anode RGB Led, 220 ohm resistors and push button in here. More details on schematics and PDF can be found in repository.
![alt text](https://github.com/MAkcanca/pi_kiosk_smartscreen/blob/vanilla-dev/images/schematic.png?raw=true "Schematics")

## Burning an image

Images can be burned using any tool but Win32DiskImager is recommended.

## Customising an image

Default SSH password for user pi is `pwQ9FudYyD5C8xFk`
After making customizations, you can follow any tutorial to generate custom image such as [this](https://medium.com/platformer-blog/creating-a-custom-raspbian-os-image-for-production-3fcb43ff3630) or [this](https://gist.github.com/selimnairb/ba819d936d0d3c9ab9d5a46adf887842).

For a shorter approach, you can start by burning the downloaded img and before putting into RPi, remove the following line from the `/boot/cmdline.txt` file:
`init=/usr/lib/raspi-config/init_resize.sh`
This will prevent the Pi from expanding its file system upon boot. We need this removed, because we want to keep our partition as small as possible.
Next, boot from the SD card as you normally would. Install all the applications you want.
When your done, put your SD card back in to your Mac. Next, put the part your just removed from `/boot/cmdline.txt` back. After that you can clone the SD card with DD or Win32DiskImager. This approach might not be usable if heavy modifications are going to be made, give it a shot.

