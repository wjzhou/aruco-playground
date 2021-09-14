---
title: "Kvm Windows Timer for High Idle Cpu"
date: 2021-08-17T10:00:37-04:00
draft: false
categories: 
- linux
tags:
- kvm
---

For windows newer than 1803, it would have a high CPU on host (20%) even when the 
guest CPU is idle. It needs the following Hyper-V Enlightenments.
 <https://github.com/qemu/qemu/blob/master/docs/hyperv.txt>

```xml
<hyperv>
    <synic state='on'/>
    <stimer state='on'/>
</hyperv>
```

The end xml:
```xml
<hyperv>
  <relaxed state='on'/>
  <vapic state='on'/>
  <spinlocks state='on' retries='8191'/>
  <synic state='on'/>
  <stimer state='on'/>
</hyperv>
```
These should be the default setting when create the vm from vm-manager. Keep here for reference.
```xml
<clock offset='localtime'>
   <timer name='rtc' tickpolicy='catchup'/>
   <timer name='pit' tickpolicy='delay'/>
   <timer name='hpet' present='no'/>
   <timer name='hypervclock' present='yes'/>
 </clock>
```

Reference:
<https://bugzilla.redhat.com/show_bug.cgi?id=1610461>

