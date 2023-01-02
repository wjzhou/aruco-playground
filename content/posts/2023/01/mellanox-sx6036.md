---
title: "Mellanox SX6036"
date: 2023-01-02T16:04:12-05:00
draft: false
categories: 
- linux
tags:
- rdma
- ethernet
---

The Mellanox SX6036 is a 36 ports switch that support both infinitband and price is very good on ebay. (I bought mine at $200 + $50 for the ethernet activation)

Manual: https://delivery04.dhe.ibm.com/sar/CMA/XSA/MLNX-OS_VPI_v3_4_3002_UM.pdf

# reset the device in case the previous password is still there
Press the RST key and wait. (Note, it takes almost 3 minutes to reset mine instead of 15s as memtioned in the manual). After the reset, the password
would be `admin/admin`.

# enter the configure mode
When system start, the cli is in Standard mode, need to enter the configure mode to make any changes.
- `enable` to enter Enable mode. (the prompt would change from `>` to `#`)
- `configure terminal`to enter Config mode. (the prompt would change from `#` to `(config) #`)

E.g.
```
Mellanox Switch

switch-e1be2c [standalone: master] > enable
switch-e1be2c [standalone: master] # configure terminal
switch-e1be2c [standalone: master] (config) #
```

# save the configureration
```
switch-e1be2c [standalone: master] (config) # write memory
```


# switch port mode between ib/eth
## show port types
```
switch-e1be2c [standalone: master] (config) #  show ports type
Ethernet:   1/1 1/2 1/3 1/4 1/5 1/6 1/7 1/8 1/9 1/10 1/11 1/12 1/13 1/14 1/15 1/16 1/17 1/18 
InfiniBand: 1/19 1/20 1/21 1/22 1/23 1/24 1/25 1/26 1/27 1/28 1/29 1/30 1/31 1/32 1/33 1/34 1/35 1/36 
```

## shutdown ports
For this demo, the port 1-16 were in ethernet mode and 17-36 were in ib mode.

Please adjust the command based on your current configureation
```
switch-e1be2c [standalone: master] (config) # interface ethernet 1/1-1/18 shutdown
switch-e1be2c [standalone: master] (config) # interface ib 1/19-1/36 shutdown
```

## switch the port type
```
switch-e1be2c [standalone: master] (config) # port 1/1-1/18 type infiniband force
switch-e1be2c [standalone: master] (config) # port 1/19-1/36 type ethernet force
```

## no shutdown the ports
```
# for some reason, on my switch, directly calling the following doesn't work for ib
# interface ib 1/1-1/18 no shutdown
switch-e1be2c [standalone: master] (config) # interface ib 1/1-1/18
switch-e1be2c [standalone: master] (config interface ib 1/1-1/18) # no shutdown
switch-e1be2c [standalone: master] (config interface ib 1/1-1/18) # exit
switch-e1be2c [standalone: master] (config) # interface ethernet 1/19-1/36 no shutdown
```

## set port speed and mtu
### ethernet
```
switch-e1be2c [standalone: master] (config) # interface ethernet 1/19-1/36
switch-e1be2c [standalone: master] (config interface ethernet 1/19-1/36) # shutdown
switch-e1be2c [standalone: master] (config interface ethernet 1/19-1/36) # speed 56000
switch-e1be2c [standalone: master] (config interface ethernet 1/19-1/36) # mtu 9000
switch-e1be2c [standalone: master] (config interface ethernet 1/19-1/36) # no shutdown
switch-e1be2c [standalone: master] (config interface ethernet 1/19-1/36) # exit
```
### infiniband
```

switch-e1be2c [standalone: master] (config) # interface ib 1/1-1/18
switch-e1be2c [standalone: master] (config interface ib 1/1-1/18) # shutdown
# from manual: If the other side of the link is a SwitchX® or ConnectX®-3 device, to allow the link to
# raise in FDR speed, QDR speed must also be allowed
switch-e1be2c [standalone: master] (config interface ib 1/1-1/18) # speed qdr fdr
switch-e1be2c [standalone: master] (config interface ib 1/1-1/18) # no shutdown
switch-e1be2c [standalone: master] (config interface ib 1/1-1/18) # exit
```

# fan setting
By default, the fan is too noisy in my place, the following will change the speed of the fan, please monitor the temp after changing anything.
## show fan speed
```
switch-e1be2c [standalone: master] (config) # show fan
=====================================================
Module          Device          Fan  Speed     Status
                                     (RPM)           
=====================================================
FAN             FAN             F1   4920.00   OK
FAN             FAN             F2   4920.00   OK
FAN             FAN             F3   4920.00   OK
FAN             FAN             F4   4860.00   OK
PS1             FAN             F1   4050.00   OK
PS2             FAN             -    -         NOT PRESENT
```

## set spped of fan
```
switch-e1be2c [standalone: master] (config) # fae mlxi2c set_fan /FAN/FAN 1 18
switch-e1be2c [standalone: master] (config) # fae mlxi2c set_fan /PS1/FAN 1 14
```

Note: it seems set /FAN/FAN 1 would set all 4 FANs. Also, do not set the value too low, when the temp is higher than a threshold, the fan will speed up.
