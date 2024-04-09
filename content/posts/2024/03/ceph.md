+++
title = 'Ceph'
date = 2024-03-09T10:49:47-05:00
draft = false
+++

# Ceph install

## Prepare the host
```bash
sudo zypper in podman
```

## Install cephadm
### SUSE
The suse's build-in ceph is out of date, so use the curl install instead
```bash
CEPH_RELEASE=18.2.0 # replace this with the active release
curl --silent --remote-name --location https://download.ceph.com/rpm-${CEPH_RELEASE}/el9/noarch/cephadm
chmod +x cephadm
```

### RHEL
```bash
sudo dnf install --assumeyes centos-release-ceph-reef
sudo dnf install --assumeyes cephadm
```

## Bootstrap the cluster
```bash
#cephadm bootstrap --mon-ip *<mon-ip>* --cluster-network *<secondary ceph network>*
sudo ./cephadm bootstrap --mon-ip 10.240.1.101 --cluster-network 10.241.1.0/24
```

## Add Host
```bash
export NEW_CEPH_HOST=c2
export NEW_CEPH_IP=10.240.1.102
ssh-copy-id -f -i /etc/ceph/ceph.pub root@$NEW_CEPH_IP
#ceph orch host add *<newhost>* [*<ip>*] [*<label1> ...*]
sudo ./cephadm shell -- ceph orch host add $NEW_CEPH_HOST $NEW_CEPH_IP _admin
```

## Prepare nvme for bluestore db and wal
### wipe disk if needed
```bash
# be very careful with the following command and only target the disk you need to clean
wipefs /dev/nvme0n1
sudo wipefs --all /dev/nvme0n1
```

### create lvm lv for db
```bash
sudo vgcreate vg-ceph-ssd /dev/nvme0n1

# sudo lvremove -y /dev/vg-ceph-ssd/d01
# sudo lvremove -y /dev/vg-ceph-ssd/d02
# sudo lvremove -y /dev/vg-ceph-ssd/d03
# sudo lvremove -y /dev/vg-ceph-ssd/d04
# sudo lvremove -y /dev/vg-ceph-ssd/d05
# sudo lvremove -y /dev/vg-ceph-ssd/d06
# sudo lvremove -y /dev/vg-ceph-ssd/d07
# sudo lvremove -y /dev/vg-ceph-ssd/d08
# sudo lvremove -y /dev/vg-ceph-ssd/d09
# sudo lvremove -y /dev/vg-ceph-ssd/d10
# sudo lvremove -y /dev/vg-ceph-ssd/d11
# sudo lvremove -y /dev/vg-ceph-ssd/d12

sudo lvcreate -L 100G -n d01 vg-ceph-ssd
sudo lvcreate -L 100G -n d02 vg-ceph-ssd
sudo lvcreate -L 100G -n d03 vg-ceph-ssd
sudo lvcreate -L 100G -n d04 vg-ceph-ssd
sudo lvcreate -L 100G -n d05 vg-ceph-ssd
sudo lvcreate -L 100G -n d06 vg-ceph-ssd
sudo lvcreate -L 100G -n d07 vg-ceph-ssd
sudo lvcreate -L 100G -n d08 vg-ceph-ssd
sudo lvcreate -L 100G -n d09 vg-ceph-ssd
sudo lvcreate -L 100G -n d10 vg-ceph-ssd
sudo lvcreate -L 100G -n d11 vg-ceph-ssd
sudo lvcreate -L 100G -n d12 vg-ceph-ssd

```

