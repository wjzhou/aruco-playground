---
title: "Mellanox Mcx314a Bcct Flash Mcx354a Fcct"
date: 2023-01-02T10:50:14-05:00
draft: true
---

The following command can be used to cross flash the Mellanox MCX314A-BCCT (Ethernet only) to Mellanox MCX354A-FCCT (VPI).

# download and unzip the firmware
https://network.nvidia.com/support/firmware/connectx3proib/
```
wget http://www.mellanox.com/downloads/firmware/fw-ConnectX3Pro-rel-2_42_5000-MCX354A-FCC_Ax-FlexBoot-3.4.752.bin.zip
unzip fw-ConnectX3Pro-rel-2_42_5000-MCX354A-FCC_Ax-FlexBoot-3.4.752.bin.zip
```

# install flashing tool
opensuse:
```
sudo zypper install mstflint
```

# get the pcie id
```
sudo lspci | grep Mellanox
```
**03:00.0** Network controller: Mellanox Technologies MT27520 Family [ConnectX-3 Pro]

This `03:00.0` should be passed into the mstflint's -d parameter.

# flash the firmware
```
sudo mstflint -nofs --ignore_dev_data --guid=000000000000050 --use_image_ps --allow_psid_change -d03:00.0 -i fw-ConnectX3Pro-rel-2_42_5000-MCX354A-FCC_Ax-FlexBoot-3.4.752.bin burn
```
Where
```
--nofs, Burn image in a non failsafe manner, we are cross flashing, so we need this flag to skip the validation
--ignore_dev_data, use the settings from the image instead of the exising device
--guid=000000000000050, The GUID, please keep it unique within the subnet, see note in the following
--use_image_ps, we are overriding the PS from MCX314A's MT_1090111023 to MCX354A-FCCT's MT_1090111019
--allow_psid_change, required for the override
```

Note: for the --guid, it need to be unique inside the subnet.
```
reference from mstflint -hh:
GUID base value. 4 GUIDs are automatically
  assigned to the following values:

  guid   -> node GUID
  guid+1 -> port1
  guid+2 -> port2
  guid+3 -> system image GUID.
```

# switch the port type from VPI to ethernet/ib (optional)
## get the current status
```
sudo mstconfig -d 03:00.0 query
```
```
Device #1:
----------

Device type:    ConnectX3Pro
Device:         48:00.0

Configurations:                         Next Boot
    SRIOV_EN                            True(1)
    NUM_OF_VFS                          8
    LINK_TYPE_P1                        VPI(3)
    LINK_TYPE_P2                        VPI(3)
    LOG_BAR_SIZE                        3
    BOOT_PKEY_P1                        0
    BOOT_PKEY_P2                        0
    BOOT_OPTION_ROM_EN_P1               True(1)
    BOOT_VLAN_EN_P1                     False(0)
    BOOT_RETRY_CNT_P1                   0
    LEGACY_BOOT_PROTOCOL_P1             PXE(1)
    BOOT_VLAN_P1                        1
    BOOT_OPTION_ROM_EN_P2               True(1)
    BOOT_VLAN_EN_P2                     False(0)
    BOOT_RETRY_CNT_P2                   0
    LEGACY_BOOT_PROTOCOL_P2             PXE(1)
    BOOT_VLAN_P2                        1
    IP_VER_P1                           IPv4(0)
    IP_VER_P2                           IPv4(0)
    CQ_TIMESTAMP                        True(1)
```

## set port config
```
sudo mstconfig -d 48:00.0 set LINK_TYPE_P1=ib LINK_TYPE_P2=eth
```

## after reboot
```
sudo mstconfig -d 03:00.0 query
```
```
Device #1:
----------

Device type:    ConnectX3Pro
Device:         03:00.0

Configurations:                         Next Boot
    SRIOV_EN                            True(1)
    NUM_OF_VFS                          8
    LINK_TYPE_P1                        IB(1)
    LINK_TYPE_P2                        ETH(2)
    LOG_BAR_SIZE                        3
    BOOT_PKEY_P1                        0
    BOOT_PKEY_P2                        0
    BOOT_OPTION_ROM_EN_P1               True(1)
    BOOT_VLAN_EN_P1                     False(0)
    BOOT_RETRY_CNT_P1                   0
    LEGACY_BOOT_PROTOCOL_P1             PXE(1)
    BOOT_VLAN_P1                        1
    BOOT_OPTION_ROM_EN_P2               True(1)
    BOOT_VLAN_EN_P2                     False(0)
    BOOT_RETRY_CNT_P2                   0
    LEGACY_BOOT_PROTOCOL_P2             PXE(1)
    BOOT_VLAN_P2                        1
    IP_VER_P1                           IPv4(0)
    IP_VER_P2                           IPv4(0)
    CQ_TIMESTAMP                        True(1)
```
