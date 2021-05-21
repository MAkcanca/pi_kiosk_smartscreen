#!/bin/bash
wpa_cli disconnect || :
wpa_cli remove_network 0 || :
wpa_cli save_config || :
wpa_cli -i wlan0 reconfigure || :
rm /home/pi/smartscreen/public/cache.jpg || :
systemctl restart wifi-setup