### create osds
```bash
sudo ./cephadm shell
ceph orch daemon add osd c1:data_devices=/dev/sda,db_devices=/dev/vg-ceph-ssd/d01
ceph orch daemon add osd c1:data_devices=/dev/sdb,db_devices=/dev/vg-ceph-ssd/d02
ceph orch daemon add osd c1:data_devices=/dev/sdc,db_devices=/dev/vg-ceph-ssd/d03
ceph orch daemon add osd c1:data_devices=/dev/sdd,db_devices=/dev/vg-ceph-ssd/d04
ceph orch daemon add osd c1:data_devices=/dev/sde,db_devices=/dev/vg-ceph-ssd/d05
ceph orch daemon add osd c1:data_devices=/dev/sdf,db_devices=/dev/vg-ceph-ssd/d06
ceph orch daemon add osd c1:data_devices=/dev/sdg,db_devices=/dev/vg-ceph-ssd/d07
ceph orch daemon add osd c1:data_devices=/dev/sdh,db_devices=/dev/vg-ceph-ssd/d08
ceph orch daemon add osd c1:data_devices=/dev/sdi,db_devices=/dev/vg-ceph-ssd/d09
ceph orch daemon add osd c1:data_devices=/dev/sdj,db_devices=/dev/vg-ceph-ssd/d10
ceph orch daemon add osd c1:data_devices=/dev/sdk,db_devices=/dev/vg-ceph-ssd/d11
ceph orch daemon add osd c1:data_devices=/dev/sdl,db_devices=/dev/vg-ceph-ssd/d12

ceph orch daemon add osd c2:data_devices=/dev/sda,db_devices=/dev/vg-ceph-ssd/d01
ceph orch daemon add osd c2:data_devices=/dev/sdb,db_devices=/dev/vg-ceph-ssd/d02
ceph orch daemon add osd c2:data_devices=/dev/sdc,db_devices=/dev/vg-ceph-ssd/d03
ceph orch daemon add osd c2:data_devices=/dev/sdd,db_devices=/dev/vg-ceph-ssd/d04
ceph orch daemon add osd c2:data_devices=/dev/sde,db_devices=/dev/vg-ceph-ssd/d05
ceph orch daemon add osd c2:data_devices=/dev/sdf,db_devices=/dev/vg-ceph-ssd/d06
ceph orch daemon add osd c2:data_devices=/dev/sdg,db_devices=/dev/vg-ceph-ssd/d07
ceph orch daemon add osd c2:data_devices=/dev/sdh,db_devices=/dev/vg-ceph-ssd/d08
ceph orch daemon add osd c2:data_devices=/dev/sdi,db_devices=/dev/vg-ceph-ssd/d09
ceph orch daemon add osd c2:data_devices=/dev/sdj,db_devices=/dev/vg-ceph-ssd/d10
ceph orch daemon add osd c2:data_devices=/dev/sdk,db_devices=/dev/vg-ceph-ssd/d11
ceph orch daemon add osd c2:data_devices=/dev/sdl,db_devices=/dev/vg-ceph-ssd/d12

ceph orch daemon add osd c3:data_devices=/dev/sda,db_devices=/dev/vg-ceph-ssd/d01
ceph orch daemon add osd c3:data_devices=/dev/sdb,db_devices=/dev/vg-ceph-ssd/d02
ceph orch daemon add osd c3:data_devices=/dev/sdc,db_devices=/dev/vg-ceph-ssd/d03
ceph orch daemon add osd c3:data_devices=/dev/sdd,db_devices=/dev/vg-ceph-ssd/d04
ceph orch daemon add osd c3:data_devices=/dev/sde,db_devices=/dev/vg-ceph-ssd/d05
ceph orch daemon add osd c3:data_devices=/dev/sdf,db_devices=/dev/vg-ceph-ssd/d06
ceph orch daemon add osd c3:data_devices=/dev/sdg,db_devices=/dev/vg-ceph-ssd/d07
ceph orch daemon add osd c3:data_devices=/dev/sdh,db_devices=/dev/vg-ceph-ssd/d08
ceph orch daemon add osd c3:data_devices=/dev/sdi,db_devices=/dev/vg-ceph-ssd/d09
ceph orch daemon add osd c3:data_devices=/dev/sdm,db_devices=/dev/vg-ceph-ssd/d10
ceph orch daemon add osd c3:data_devices=/dev/sdk,db_devices=/dev/vg-ceph-ssd/d11
ceph orch daemon add osd c3:data_devices=/dev/sdl,db_devices=/dev/vg-ceph-ssd/d12
```




# create a fast osd for fast pool
```bash
sudo lvcreate -L 500G -n fast vg-ceph-ssd
```

### Create User
```bash
radosgw-admin user create --uid=wujun --display-name="Wujun Zhou" --email=w@ellieiris.com
```

### add hdd and ssd crush rule set
```bash
ceph osd crush rule create-replicated ssd default host hdd
ceph osd crush rule create-replicated ssd default host ssd
ceph osd crush rule dump
ceph config set osd osd_pool_default_crush_rule 1 # choose the default id
```

### set pool rule set
```bash
ceph osd lspools
#ceph osd pool set POOL_NAME crush_rule RULENAME

```