---
title: "Apt Key Add Keysig"
date: 2021-08-17T10:13:19-04:00
draft: false
categories: 
- linux
tags:
- ros
- apt
---

For some reason, recently, the Key used by ros is expiring frequently. E.g. when an warning like this when `apt update`:
```
W: An error occurred during the signature verification. The repository is not updated and the previous index files will be used. GPG error: http://packages.ros.org/ros/ubuntu bionic InRelease: The following signatures were invalid: EXPKEYSIG F42ED6FBAB17C654 Open Robotics <info@osrfoundation.org>
W: Failed to fetch http://packages.ros.org/ros/ubuntu/dists/bionic/InRelease  The following signatures were invalid: EXPKEYSIG F42ED6FBAB17C654 Open Robotics <info@osrfoundation.org>
W: Some index files failed to download. They have been ignored, or old ones used instead.
```

This can be used to retrive the key from GPG for apt: (`F42ED6FBAB17C654` is the Key Signature)
```
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys F42ED6FBAB17C654
```